
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product as ProductType, Category as CategoryType } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from '@/components/ProductCard';
import { ArrowLeft, SlidersHorizontal, ChevronDown, Filter, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';

const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      setIsLoading(true);
      try {
        // Fetch category details
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select()
          .eq('name', categoryName)
          .single();
        
        if (categoryError) throw categoryError;
        setCategory(categoryData as CategoryType);
        
        // Fetch products for this category
        let query = supabase
          .from('products')
          .select()
          .eq('category', categoryName);
          
        // Apply sorting
        if (sortBy === 'newest') {
          query = query.order('created_at', { ascending: false });
        } else if (sortBy === 'price-low') {
          query = query.order('price', { ascending: true });
        } else if (sortBy === 'price-high') {
          query = query.order('price', { ascending: false });
        }
        
        const { data: productsData, error: productsError } = await query;
        
        if (productsError) throw productsError;
        setProducts(productsData as ProductType[]);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error loading category",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (categoryName) {
      fetchCategoryAndProducts();
    }
  }, [categoryName, sortBy, toast]);

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-heartfelt-cream/10">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-heartfelt-cream/30">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549488497-94b52bddac5d?q=80&w=1920')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="flex items-center mb-4">
            <Button variant="ghost" size="sm" asChild className="text-heartfelt-burgundy hover:text-heartfelt-dark">
              <Link to="/categories">
                <ArrowLeft size={18} className="mr-2" />
                Back to Categories
              </Link>
            </Button>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-3">
            {isLoading ? "Loading..." : categoryName}
          </h1>
          
          <p className="text-muted-foreground max-w-xl md:text-lg">
            {isLoading ? "Loading category description..." : category?.description || `Explore our handcrafted ${categoryName} collection, each made with love and attention to detail.`}
          </p>
        </div>
      </div>
      
      {/* Filters Bar */}
      <div className="sticky top-0 z-20 bg-white shadow-sm border-b border-heartfelt-cream">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-heartfelt-burgundy" />
              <span className="text-sm font-medium">Filters</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                <Button 
                  variant={sortBy === 'newest' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleSortChange('newest')}
                  className={sortBy === 'newest' ? 'bg-heartfelt-burgundy' : ''}
                >
                  Newest
                </Button>
                <Button 
                  variant={sortBy === 'price-low' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleSortChange('price-low')}
                  className={sortBy === 'price-low' ? 'bg-heartfelt-burgundy' : ''}
                >
                  Price: Low to High
                </Button>
                <Button 
                  variant={sortBy === 'price-high' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleSortChange('price-high')}
                  className={sortBy === 'price-high' ? 'bg-heartfelt-burgundy' : ''}
                >
                  Price: High to Low
                </Button>
              </div>
              
              <div className="md:hidden">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <span>Sort</span>
                  <ChevronDown size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <Card key={item} className="h-[300px] animate-pulse bg-heartfelt-cream/20 border-none"></Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center">
            <div className="inline-flex p-4 rounded-full bg-heartfelt-cream/30 mb-4">
              <Sparkles className="h-6 w-6 text-heartfelt-burgundy" />
            </div>
            <h3 className="text-xl font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              We're currently crafting new {categoryName} items. Check back soon for our latest creations.
            </p>
            <Button asChild className="bg-heartfelt-burgundy hover:bg-heartfelt-dark">
              <Link to="/categories">Browse Other Categories</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl">All Products</h2>
              <p className="text-muted-foreground text-sm">Showing {products.length} product{products.length !== 1 ? 's' : ''}</p>
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
  );
};

export default CategoryPage;
