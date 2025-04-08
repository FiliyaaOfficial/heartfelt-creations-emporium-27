
import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { CartItem, Product } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Tables } from "@/lib/utils";

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

  // Fetch cart items when component mounts
  useEffect(() => {
    if (sessionId) {
      fetchCartItems();
    }
  }, [sessionId]);

  const fetchCartItems = async () => {
    setIsLoading(true);
    try {
      // Get cart items by session id
      const { data: cartData, error: cartError } = await supabase
        .from('cart_items')
        .select('*')
        .eq("session_id", sessionId);

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
            return {
              id: item.id,
              product_id: item.product_id,
              quantity: item.quantity,
              product: product as Product,
            };
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

        if (error) throw error;

        // Update local state
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === existingItem.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        );
      } else {
        // Add new cart item
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            session_id: sessionId,
            product_id: product.id,
            quantity,
          })
          .select()
          .single();

        if (error) throw error;

        // Update local state
        if (data) {
          setCartItems((prev) => [
            ...prev,
            {
              id: data.id,
              product_id: product.id,
              quantity,
              product,
            },
          ]);
        }

      }

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error adding to cart",
        description: "Please try again later",
        variant: "destructive",
      });
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

      // Update local state
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

      // Update local state
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
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq("session_id", sessionId);

      if (error) throw error;

      // Update local state
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
