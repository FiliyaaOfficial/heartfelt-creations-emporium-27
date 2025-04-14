
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product } from '@/types';
import { Sparkles, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/shop/FilterSidebar';
import MobileFilters from '@/components/shop/MobileFilters';
import { useToast } from '@/components/ui/use-toast';
import { useProductFilters } from '@/hooks/useProductFilters';
import CategoryCircles from '@/components/CategoryCircles';

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
    handleCategoryToggle,
    handlePriceRangeChange,
    handleClearFilters
  } = useProductFilters();

  return (
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
            setShowCustomizable={filters => filters.setShowCustomizable}
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
              setPriceRange={filters => filters.setPriceRange}
              showCustomizable={showCustomizable}
              setShowCustomizable={filters => filters.setShowCustomizable}
              handleClearFilters={handleClearFilters}
              sortBy={sortBy}
              setSortBy={filters => filters.setSortBy}
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
  );
};

export default Shop;
