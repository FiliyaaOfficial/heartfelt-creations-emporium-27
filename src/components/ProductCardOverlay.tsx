
import React, { useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Product } from '@/types';
import { toast } from 'sonner';

interface ProductCardOverlayProps {
  product: Product;
}

const ProductCardOverlay: React.FC<ProductCardOverlayProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAddingToCart) return;
    
    try {
      setIsAddingToCart(true);
      
      await addToCart(product, 1);
      
      toast.success("Added to cart", {
        description: `${product.name} has been added to your cart`,
        action: {
          label: "View Cart",
          onClick: () => window.location.href = "/cart"
        },
      });
      
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Could not add to cart", {
        description: "There was a problem adding this item to your cart"
      });
    } finally {
      setTimeout(() => {
        setIsAddingToCart(false);
      }, 1000);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAddingToWishlist) return;
    
    try {
      setIsAddingToWishlist(true);
      
      const inWishlist = isInWishlist(product.id);
      
      if (inWishlist) {
        await removeFromWishlist(product.id);
        toast.success("Removed from wishlist", {
          description: `${product.name} has been removed from your wishlist`
        });
      } else {
        await addToWishlist(product);
        toast.success("Added to wishlist", {
          description: `${product.name} has been added to your wishlist`,
          action: {
            label: "View Wishlist",
            onClick: () => window.location.href = "/wishlist"
          },
        });
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Could not update wishlist", {
        description: "There was a problem updating your wishlist"
      });
    } finally {
      setTimeout(() => {
        setIsAddingToWishlist(false);
      }, 1000);
    }
  };

  const isInWishlistAlready = isInWishlist(product.id);

  return (
    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
      <div className="flex flex-col gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
        <button 
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="premium-button bg-white text-heartfelt-burgundy rounded-full min-w-[150px] transform hover:scale-105 transition-transform flex items-center justify-center gap-2"
        >
          {isAddingToCart ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-heartfelt-burgundy border-t-transparent rounded-full animate-spin"></span>
              Adding...
            </span>
          ) : (
            <>
              <ShoppingBag size={18} />
              Add to Cart
            </>
          )}
        </button>
        
        <button 
          onClick={handleWishlistToggle}
          disabled={isAddingToWishlist}
          className={`${
            isInWishlistAlready 
              ? "bg-heartfelt-pink text-white hover:bg-heartfelt-burgundy" 
              : "premium-button-outline bg-white"
          } rounded-full min-w-[150px] transform hover:scale-105 transition-transform flex items-center justify-center gap-2`}
        >
          {isAddingToWishlist ? (
            <span className="flex items-center gap-2">
              <span className={`h-4 w-4 border-2 ${isInWishlistAlready ? 'border-white' : 'border-heartfelt-burgundy'} border-t-transparent rounded-full animate-spin`}></span>
              {isInWishlistAlready ? 'Removing...' : 'Adding...'}
            </span>
          ) : (
            <>
              <Heart size={18} className={isInWishlistAlready ? "fill-white" : ""} />
              {isInWishlistAlready ? "In Wishlist" : "Add to Wishlist"}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCardOverlay;
