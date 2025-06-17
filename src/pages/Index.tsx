import React, { useState, useEffect, lazy, Suspense } from 'react';
import Hero from '@/components/Hero';
import CategorySection from '@/components/CategorySection';
import ProductPromoBanner from '@/components/ProductPromoBanner';
import FeaturedProducts from '@/components/FeaturedProducts';
import { supabase } from '@/integrations/supabase/client';
import { Product as ProductType } from '@/types';
import ProductCard from '@/components/ProductCard';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Lazy load heavy components
const Testimonials = lazy(() => import('@/components/Testimonials'));
const CustomOrderCta = lazy(() => import('@/components/CustomOrderCta'));
const CategoryFeaturedSection = lazy(() => import('@/components/CategoryFeaturedSection'));

const Index = () => {
  const [newArrivals, setNewArrivals] = useState<ProductType[]>([]);
  const [bestSellers, setBestSellers] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Use Promise.all for parallel requests to improve performance
        const [newArrivalsResponse, bestSellersResponse] = await Promise.all([
          supabase
            .from('products')
            .select('*')
            .eq('is_new', true)
            .order('created_at', { ascending: false })
            .limit(4),
          supabase
            .from('products')
            .select('*')
            .eq('is_bestseller', true)
            .limit(4)
        ]);
        
        if (newArrivalsResponse.error) {
          console.error('Error fetching new arrivals:', newArrivalsResponse.error);
        } else {
          setNewArrivals(newArrivalsResponse.data || []);
        }

        if (bestSellersResponse.error) {
          console.error('Error fetching best sellers:', bestSellersResponse.error);
        } else {
          setBestSellers(bestSellersResponse.data || []);
        }
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
    <section className="py-12 bg-white relative overflow-hidden px-4">
      {/* Decorative elements */}
      <div className="absolute top-20 left-0 w-32 h-32 rounded-full bg-heartfelt-cream/20 blur-2xl -z-10"></div>
      <div className="absolute bottom-10 right-0 w-40 h-40 rounded-full bg-heartfelt-burgundy/5 blur-2xl -z-10"></div>
      
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
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
              <p className="text-lg text-muted-foreground">No {title.toLowerCase()} available at the moment</p>
              <Link to="/shop" className="inline-block mt-4">
                <Button variant="outline" className="border-heartfelt-burgundy text-heartfelt-burgundy hover:bg-heartfelt-burgundy/5">
                  Browse All Products
                </Button>
              </Link>
            </div>
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>

        <div className="mt-8 text-center">
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
      <ProductPromoBanner />
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
      
      <Suspense fallback={<div className="h-32 flex items-center justify-center"><div className="animate-spin h-6 w-6 border-4 border-heartfelt-burgundy border-t-transparent rounded-full"></div></div>}>
        <CategoryFeaturedSection />
      </Suspense>
      
      <Suspense fallback={<div className="h-32 flex items-center justify-center"><div className="animate-spin h-6 w-6 border-4 border-heartfelt-burgundy border-t-transparent rounded-full"></div></div>}>
        <Testimonials />
      </Suspense>
      
      <Suspense fallback={<div className="h-32 flex items-center justify-center"><div className="animate-spin h-6 w-6 border-4 border-heartfelt-burgundy border-t-transparent rounded-full"></div></div>}>
        <CustomOrderCta />
      </Suspense>
    </div>
  );
};

export default Index;
