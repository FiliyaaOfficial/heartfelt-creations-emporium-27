
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Category as CategoryType, Product as ProductType } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from '@/components/ProductCard';
import { Coffee, Flower, Heart, Book, Gift, Camera, ArrowRight, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const categoryIcons: { [key: string]: React.ReactNode } = {
  'Artisan Chocolates': <Coffee size={24} />,
  'Flower Bouquets': <Flower size={24} />,
  'Embroidery Art': <Heart size={24} />,
  'Memory Books': <Book size={24} />,
  'Gift Hampers': <Gift size={24} />,
  'Custom Orders': <Camera size={24} />,
};

const Categories = () => {
  const { categoryName } = useParams<{ categoryName?: string }>();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // If categoryName is provided, redirect to the new CategoryPage
    if (categoryName) {
      navigate(`/category/${categoryName}`, { replace: true });
    }
  }, [categoryName, navigate]);

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      setIsLoading(true);
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select()
          .order('name');

        if (categoriesError) throw categoriesError;
        
        setCategories(categoriesData as CategoryType[]);
        
        // Fetch featured products - one from each category
        const promises = categoriesData.map(async (category) => {
          const { data } = await supabase
            .from('products')
            .select()
            .eq('category', category.name)
            .eq('is_featured', true)
            .limit(1);
            
          return data?.[0] as ProductType | undefined;
        });
        
        const results = await Promise.all(promises);
        setFeaturedProducts(results.filter(Boolean) as ProductType[]);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error fetching categories",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoriesAndProducts();
  }, [toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-heartfelt-cream/10">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-heartfelt-cream/40 to-heartfelt-burgundy/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?q=80&w=1920')] bg-cover bg-center opacity-5"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4 text-center">
            Our Collections
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-center md:text-lg">
            Explore our handcrafted categories, each made with love and attention to detail.
            Find the perfect gift for your loved ones or treat yourself to something special.
          </p>
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <Card key={i} className="h-64 animate-pulse bg-heartfelt-cream/20 border-none"></Card>
            ))
          ) : (
            categories.map((category) => (
              <Link 
                key={category.id} 
                to={`/category/${encodeURIComponent(category.name)}`}
                className="group"
              >
                <Card className="h-full overflow-hidden border-heartfelt-cream/30 hover:border-heartfelt-burgundy/30 transition-all duration-300 hover:shadow-md">
                  <CardContent className="p-0">
                    <div className="relative h-40 bg-gradient-to-r from-heartfelt-cream/40 to-white overflow-hidden">
                      <div className="absolute bottom-0 right-0 w-32 h-32 opacity-20 transform translate-x-8 translate-y-8">
                        {categoryIcons[category.name]}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-start p-6">
                        <div>
                          <div className="flex items-center mb-2">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-4 shadow-sm">
                              <span className="text-heartfelt-burgundy">{categoryIcons[category.name]}</span>
                            </div>
                            <h3 className="text-2xl font-serif font-semibold">{category.name}</h3>
                          </div>
                          <p className="text-muted-foreground line-clamp-2">{category.description}</p>
                          <span className="mt-3 inline-flex items-center text-sm font-medium text-heartfelt-burgundy group-hover:text-heartfelt-dark transition-colors">
                            Browse Collection <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Featured product from this category */}
                    {featuredProducts.find(p => p.category === category.name) && (
                      <div className="p-4 border-t border-heartfelt-cream/30">
                        <div className="flex items-center">
                          <div className="w-16 h-16 rounded-md overflow-hidden mr-3 bg-gray-100">
                            <img 
                              src={featuredProducts.find(p => p.category === category.name)?.image_url || '/placeholder.svg'} 
                              alt="Featured product"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="text-xs flex items-center font-medium text-heartfelt-burgundy mb-1">
                              <Sparkles size={12} className="mr-1" /> Featured
                            </span>
                            <p className="font-medium line-clamp-1">
                              {featuredProducts.find(p => p.category === category.name)?.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
