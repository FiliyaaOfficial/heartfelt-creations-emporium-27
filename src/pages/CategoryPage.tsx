
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product as ProductType, Category as CategoryType } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from '@/components/ProductCard';
import { ArrowLeft, SlidersHorizontal, ChevronDown, Filter, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import FilterSidebar from '@/components/shop/FilterSidebar';
import MobileFilters from '@/components/shop/MobileFilters';

const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [maxPrice, setMaxPrice] = useState(500);
  const [showCustomizable, setShowCustomizable] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Set the current category as selected
    if (categoryName) {
      setSelectedCategories([categoryName]);
    }
  }, [categoryName]);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      setIsLoading(true);
      try {
        // Fetch category details
        if (categoryName) {
          const { data: categoryData, error: categoryError } = await supabase
            .from('categories')
            .select()
            .eq('name', categoryName)
            .single();
          
          if (categoryError) throw categoryError;
          setCategory(categoryData as CategoryType);
        }
        
        // Fetch products with filters
        let query = supabase.from('products');
        
        // Apply category filter
        if (selectedCategories.length > 0) {
          query = query.in('category', selectedCategories);
        } else if (categoryName) {
          // If no categories are explicitly selected, use the URL parameter
          query = query.eq('category', categoryName);
        }
        
        // Apply customizable filter
        if (showCustomizable) {
          query = query.eq('is_customizable', true);
        }
        
        // Apply price filter
        query = query.gte('price', priceRange[0]);
        query = query.lte('price', priceRange[1]);
        
        // Apply sorting
        if (sortBy === 'newest') {
          query = query.order('created_at', { ascending: false });
        } else if (sortBy === 'price-low') {
          query = query.order('price', { ascending: true });
        } else if (sortBy === 'price-high') {
          query = query.order('price', { ascending: false });
        }
        
        // Execute the query
        const { data: productsData, error: productsError } = await query.select();
        
        if (productsError) throw productsError;
        setProducts(productsData as ProductType[]);
        
        // Set max price for slider
        if (productsData.length > 0) {
          const highest = Math.max(...productsData.map((p: any) => p.price));
          setMaxPrice(Math.max(highest, 500)); // Set at least 500 for range
        }
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
    
    fetchCategoryAndProducts();
  }, [categoryName, selectedCategories, sortBy, priceRange, showCustomizable, toast]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const handleClearFilters = () => {
    if (categoryName) {
      setSelectedCategories([categoryName]);
    } else {
      setSelectedCategories([]);
    }
    setPriceRange([0, maxPrice]);
    setShowCustomizable(false);
    setSortBy('newest');
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
      
      {/* Main content area with filters and products */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop filters */}
          <FilterSidebar 
            categories={categories}
            selectedCategories={selectedCategories}
            handleCategoryToggle={handleCategoryToggle}
            priceRange={priceRange}
            maxPrice={maxPrice}
            handlePriceRangeChange={handlePriceRangeChange}
            showCustomizable={showCustomizable}
            setShowCustomizable={setShowCustomizable}
            handleClearFilters={handleClearFilters}
          />
          
          {/* Main content */}
          <div className="flex-1">
            {/* Mobile filters */}
            <MobileFilters 
              categories={categories}
              selectedCategories={selectedCategories}
              handleCategoryToggle={handleCategoryToggle}
              priceRange={priceRange}
              maxPrice={maxPrice}
              setPriceRange={setPriceRange}
              showCustomizable={showCustomizable}
              setShowCustomizable={setShowCustomizable}
              handleClearFilters={handleClearFilters}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
            
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
                    <ProductCard key={product.id} product={{
                      ...product,
                      badges: product.is_customizable ? ['customizable', ...(product.badges || [])] : product.badges
                    }} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
