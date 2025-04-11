
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';
import ProductCardOverlay from './ProductCardOverlay';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="premium-card relative overflow-hidden group">
        {/* Image container */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Overlay with buttons - only shown on hover */}
          <ProductCardOverlay product={product} />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.is_new && (
              <span className="premium-badge bg-heartfelt-burgundy text-white">New</span>
            )}
            {product.is_bestseller && (
              <span className="premium-badge bg-heartfelt-pink text-white">Bestseller</span>
            )}
            {product.is_customizable && (
              <span className="premium-badge bg-heartfelt-cream text-heartfelt-burgundy">Customizable</span>
            )}
            {product.badges && product.badges.map((badge) => (
              <span key={badge} className="premium-badge bg-heartfelt-dark text-white">{badge}</span>
            ))}
          </div>
        </div>
        
        {/* Product info */}
        <div className="p-4">
          <p className="text-sm text-muted-foreground mb-1">{product.category}</p>
          <h3 className="font-medium text-lg mb-1 line-clamp-1">{product.name}</h3>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-lg text-heartfelt-burgundy">
              {formatCurrency(product.price)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
