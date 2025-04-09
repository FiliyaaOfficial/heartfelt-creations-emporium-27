
import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/lib/utils';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/components/ui/use-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const inWishlist = isInWishlist(product.id);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };
  
  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <Link to={`/product/${product.id}`}>
      <div className="premium-card group relative h-full flex flex-col">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden relative">
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {product.is_new && (
              <span className="premium-badge bg-heartfelt-burgundy text-white">New Arrival</span>
            )}
            {product.is_bestseller && (
              <span className="premium-badge bg-heartfelt-pink text-white">Bestseller</span>
            )}
          </div>
          
          {/* Quick actions */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <button 
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              className={`p-3 rounded-full transition-all transform hover:scale-110 ${
                inWishlist 
                  ? "bg-heartfelt-pink text-white" 
                  : "bg-white text-heartfelt-dark hover:bg-heartfelt-cream"
              }`}
              onClick={handleToggleWishlist}
            >
              <Heart size={18} className={inWishlist ? "fill-white" : ""} />
            </button>
            <button 
              aria-label="Add to cart" 
              className="p-3 bg-heartfelt-burgundy text-white rounded-full transform hover:scale-110 transition-all"
              onClick={handleAddToCart}
            >
              <ShoppingBag size={18} />
            </button>
          </div>
        </div>
        
        {/* Product Details */}
        <div className="p-4 flex-grow flex flex-col">
          <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
          <h3 className="font-medium text-lg mb-1 line-clamp-1 group-hover:text-heartfelt-burgundy transition-colors">{product.name}</h3>
          <p className="font-serif text-heartfelt-burgundy font-semibold mt-auto pt-2">{formatCurrency(product.price)}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
