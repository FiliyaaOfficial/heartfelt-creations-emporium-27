
import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
  isBestseller?: boolean;
}

const ProductCard = ({ id, name, price, image, category, isNew, isBestseller }: ProductCardProps) => {
  return (
    <div className="group relative rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300">
      {/* Product Image */}
      <div className="aspect-square overflow-hidden relative">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {isNew && (
            <span className="bg-heartfelt-burgundy text-white text-xs font-medium px-2.5 py-1 rounded">New</span>
          )}
          {isBestseller && (
            <span className="bg-heartfelt-gold text-white text-xs font-medium px-2.5 py-1 rounded">Bestseller</span>
          )}
        </div>
        
        {/* Quick actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button 
            aria-label="Add to wishlist" 
            className="p-2 bg-white rounded-full hover:bg-heartfelt-pink hover:text-heartfelt-burgundy transition-all"
          >
            <Heart size={18} />
          </button>
          <button 
            aria-label="Add to cart" 
            className="p-2 bg-heartfelt-burgundy text-white rounded-full hover:bg-opacity-90 transition-all"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
      
      {/* Product Details */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{category}</p>
        <h3 className="font-medium text-lg mb-1 line-clamp-1">{name}</h3>
        <p className="font-serif text-heartfelt-burgundy font-semibold">${price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ProductCard;
