
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { Badge } from './ui/badge';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { toast } from 'sonner';
import ProductCardOverlay from './ProductCardOverlay';
import AddToCartButton from './AddToCartButton';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  
  const inWishlist = isInWishlist(product.id);
  
  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAddingToWishlist) return;
    
    try {
      setIsAddingToWishlist(true);
      
      if (inWishlist) {
        await removeFromWishlist(product.id);
        toast.success(`Removed from wishlist`, {
          description: `${product.name} has been removed from your wishlist`
        });
      } else {
        await addToWishlist(product);
        toast.success(`Added to wishlist`, {
          description: `${product.name} has been added to your wishlist`,
          action: {
            label: "View Wishlist",
            onClick: () => window.location.href = "/wishlist"
          }
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

  const renderBadges = () => {
    if (!product.badges || product.badges.length === 0) return null;
    
    return (
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {product.badges.map((badge, index) => {
          let badgeClass = "bg-gray-500";
          
          if (badge.toLowerCase() === 'new') {
            badgeClass = "bg-heartfelt-burgundy";
          } else if (badge.toLowerCase() === 'sale') {
            badgeClass = "bg-heartfelt-pink";
          } else if (badge.toLowerCase() === 'bestseller') {
            badgeClass = "bg-amber-500";
          } else if (badge.toLowerCase() === 'customizable') {
            badgeClass = "bg-indigo-500";
          }
          
          return (
            <Badge key={index} className={`${badgeClass} text-white capitalize`}>
              {badge}
            </Badge>
          );
        })}
        
        {product.is_new && !product.badges.includes('new') && (
          <Badge className="bg-heartfelt-burgundy text-white">New</Badge>
        )}
        
        {product.is_bestseller && !product.badges.includes('bestseller') && (
          <Badge className="bg-amber-500 text-white">Bestseller</Badge>
        )}
        
        {product.is_customizable && !product.badges.includes('customizable') && (
          <Badge className="bg-indigo-500 text-white">Customizable</Badge>
        )}
      </div>
    );
  };

  return (
    <div 
      className="group relative rounded-xl overflow-hidden border border-heartfelt-cream/50 bg-white hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block">
        {/* Product Image */}
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          <img 
            src={product.image_url || '/placeholder.svg'} 
            alt={product.name} 
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Badges */}
          {renderBadges()}
          
          {/* Wishlist button */}
          <button 
            onClick={handleWishlistToggle}
            className={`absolute top-2 right-2 p-2 rounded-full 
              ${inWishlist 
                ? 'bg-heartfelt-pink text-white' 
                : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:text-heartfelt-burgundy'} 
              shadow-sm z-10`}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isAddingToWishlist ? (
              <span className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin block"></span>
            ) : (
              <Heart size={20} className={inWishlist ? "fill-white" : ""} />
            )}
          </button>
          
          {/* Hover overlay with actions */}
          {isHovered && <ProductCardOverlay product={product} />}
        </div>

        {/* Product details */}
        <div className="p-3">
          <h3 className="font-medium text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
          
          <div className="flex justify-between items-center mb-2">
            {product.compare_at_price && product.compare_at_price > product.price ? (
              <div className="flex gap-2 items-center">
                <span className="font-semibold text-heartfelt-burgundy">${product.price.toFixed(2)}</span>
                <span className="text-gray-500 text-sm line-through">${product.compare_at_price.toFixed(2)}</span>
              </div>
            ) : (
              <span className="font-semibold">${product.price.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>
      
      {/* Quick add button (shown on mobile, where hover doesn't work well) */}
      <div className="p-3 pt-0 md:hidden">
        <AddToCartButton 
          product={product} 
          quantity={1}
          variant="outline"
          size="sm"
          className="w-full border-heartfelt-burgundy/50 text-heartfelt-burgundy hover:bg-heartfelt-burgundy/10"
        />
      </div>
    </div>
  );
};

export default ProductCard;
