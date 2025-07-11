
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { supabase } from '@/integrations/supabase/client';
import { Product as ProductType } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

interface FeaturedProductsProps {
  title?: string;
  subtitle?: string;
}

const FeaturedProducts = ({ 
  title = "Our Featured Products", 
  subtitle = "Explore our most loved handcrafted creations"
}: FeaturedProductsProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select()
          .eq('is_featured', true)
          .limit(8);
          
        if (error) throw error;
        setProducts(data as ProductType[]);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        toast({
          title: "Error fetching products",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [toast]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
      
      // Update scroll position after scrolling
      setTimeout(() => {
        if (scrollContainerRef.current) {
          setScrollPosition(scrollContainerRef.current.scrollLeft);
        }
      }, 500);
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft);
    }
  };

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = scrollContainerRef.current 
    ? scrollPosition < scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth - 5
    : true;

  return (
    <section className="bg-heartfelt-cream/30 py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h2 className="section-title">{title}</h2>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          <div className="flex gap-3">
            <Link to="/categories">
              <Button variant="outline" className="border-heartfelt-burgundy text-heartfelt-burgundy hover:bg-heartfelt-burgundy/5">
                View All Products
              </Button>
            </Link>
            <div className="flex gap-2">
              <button 
                onClick={() => scroll('left')} 
                disabled={!canScrollLeft}
                className={`p-2 rounded-full border ${canScrollLeft ? 'border-heartfelt-burgundy text-heartfelt-burgundy hover:bg-heartfelt-burgundy/5' : 'border-gray-200 text-gray-300'}`}
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => scroll('right')} 
                disabled={!canScrollRight}
                className={`p-2 rounded-full border ${canScrollRight ? 'border-heartfelt-burgundy text-heartfelt-burgundy hover:bg-heartfelt-burgundy/5' : 'border-gray-200 text-gray-300'}`}
                aria-label="Scroll right"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heartfelt-burgundy"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-10">
            <p>No featured products found.</p>
          </div>
        ) : (
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x"
            onScroll={handleScroll}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map(product => (
              <div key={product.id} className="min-w-[280px] sm:min-w-[320px] snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
