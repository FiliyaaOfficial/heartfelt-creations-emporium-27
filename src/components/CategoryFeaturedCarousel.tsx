
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface CategoryFeaturedCarouselProps {
  categoryName: string;
  limit?: number;
}

const CategoryFeaturedCarousel: React.FC<CategoryFeaturedCarouselProps> = ({ 
  categoryName,
  limit = 6 
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select()
          .eq('category', categoryName)
          .order('created_at', { ascending: false })
          .limit(limit);
        
        if (error) throw error;
        
        setProducts(data as Product[]);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [categoryName, limit]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-heartfelt-burgundy"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-serif font-semibold">{categoryName}</h2>
            {categoryName === 'New Arrivals' && (
              <span className="text-xs font-semibold bg-heartfelt-cream px-2 py-1 rounded-full text-heartfelt-burgundy">NEW</span>
            )}
            {categoryName === 'Best Sellers' && (
              <Sparkles size={18} className="text-heartfelt-burgundy" />
            )}
          </div>
          <Link 
            to={categoryName === 'New Arrivals' 
              ? '/new-arrivals' 
              : categoryName === 'Best Sellers'
              ? '/best-sellers'
              : `/category/${encodeURIComponent(categoryName)}`}
            className="text-heartfelt-burgundy hover:text-heartfelt-dark flex items-center text-sm font-medium"
          >
            View All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: products.length > 4,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {products.map((product) => (
              <CarouselItem key={product.id} className="pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </div>
        </Carousel>
        
        <div className="mt-8 text-center">
          <Link to={`/category/${encodeURIComponent(categoryName)}`}>
            <Button variant="outline" className="border-heartfelt-burgundy text-heartfelt-burgundy hover:bg-heartfelt-burgundy/5">
              View All {categoryName} <ArrowRight size={16} className="ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryFeaturedCarousel;
