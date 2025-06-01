
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from '@/components/ProductCard';
import { Clock, Sparkles } from 'lucide-react';
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

const NewArrivals = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        console.log('Fetching new arrivals...');
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_new', true)
          .order('created_at', { ascending: false });
          
        console.log('New arrivals query result:', { data, error });
        
        if (error) {
          console.error('Error fetching new arrivals:', error);
          toast({
            title: "Error loading products",
            description: "Please try again later",
            variant: "destructive",
          });
        } else {
          setProducts(data || []);
        }
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
        toast({
          title: "Error loading products",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNewArrivals();
  }, [toast]);

  return (
    <>
      <Helmet>
        <title>New Arrivals | Heartfelt Creations Emporium</title>
        <meta name="description" content="Check out our latest handcrafted products and newest additions to our collection." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-white to-heartfelt-cream/10">
        {/* Hero Banner */}
        <div className="bg-heartfelt-cream/20 py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-heartfelt-burgundy/10 rounded-full mb-4">
              <Clock size={32} className="text-heartfelt-burgundy" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4">
              New Arrivals
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto md:text-lg">
              Discover our latest handcrafted creations. Fresh designs and new products 
              added regularly to bring you the best in artisanal craftsmanship.
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
              <h3 className="text-xl font-medium mb-2">No new arrivals yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're working on new products. Check back soon for our latest creations!
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-serif text-2xl mb-2">Latest Creations</h2>
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

export default NewArrivals;
