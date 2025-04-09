
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      addToCart(product, 1);
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
    }
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (!isInWishlist(product.id)) {
        addToWishlist(product);
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
