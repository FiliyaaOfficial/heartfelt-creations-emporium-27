
import React, { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import CategorySection from '@/components/CategorySection';
import FeaturedProducts from '@/components/FeaturedProducts';
import Testimonials from '@/components/Testimonials';
import CustomOrderCta from '@/components/CustomOrderCta';
import { supabase } from '@/integrations/supabase/client';
import { Product as ProductType } from '@/types';
import ProductCard from '@/components/ProductCard';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [newArrivals, setNewArrivals] = useState<ProductType[]>([]);
  const [bestSellers, setBestSellers] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Fetch new arrivals
        const { data: newArrivalsData } = await supabase
          .from('products')
          .select()
          .eq('is_new', true)
          .order('created_at', { ascending: false })
          .limit(4);
        
        // Fetch bestsellers
        const { data: bestSellersData } = await supabase
          .from('products')
          .select()
          .eq('is_bestseller', true)
          .limit(4);
        
        if (newArrivalsData) setNewArrivals(newArrivalsData as ProductType[]);
        if (bestSellersData) setBestSellers(bestSellersData as ProductType[]);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const renderProductSection = (
    title: string,
    subtitle: string,
    products: ProductType[],
    link: string
  ) => (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="section-title">{title}</h2>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          <Link to={link} className="flex items-center text-heartfelt-burgundy hover:text-heartfelt-dark transition-colors">
            View all <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-[300px] bg-heartfelt-cream/20 animate-pulse rounded-xl"></div>
            ))
          ) : products.length === 0 ? (
            <p>No products found</p>
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>

        <div className="mt-8 text-center">
          <Link to={link}>
            <Button variant="outline" className="border-heartfelt-burgundy text-heartfelt-burgundy hover:bg-heartfelt-burgundy/5">
              View All {title}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );

  return (
    <div className="bg-heartfelt-cream/10">
      <Hero />
      <CategorySection />
      <FeaturedProducts />
      
      {renderProductSection(
        "New Arrivals",
        "Our latest handcrafted creations",
        newArrivals,
        "/new-arrivals"
      )}
      
      {renderProductSection(
        "Best Sellers",
        "Our most loved products by customers",
        bestSellers,
        "/best-sellers"
      )}
      
      <Testimonials />
      <CustomOrderCta />
    </div>
  );
};

export default Index;
