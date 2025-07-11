
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Product } from '@/types';
import { Sparkles, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/shop/FilterSidebar';
import MobileFilters from '@/components/shop/MobileFilters';
import { useToast } from '@/components/ui/use-toast';
import { useProductFilters } from '@/hooks/useProductFilters';
import CategoryCircles from '@/components/CategoryCircles';
import { supabase } from '@/integrations/supabase/client';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const {
    products,
    categories,
    isLoading,
    priceRange,
    maxPrice,
    selectedCategories,
    sortBy,
    showCustomizable,
    setShowCustomizable,
    setPriceRange,
    setSortBy,
    handleCategoryToggle,
    handlePriceRangeChange,
    handleClearFilters
  } = useProductFilters();

  useEffect(() => {
    // Log to verify products are loading
    console.log("Products in Shop page:", products);
    
    // If no products are loaded after filters are applied
    if (!isLoading && products.length === 0) {
      const checkProducts = async () => {
        try {
          const { data, error, count } = await supabase
            .from('products')
            .select('*', { count: 'exact' })
            .limit(1);
            
          if (error) {
            console.error("Error checking products:", error);
            toast({
              title: "Error checking products",
              description: error.message,
              variant: "destructive"
            });
            throw error;
          }
          
          if (!data || data.length === 0) {
            console.log("No products found in database");
            toast({
              title: "No products found",
              description: "There are no products in the database. Please add some products.",
              variant: "destructive"
            });
          } else {
            console.log(`Found ${count} products in database`);
            toast({
              title: "Products found",
              description: `Found ${count} products in database, but none match your current filters.`,
              variant: "default"
            });
          }
        } catch (error) {
          console.error("Error checking products:", error);
        }
      };
      
      checkProducts();
    }
  }, [products, isLoading, toast]);

  return (
    <>
      <Helmet>
        <title>Shop Handcrafted Products | Heartfelt Creations Emporium</title>
        <meta name="description" content="Browse our collection of handcrafted products made with love. Find unique gifts, home decor, and personalized items that will warm your heart." />
        <meta name="keywords" content="handcrafted gifts, handmade products, custom gifts, personalized items, heartfelt creations" />
        <link rel="canonical" href="https://heartfelt-creations-emporium.com/shop" />
        <meta property="og:title" content="Shop Handcrafted Products | Heartfelt Creations Emporium" />
        <meta property="og:description" content="Browse our collection of handcrafted products made with love and attention to detail." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://heartfelt-creations-emporium.com/shop" />
        <meta property="og:image" content="https://heartfelt-creations-emporium.com/images/shop-banner.jpg" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-white to-heartfelt-cream/10">
        <CategoryCircles />
        
        {/* Shop Header */}
        <div className="bg-heartfelt-cream/20 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-2">Shop All Products</h1>
            <p className="text-muted-foreground max-w-xl">
              Browse our collection of handcrafted products made with love and attention to detail.
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
                    <div key={item} className="h-[300px] animate-pulse bg-heartfelt-cream/20 rounded-xl"></div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="inline-flex p-4 rounded-full bg-heartfelt-cream/30 mb-4">
                    <Sparkles className="h-6 w-6 text-heartfelt-burgundy" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No products found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-8">
                    We couldn't find any products matching your current filters. Try adjusting your selection.
                  </p>
                  <Button onClick={handleClearFilters} className="bg-heartfelt-burgundy hover:bg-heartfelt-dark">
                    Clear All Filters
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
    </>
  );
};

export default Shop;
