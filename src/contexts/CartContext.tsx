
import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { CartItem, Product } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface CartContextProps {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string>("");
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  // Set up a session ID for anonymous users
  useEffect(() => {
    const storedSessionId = localStorage.getItem("filiyaa_session_id");
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = uuidv4();
      localStorage.setItem("filiyaa_session_id", newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  // Merge anonymous cart with user cart on login
  useEffect(() => {
    if (isAuthenticated && user) {
      mergeLocalCartWithUser(user.id);
    } else {
      fetchCartItems();
    }
    // eslint-disable-next-line
  }, [isAuthenticated, user, sessionId]);

  // Fetch the cart items according to login state
  const fetchCartItems = async () => {
    setIsLoading(true);
    try {
      let query = supabase.from('cart_items').select('*');

      if (isAuthenticated && user) {
        query = query.eq("user_id", user.id);
      } else {
        query = query.eq("session_id", sessionId).is("user_id", null);
      }
      const { data: cartData, error: cartError } = await query;

      if (cartError) throw cartError;

      // Fetch product details for each cart item
      if (cartData && cartData.length > 0) {
        const productsData = await Promise.all(
          cartData.map(async (item) => {
            const { data: product, error: productError } = await supabase
              .from('products')
              .select('*')
              .eq("id", item.product_id)
              .single();

            if (productError) throw productError;

            const cartItem: CartItem = {
              id: item.id,
              product_id: item.product_id,
              quantity: item.quantity,
              product: product as Product,
            };

            return cartItem;
          })
        );
        setCartItems(productsData);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast({
        title: "Error fetching your cart",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Merge local (anonymous) cart with user's cart when user logs in
  const mergeLocalCartWithUser = async (userId: string) => {
    setIsLoading(true);
    try {
      // 1. Get cart items for session (user_id is null)
      const { data: anonCart, error: anonError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('session_id', sessionId)
        .is('user_id', null);

      if (anonError) throw anonError;

      // 2. Get cart items for user
      const { data: userCart, error: userError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId);

      if (userError) throw userError;

      // 3. For each anon cart item, either merge quantities or update user_id
      if (anonCart && anonCart.length > 0) {
        for (const anonItem of anonCart) {
          const match = userCart?.find((c) => c.product_id === anonItem.product_id);
          if (match) {
            // Update quantity on user cart and delete anon item
            await supabase
              .from('cart_items')
              .update({
                quantity: match.quantity + anonItem.quantity,
                updated_at: new Date().toISOString(),
              })
              .eq('id', match.id);

            await supabase
              .from('cart_items')
              .delete()
              .eq('id', anonItem.id);
          } else {
            // Transfer anon cart item to user
            await supabase
              .from('cart_items')
              .update({ user_id: userId })
              .eq('id', anonItem.id);
          }
        }
      }
      // 4. Fetch the updated user cart
      await fetchCartItems();
    } catch (err) {
      console.error("Error merging carts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product: Product, quantity: number) => {
    setIsLoading(true);
    try {
      // Check if product already exists in cart
      const existingItem = cartItems.find(
        (item) => item.product_id === product.id
      );

      if (existingItem) {
        // Update existing cart item
        const { error } = await supabase
          .from('cart_items')
          .update({
            quantity: existingItem.quantity + quantity,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingItem.id);

        if (error) {
          console.error("Error updating cart item:", error);
          throw error;
        }

        // Update local state
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === existingItem.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        );
      } else {
        // Add new cart item with session_id and (if authenticated) user_id
        const insertData: any = {
          session_id: sessionId,
          product_id: product.id,
          quantity,
        };

        if (isAuthenticated && user) {
          insertData.user_id = user.id;
        }

        const { data, error } = await supabase
          .from('cart_items')
          .insert(insertData)
          .select()
          .single();

        if (error) {
          console.error("Error adding to cart:", error);
          throw error;
        }

        if (data) {
          const newCartItem: CartItem = {
            id: data.id,
            product_id: product.id,
            quantity,
            product,
          };
          setCartItems((prev) => [...prev, newCartItem]);
        }
      }

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });

      return Promise.resolve();
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error adding to cart",
        description: "Please try again later",
        variant: "destructive",
      });
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({
          quantity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", itemId);

      if (error) throw error;

      setCartItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating cart:", error);
      toast({
        title: "Error updating cart",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq("id", itemId);

      if (error) throw error;

      setCartItems((prev) => prev.filter((item) => item.id !== itemId));

      toast({
        title: "Item removed",
        description: "The item has been removed from your cart",
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast({
        title: "Error removing item",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    try {
      let query = supabase.from('cart_items').delete();
      if (isAuthenticated && user) {
        query = query.eq("user_id", user.id);
      } else {
        query = query.eq("session_id", sessionId).is("user_id", null);
      }
      const { error } = await query;
      if (error) throw error;
      setCartItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast({
        title: "Error clearing cart",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isLoading,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ... End of file
