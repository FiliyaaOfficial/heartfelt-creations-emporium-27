
import React from 'react';
import { Product as ProductType } from '@/types';
import ProductCard from '@/components/ProductCard';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import FilterSidebar from '@/components/shop/FilterSidebar';
import MobileFilters from '@/components/shop/MobileFilters';
import { useProductFilters } from '@/hooks/useProductFilters';

const Shop = () => {
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
    setPriceRange,
    setSortBy,
    setShowCustomizable,
    handleCategoryToggle,
    handlePriceRangeChange,
    handleClearFilters
  } = useProductFilters();

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
          
          {/* Main content area */}
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
