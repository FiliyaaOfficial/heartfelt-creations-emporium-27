
import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <Link to={`/product/${product.id}`}>
      <div className="group relative rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300">
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
              <span className="bg-filiyaa-peach-500 text-white text-xs font-medium px-2.5 py-1 rounded">New</span>
            )}
            {product.is_bestseller && (
              <span className="bg-filiyaa-cream-500 text-white text-xs font-medium px-2.5 py-1 rounded">Bestseller</span>
            )}
          </div>
          
          {/* Quick actions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button 
              aria-label="Add to wishlist" 
              className="p-2 bg-white rounded-full hover:bg-filiyaa-pink-200 hover:text-filiyaa-peach-700 transition-all"
            >
              <Heart size={18} />
            </button>
            <button 
              aria-label="Add to cart" 
              className="p-2 bg-filiyaa-peach-500 text-white rounded-full hover:bg-filiyaa-peach-600 transition-all"
              onClick={handleAddToCart}
            >
              <ShoppingBag size={18} />
            </button>
          </div>
        </div>
        
        {/* Product Details */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
          <h3 className="font-medium text-lg mb-1 line-clamp-1">{product.name}</h3>
          <p className="font-serif text-filiyaa-peach-600 font-semibold">{formatCurrency(product.price)}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
