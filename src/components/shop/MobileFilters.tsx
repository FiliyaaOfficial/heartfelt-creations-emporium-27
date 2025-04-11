
import React from 'react';
import { FilterX, SlidersHorizontal, TagIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

interface MobileFiltersProps {
  categories: string[];
  selectedCategories: string[];
  handleCategoryToggle: (category: string) => void;
  priceRange: [number, number];
  maxPrice: number;
  setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  showCustomizable: boolean;
  setShowCustomizable: React.Dispatch<React.SetStateAction<boolean>>;
  handleClearFilters: () => void;
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
}

const MobileFilters: React.FC<MobileFiltersProps> = ({
  categories,
  selectedCategories,
  handleCategoryToggle,
  priceRange,
  maxPrice,
  setPriceRange,
  showCustomizable,
  setShowCustomizable,
  handleClearFilters,
  sortBy,
  setSortBy
}) => {
  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  return (
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
  );
};

export default MobileFilters;
