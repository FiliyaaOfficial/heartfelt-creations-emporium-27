
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from '@/components/ProductCard';
import { TrendingUp, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  compare_at_price?: number;
  image_url?: string;
  category: string;
  is_featured?: boolean;
  is_new?: boolean;
  is_bestseller?: boolean;
  is_customizable?: boolean;
  stock_quantity: number;
  inventory_count?: number;
  created_at?: string;
  updated_at?: string;
  badges?: string[];
  rating?: number;
  review_count?: number;
}

const BestSellers = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        console.log('Fetching best sellers...');
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_bestseller', true)
          .order('created_at', { ascending: false });
          
        console.log('Best sellers query result:', { data, error });
        
        if (error) {
          console.error('Error fetching best sellers:', error);
          toast({
            title: "Error loading products",
            description: "Please try again later",
            variant: "destructive",
          });
        } else {
          setProducts(data || []);
        }
      } catch (error) {
        console.error('Error fetching best sellers:', error);
        toast({
          title: "Error loading products",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBestSellers();
  }, [toast]);

  return (
    <>
      <Helmet>
        <title>Best Sellers | Heartfelt Creations Emporium</title>
        <meta name="description" content="Discover our most popular handcrafted products loved by customers worldwide." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-white to-heartfelt-cream/10">
        {/* Hero Banner */}
        <div className="bg-heartfelt-cream/20 py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-heartfelt-burgundy/10 rounded-full mb-4">
              <TrendingUp size={32} className="text-heartfelt-burgundy" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4">
              Best Sellers
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto md:text-lg">
              Discover our most popular handcrafted products that customers love. 
              These items have been carefully selected based on customer reviews and sales.
            </p>
          </div>
        </div>
        
        {/* Products Section */}
        <div className="container mx-auto px-4 py-12">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div key={item} className="h-[300px] animate-pulse bg-heartfelt-cream/20 rounded-xl"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center">
              <div className="inline-flex p-4 rounded-full bg-heartfelt-cream/30 mb-4">
                <Sparkles className="h-6 w-6 text-heartfelt-burgundy" />
              </div>
              <h3 className="text-xl font-medium mb-2">No best sellers yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're currently updating our best sellers collection. Check back soon!
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-serif text-2xl mb-2">Our Most Popular Items</h2>
                  <p className="text-muted-foreground">Showing {products.length} product{products.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BestSellers;
