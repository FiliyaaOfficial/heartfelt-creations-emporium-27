
import React from 'react';
import { FilterX, TagIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from "@/components/ui/slider";

interface FilterSidebarProps {
  categories: string[];
  selectedCategories: string[];
  handleCategoryToggle: (category: string) => void;
  priceRange: [number, number];
  maxPrice: number;
  handlePriceRangeChange: (value: number[]) => void;
  showCustomizable: boolean;
  setShowCustomizable: React.Dispatch<React.SetStateAction<boolean>>;
  handleClearFilters: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  selectedCategories,
  handleCategoryToggle,
  priceRange,
  maxPrice,
  handlePriceRangeChange,
  showCustomizable,
  setShowCustomizable,
  handleClearFilters
}) => {
  return (
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
  );
};

export default FilterSidebar;
