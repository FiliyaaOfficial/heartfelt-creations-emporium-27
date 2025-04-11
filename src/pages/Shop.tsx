
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product as ProductType } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from '@/components/ProductCard';
import { FilterX, SlidersHorizontal, TagIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [maxPrice, setMaxPrice] = useState(500);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [showCustomizable, setShowCustomizable] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Get category from URL if present
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategories([decodeURIComponent(categoryParam)]);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('name')
          .order('name');
        
        if (error) throw error;
        setCategories(data.map(cat => cat.name));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Create base query with explicit typing
        const query = supabase
          .from('products')
          .select();
        
        // Apply filters in separate steps
        // Category filter
        const withCategoryFilter = selectedCategories.length > 0 
          ? query.in('category', selectedCategories)
          : query;
        
        // Customizable filter
        const withCustomizableFilter = showCustomizable 
          ? withCategoryFilter.eq('is_customizable', true) 
          : withCategoryFilter;
        
        // Price range filter
        const withPriceFilter = withCustomizableFilter
          .gte('price', priceRange[0])
          .lte('price', priceRange[1]);
        
        // Sorting
        let finalQuery;
        if (sortBy === 'newest') {
          finalQuery = withPriceFilter.order('created_at', { ascending: false });
        } else if (sortBy === 'price-low') {
          finalQuery = withPriceFilter.order('price', { ascending: true });
        } else if (sortBy === 'price-high') {
          finalQuery = withPriceFilter.order('price', { ascending: false });
        } else {
          finalQuery = withPriceFilter;
        }
        
        // Execute query
        const { data, error } = await finalQuery;
        
        if (error) throw error;
        
        setProducts(data as ProductType[]);
        
        // Find max price for slider
        if (data.length > 0) {
          const highest = Math.max(...data.map(p => p.price));
          setMaxPrice(Math.max(highest, 500)); // Set at least 500 for range
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error loading products",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [selectedCategories, priceRange, sortBy, showCustomizable, toast]);

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
    setSelectedCategories([]);
    setPriceRange([0, maxPrice]);
    setShowCustomizable(false);
    setSortBy('newest');
    setSearchParams({});
  };

  return (
    <div className="bg-gradient-to-b from-white to-heartfelt-cream/10 min-h-screen">
      {/* Shop header */}
      <div className="relative overflow-hidden bg-heartfelt-burgundy/10">
        <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4">
            Our Collection
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto md:text-lg">
            Browse our handcrafted products made with love and care. Find the perfect item for yourself or as a gift for someone special.
          </p>
        </div>
      </div>
      
      {/* Content area with filters and products */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar - desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium text-lg">Filters</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-xs flex items-center gap-1 text-muted-foreground hover:text-black"
                >
                  <FilterX size={12} />
                  Clear all
                </Button>
              </div>
              
              <div className="space-y-4">
                {/* Price range filter */}
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <Slider
                    defaultValue={[priceRange[0], priceRange[1]]}
                    max={maxPrice}
                    step={5}
                    value={[priceRange[0], priceRange[1]]}
                    onValueChange={handlePriceRangeChange}
                    className="mb-4"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
                
                {/* Customizable filter */}
                <div className="border-b pb-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={showCustomizable} 
                      onChange={() => setShowCustomizable(!showCustomizable)}
                      className="rounded border-gray-300 text-heartfelt-burgundy focus:ring-heartfelt-burgundy"
                    />
                    <span className="flex items-center">
                      <TagIcon size={14} className="mr-1 text-heartfelt-burgundy" />
                      Customizable
                    </span>
                  </label>
                </div>
                
                {/* Categories filter */}
                <div>
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {categories.map((category) => (
                      <label 
                        key={category} 
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input 
                          type="checkbox" 
                          checked={selectedCategories.includes(category)} 
                          onChange={() => handleCategoryToggle(category)}
                          className="rounded border-gray-300 text-heartfelt-burgundy focus:ring-heartfelt-burgundy"
                        />
                        <span>{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="flex-1">
            {/* Mobile filters */}
            <div className="lg:hidden mb-4">
              <div className="flex items-center justify-between gap-2 mb-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <SlidersHorizontal size={16} />
                      Filters
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64">
                    <DropdownMenuLabel>Filters</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="px-2 py-2">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="price">
                          <AccordionTrigger>Price Range</AccordionTrigger>
                          <AccordionContent>
                            <Slider
                              defaultValue={[priceRange[0], priceRange[1]]}
                              max={maxPrice}
                              step={5}
                              value={[priceRange[0], priceRange[1]]}
                              onValueChange={handlePriceRangeChange}
                              className="mb-4"
                            />
                            <div className="flex items-center justify-between text-sm">
                              <span>${priceRange[0]}</span>
                              <span>${priceRange[1]}</span>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="customizable">
                          <AccordionTrigger>Product Type</AccordionTrigger>
                          <AccordionContent>
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={showCustomizable} 
                                onChange={() => setShowCustomizable(!showCustomizable)}
                                className="rounded border-gray-300 text-heartfelt-burgundy focus:ring-heartfelt-burgundy"
                              />
                              <span className="flex items-center">
                                <TagIcon size={14} className="mr-1 text-heartfelt-burgundy" />
                                Customizable
                              </span>
                            </label>
                          </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="categories">
                          <AccordionTrigger>Categories</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {categories.map((category) => (
                                <label 
                                  key={category} 
                                  className="flex items-center space-x-2 cursor-pointer"
                                >
                                  <input 
                                    type="checkbox" 
                                    checked={selectedCategories.includes(category)} 
                                    onChange={() => handleCategoryToggle(category)}
                                    className="rounded border-gray-300 text-heartfelt-burgundy focus:ring-heartfelt-burgundy"
                                  />
                                  <span>{category}</span>
                                </label>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="justify-center cursor-pointer"
                      onClick={handleClearFilters}
                    >
                      <FilterX size={14} className="mr-1" />
                      Clear all filters
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Sort: {sortBy === 'newest' ? 'Newest' : 
                             sortBy === 'price-low' ? 'Price: Low to High' : 
                             'Price: High to Low'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuItem 
                        onClick={() => setSortBy('newest')}
                        className={sortBy === 'newest' ? 'bg-accent' : ''}
                      >
                        Newest
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setSortBy('price-low')}
                        className={sortBy === 'price-low' ? 'bg-accent' : ''}
                      >
                        Price: Low to High
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setSortBy('price-high')}
                        className={sortBy === 'price-high' ? 'bg-accent' : ''}
                      >
                        Price: High to Low
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Active filters display */}
              {(selectedCategories.length > 0 || showCustomizable || priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedCategories.map(cat => (
                    <div 
                      key={cat}
                      className="bg-gray-100 px-2 py-1 rounded-full text-xs flex items-center"
                    >
                      {cat}
                      <button 
                        className="ml-1 text-gray-600 hover:text-gray-900"
                        onClick={() => handleCategoryToggle(cat)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  
                  {showCustomizable && (
                    <div className="bg-gray-100 px-2 py-1 rounded-full text-xs flex items-center">
                      <TagIcon size={10} className="mr-1" /> Customizable
                      <button 
                        className="ml-1 text-gray-600 hover:text-gray-900"
                        onClick={() => setShowCustomizable(false)}
                      >
                        &times;
                      </button>
                    </div>
                  )}
                  
                  {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                    <div className="bg-gray-100 px-2 py-1 rounded-full text-xs flex items-center">
                      ${priceRange[0]} - ${priceRange[1]}
                      <button 
                        className="ml-1 text-gray-600 hover:text-gray-900"
                        onClick={() => setPriceRange([0, maxPrice])}
                      >
                        &times;
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Desktop sort options */}
            <div className="hidden lg:flex justify-between mb-6">
              <h2 className="text-xl font-medium">All Products</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      {sortBy === 'newest' ? 'Newest' : 
                       sortBy === 'price-low' ? 'Price: Low to High' : 
                       'Price: High to Low'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuGroup>
                      <DropdownMenuItem 
                        onClick={() => setSortBy('newest')}
                        className={sortBy === 'newest' ? 'bg-accent' : ''}
                      >
                        Newest
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setSortBy('price-low')}
                        className={sortBy === 'price-low' ? 'bg-accent' : ''}
                      >
                        Price: Low to High
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setSortBy('price-high')}
                        className={sortBy === 'price-high' ? 'bg-accent' : ''}
                      >
                        Price: High to Low
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Products grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-heartfelt-burgundy mr-2" />
                <span className="ml-2 text-lg text-muted-foreground">Loading products...</span>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                  Try adjusting your filters to find what you're looking for.
                </p>
                <Button onClick={handleClearFilters} className="bg-heartfelt-burgundy hover:bg-heartfelt-dark">
                  Clear all filters
                </Button>
              </div>
            ) : (
              <>
                <p className="text-muted-foreground mb-6 hidden lg:block">Showing {products.length} products</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {products.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={{
                        ...product,
                        badges: product.is_customizable ? ['customizable'] : undefined
                      }} 
                    />
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

export default Shop;
