
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';

export const useProductFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [maxPrice, setMaxPrice] = useState(500);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [showCustomizable, setShowCustomizable] = useState(false);
  
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
        // Build query in stages to avoid deep type instantiation
        let query = supabase.from('products').select('*');
        
        // Apply category filter
        if (selectedCategories.length > 0) {
          query = query.in('category', selectedCategories);
        }
        
        // Apply customizable filter
        if (showCustomizable) {
          query = query.eq('is_customizable', true);
        }
        
        // Apply price filters
        query = query.gte('price', priceRange[0]).lte('price', priceRange[1]);
        
        // Apply sorting
        if (sortBy === 'newest') {
          query = query.order('created_at', { ascending: false });
        } else if (sortBy === 'price-low') {
          query = query.order('price', { ascending: true });
        } else if (sortBy === 'price-high') {
          query = query.order('price', { ascending: false });
        }
        
        // Execute the query
        const { data, error } = await query;
        
        if (error) throw error;
        setProducts(data as Product[]);
        
        // Find max price for slider
        if (data.length > 0) {
          const highest = Math.max(...data.map((p: any) => p.price));
          setMaxPrice(Math.max(highest, 500)); // Set at least 500 for range
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [selectedCategories, priceRange, sortBy, showCustomizable]);

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
  
  return {
    products,
    categories,
    isLoading,
    priceRange,
    maxPrice,
    selectedCategories,
    sortBy,
    showCustomizable,
    setSelectedCategories,
    setPriceRange,
    setSortBy,
    setShowCustomizable,
    handleCategoryToggle,
    handlePriceRangeChange,
    handleClearFilters
  };
};
