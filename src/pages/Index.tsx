
import React, { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import CategorySection from '@/components/CategorySection';
import FeaturedProducts from '@/components/FeaturedProducts';
import Testimonials from '@/components/Testimonials';
import CustomOrderCta from '@/components/CustomOrderCta';
import CategoryFeaturedSection from '@/components/CategoryFeaturedSection';
import { supabase } from '@/integrations/supabase/client';
import { Product as ProductType } from '@/types';
import ProductCard from '@/components/ProductCard';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Sparkles, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import CategoryCircles from '@/components/CategoryCircles';

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
        toast.error("Failed to load products", {
          description: "Please refresh the page to try again"
        });
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
    link: string,
    icon: React.ReactNode
  ) => (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-40 left-0 w-64 h-64 rounded-full bg-heartfelt-cream/20 blur-3xl -z-10"></div>
      <div className="absolute bottom-20 right-0 w-80 h-80 rounded-full bg-heartfelt-burgundy/5 blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {icon}
              <h2 className="section-title m-0">{title}</h2>
            </div>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          <Link to={link} className="flex items-center text-heartfelt-burgundy hover:text-heartfelt-dark transition-colors">
            View all <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-[350px] bg-heartfelt-cream/20 animate-pulse rounded-xl"></div>
            ))
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-heartfelt-cream/10 rounded-xl">
              <p className="text-lg">No products found</p>
            </div>
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>

        <div className="mt-10 text-center">
          <Link to={link}>
            <Button variant="outline" className="border-heartfelt-burgundy text-heartfelt-burgundy hover:bg-heartfelt-burgundy/5">
              View All {title} <ArrowRight size={16} className="ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );

  return (
    <div className="bg-white">
      <Hero />
      <CategoryCircles />
      <CategorySection />
      <FeaturedProducts />
      
      {renderProductSection(
        "New Arrivals",
        "Our latest handcrafted creations",
        newArrivals,
        "/new-arrivals",
        <Clock size={24} className="text-heartfelt-burgundy" />
      )}
      
      {renderProductSection(
        "Best Sellers",
        "Our most loved products by customers",
        bestSellers,
        "/best-sellers",
        <TrendingUp size={24} className="text-heartfelt-burgundy" />
      )}
      
      <CategoryFeaturedSection />
      <Testimonials />
      <CustomOrderCta />
    </div>
  );
};

export default Index;
