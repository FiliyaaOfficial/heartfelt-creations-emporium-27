
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className = "" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const isInWishlistState = isInWishlist(product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    try {
      await addToCart(product, 1);
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToWishlist(product);
    } catch (error) {
      // Error handling is done in the context
    }
  };

  const renderBadges = () => {
    const badges = [];
    
    // Add custom badges from product.badges array
    if (product.badges && product.badges.length > 0) {
      product.badges.forEach((badge) => {
        badges.push(
          <Badge key={badge} variant="secondary" className="text-xs bg-heartfelt-burgundy/10 text-heartfelt-burgundy">
            {badge}
          </Badge>
        );
      });
    }
    
    // Add status badges based on boolean flags (avoid duplicates)
    const statusBadges = [];
    if (product.is_new) statusBadges.push("New");
    if (product.is_bestseller) statusBadges.push("Bestseller");
    if (product.is_featured) statusBadges.push("Featured");
    
    // Only add customizable badge if it's not already in the badges array
    if (product.is_customizable && !product.badges?.some(badge => badge.toLowerCase().includes('custom'))) {
      statusBadges.push("Customizable");
    }
    
    statusBadges.forEach((badge) => {
      badges.push(
        <Badge key={badge} variant="secondary" className="text-xs bg-heartfelt-burgundy/10 text-heartfelt-burgundy">
          {badge}
        </Badge>
      );
    });
    
    return badges;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={`group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-heartfelt-cream ${className}`}>
      <Link to={`/product/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          
          {/* Badges */}
          {renderBadges().length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[calc(100%-6rem)]">
              {renderBadges()}
            </div>
          )}
          
          {/* Wishlist Button */}
          <button
            onClick={handleAddToWishlist}
            className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-all duration-200 group/heart"
            aria-label="Add to wishlist"
          >
            <Heart 
              size={18} 
              className={`transition-colors duration-200 ${
                isInWishlistState 
                  ? "text-heartfelt-pink fill-heartfelt-pink" 
                  : "text-gray-600 group-hover/heart:text-heartfelt-pink"
              }`} 
            />
          </button>
          
          {/* Quick Add to Cart - appears on hover */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              onClick={handleAddToCart}
              disabled={isLoading || product.stock_quantity === 0}
              className="w-full bg-heartfelt-burgundy hover:bg-heartfelt-dark text-white py-2 text-sm font-medium"
              size="sm"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding...</span>
                </div>
              ) : product.stock_quantity === 0 ? (
                "Out of Stock"
              ) : (
                <>
                  <ShoppingBag size={16} className="mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* Product Info */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-heartfelt-burgundy transition-colors duration-200">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                {product.description}
              </p>
            )}
          </div>
          
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={`${
                      i < Math.floor(product.rating || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({product.review_count || 0})
              </span>
            </div>
          )}
          
          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-heartfelt-burgundy">
              {formatPrice(product.price)}
            </span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>
          
          {/* Stock Status */}
          {product.stock_quantity !== undefined && (
            <div className="text-xs">
              {product.stock_quantity === 0 ? (
                <span className="text-red-500 font-medium">Out of Stock</span>
              ) : product.stock_quantity <= 5 ? (
                <span className="text-orange-500 font-medium">
                  Only {product.stock_quantity} left
                </span>
              ) : (
                <span className="text-green-600 font-medium">In Stock</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
