
import React, { useState, memo } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star, Sparkles, TrendingUp, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCurrency } from "@/hooks/useCurrency";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = memo(({ product, className = "" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { formatCurrency } = useCurrency();
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
    const allBadges = new Set<string>(); // Use Set to prevent duplicates
    const badgeElements = [];
    
    // Add custom badges from product.badges array
    if (product.badges && product.badges.length > 0) {
      product.badges.forEach((badge) => {
        const normalizedBadge = badge.toLowerCase();
        if (!allBadges.has(normalizedBadge)) {
          allBadges.add(normalizedBadge);
          badgeElements.push({
            text: badge,
            variant: "custom" as const,
            icon: <Gift size={12} />
          });
        }
      });
    }
    
    // Add status badges based on boolean flags (check for duplicates)
    const statusBadges = [
      { condition: product.is_new, text: "New", variant: "new" as const, icon: <Sparkles size={12} /> },
      { condition: product.is_bestseller, text: "Bestseller", variant: "bestseller" as const, icon: <TrendingUp size={12} /> },
      { condition: product.is_featured, text: "Featured", variant: "featured" as const, icon: <Star size={12} /> },
      { condition: product.is_customizable, text: "Customizable", variant: "customizable" as const, icon: <Gift size={12} /> }
    ];
    
    statusBadges.forEach(({ condition, text, variant, icon }) => {
      if (condition) {
        const normalizedText = text.toLowerCase();
        // Check if this badge type already exists in custom badges
        const isDuplicate = Array.from(allBadges).some(badge => 
          badge.includes(normalizedText) || normalizedText.includes(badge)
        );
        
        if (!isDuplicate && !allBadges.has(normalizedText)) {
          allBadges.add(normalizedText);
          badgeElements.push({
            text,
            variant,
            icon
          });
        }
      }
    });
    
    // Render badges with improved styling
    return badgeElements.slice(0, 3).map((badge, index) => {
      const getBadgeStyles = (variant: string) => {
        switch (variant) {
          case "new":
            return "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm border-0";
          case "bestseller":
            return "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm border-0";
          case "featured":
            return "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm border-0";
          case "customizable":
            return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm border-0";
          default:
            return "bg-gradient-to-r from-heartfelt-burgundy to-heartfelt-dark text-white shadow-sm border-0";
        }
      };

      return (
        <Badge 
          key={`${badge.text}-${index}`} 
          className={`text-xs font-medium px-2 py-1 flex items-center gap-1 ${getBadgeStyles(badge.variant)}`}
        >
          {badge.icon}
          {badge.text}
        </Badge>
      );
    });
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
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          
          {/* Badges */}
          {renderBadges().length > 0 && (
            <div className="absolute top-3 left-3 flex flex-col gap-1 max-w-[calc(100%-6rem)] z-10">
              {renderBadges()}
            </div>
          )}
          
          {/* Wishlist Button */}
          <button
            onClick={handleAddToWishlist}
            className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-all duration-200 group/heart z-10"
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
              {formatCurrency(product.price)}
            </span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="text-sm text-gray-400 line-through">
                {formatCurrency(product.compare_at_price)}
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
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
