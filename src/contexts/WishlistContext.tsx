
import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Product } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface WishlistItem {
  id: string;
  product_id: string;
  product: Product;
}

interface WishlistContextProps {
  wishlistItems: WishlistItem[];
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  isLoading: boolean;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextProps | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string>("");
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      const storedSessionId = localStorage.getItem("filiyaa_session_id");
      if (storedSessionId) {
        setSessionId(storedSessionId);
      } else {
        const newSessionId = uuidv4();
        localStorage.setItem("filiyaa_session_id", newSessionId);
        setSessionId(newSessionId);
      }
    }
  }, [isAuthenticated]);

  // Merge anonymous wishlist with user wishlist on login
  useEffect(() => {
    if (isAuthenticated && user) {
      mergeLocalWishlistWithUser(user.id);
    } else {
      fetchWishlistItems();
    }
  }, [isAuthenticated, user, sessionId]);

  const fetchWishlistItems = async () => {
    setIsLoading(true);
    try {
      let query = supabase.from('wishlists').select('*');

      if (isAuthenticated && user) {
        query = query.eq("user_id", user.id);
      } else {
        query = query.eq("session_id", sessionId).is("user_id", null);
      }

      const { data: wishlistData, error: wishlistError } = await query;

      if (wishlistError) throw wishlistError;

      // Fetch product details for each wishlist item
      if (wishlistData && wishlistData.length > 0) {
        const productsData = await Promise.all(
          wishlistData.map(async (item) => {
            const { data: product, error: productError } = await supabase
              .from('products')
              .select('*')
              .eq("id", item.product_id)
              .single();

            if (productError) throw productError;
            return {
              id: item.id,
              product_id: item.product_id,
              product: product as Product,
            };
          })
        );
        setWishlistItems(productsData);
      } else {
        setWishlistItems([]);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast({
        title: "Error fetching your wishlist",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Merge local (anon) wishlist with user's wishlist
  const mergeLocalWishlistWithUser = async (userId: string) => {
    setIsLoading(true);
    try {
      // 1. Get anon wishlist items
      const { data: anonItems, error: anonError } = await supabase
        .from('wishlists')
        .select('*')
        .eq('session_id', sessionId)
        .is('user_id', null);

      if (anonError) throw anonError;

      // 2. Get user wishlist items
      const { data: userItems, error: userError } = await supabase
        .from('wishlists')
        .select('*')
        .eq('user_id', userId);

      if (userError) throw userError;

      if (anonItems && anonItems.length > 0) {
        for (const anonItem of anonItems) {
          const match = userItems?.find((u) => u.product_id === anonItem.product_id);
          if (match) {
            // Duplicate item found in user wishlist, remove anon item
            await supabase.from('wishlists').delete().eq('id', anonItem.id);
          } else {
            // Transfer the anonItem to user wishlist
            await supabase.from('wishlists').update({ user_id: userId }).eq('id', anonItem.id);
          }
        }
      }
      // 3. Fetch updated wishlist for user
      await fetchWishlistItems();
    } catch (err) {
      console.error("Error merging wishlist data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const addToWishlist = async (product: Product) => {
    setIsLoading(true);
    try {
      // Check if product already exists in wishlist
      const existingItem = wishlistItems.find(
        (item) => item.product_id === product.id
      );

      if (existingItem) {
        toast({
          title: "Item already in wishlist",
          description: `${product.name} is already in your wishlist`,
        });
        setIsLoading(false);
        return Promise.resolve();
      }

      // Prepare insert data
      const insertData: any = {
        product_id: product.id,
        session_id: sessionId,
      };

      if (isAuthenticated && user) {
        insertData.user_id = user.id;
      }

      // Add new wishlist item
      const { data, error } = await supabase
        .from('wishlists')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error("Error adding to wishlist:", error);
        throw error;
      }

      // Update local state
      if (data) {
        setWishlistItems((prev) => [
          ...prev,
          {
            id: data.id,
            product_id: product.id,
            product,
          },
        ]);
      }

      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist`,
      });

      return Promise.resolve();
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast({
        title: "Error adding to wishlist",
        description: "Please try again later",
        variant: "destructive",
      });
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    setIsLoading(true);
    try {
      const itemToRemove = wishlistItems.find(item => item.product_id === productId);

      if (!itemToRemove) {
        setIsLoading(false);
        return;
      }

      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq("id", itemToRemove.id);

      if (error) throw error;

      // Update local state
      setWishlistItems((prev) => prev.filter((item) => item.product_id !== productId));

      toast({
        title: "Item removed",
        description: "The item has been removed from your wishlist",
      });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast({
        title: "Error removing item",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.product_id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        isLoading,
        totalItems: wishlistItems.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// ... End of file
