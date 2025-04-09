
import React from 'react';
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
  const { addToWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const button = e.currentTarget as HTMLButtonElement;
      const originalText = button.innerHTML;
      
      // Add loading state
      button.innerHTML = '<span class="animate-pulse">Adding...</span>';
      button.disabled = true;
      
      await addToCart(product, 1);
      
      // Show success state
      button.innerHTML = '<span>✓ Added</span>';
      
      toast.success("Added to cart", {
        description: `${product.name} has been added to your cart`,
        action: {
          label: "View Cart",
          onClick: () => window.location.href = "/cart"
        },
      });
      
      // Reset button after delay
      setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
      }, 2000);
      
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Could not add to cart", {
        description: "There was a problem adding this item to your cart"
      });
    }
  };

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const button = e.currentTarget as HTMLButtonElement;
      
      if (!isInWishlist(product.id)) {
        // Add loading state
        button.innerHTML = '<span class="animate-pulse">Adding...</span>';
        button.disabled = true;
        
        await addToWishlist(product);
        
        // Show success state
        button.innerHTML = '<span class="flex items-center justify-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>In Wishlist</span>';
        
        toast.success("Added to wishlist", {
          description: `${product.name} has been added to your wishlist`,
          action: {
            label: "View Wishlist",
            onClick: () => window.location.href = "/wishlist"
          },
        });
      } else {
        toast.info("Already in wishlist", {
          description: `${product.name} is already in your wishlist`,
          action: {
            label: "View Wishlist",
            onClick: () => window.location.href = "/wishlist"
          },
        });
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Could not add to wishlist", {
        description: "There was a problem adding this item to your wishlist"
      });
    }
  };

  const isInWishlistAlready = isInWishlist(product.id);

  return (
    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
      <div className="flex flex-col gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
        <button 
          onClick={handleAddToCart}
          className="premium-button rounded-full min-w-[150px] transform hover:scale-105 transition-transform"
        >
          <ShoppingBag size={18} />
          Add to Cart
        </button>
        
        <button 
          onClick={handleAddToWishlist}
          className={`${
            isInWishlistAlready 
              ? "bg-heartfelt-pink text-white hover:bg-heartfelt-burgundy" 
              : "premium-button-outline bg-white"
          } rounded-full min-w-[150px] transform hover:scale-105 transition-transform`}
        >
          <Heart size={18} className={isInWishlistAlready ? "fill-white" : ""} />
          {isInWishlistAlready ? "In Wishlist" : "Add to Wishlist"}
        </button>
      </div>
    </div>
  );
};

export default ProductCardOverlay;
