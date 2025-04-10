
import React from 'react';
import { Product } from '@/types';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';

interface RelatedProductsProps {
  products: Product[];
  category: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products, category }) => {
  if (products.length === 0) return null;

  return (
    <div className="mt-16 pt-8 border-t border-heartfelt-cream">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-serif font-semibold">Related Products</h2>
        <Link 
          to={`/categories/${category.toLowerCase()}`} 
          className="text-heartfelt-burgundy hover:text-heartfelt-dark font-medium text-sm flex items-center gap-1 group"
        >
          View All 
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
