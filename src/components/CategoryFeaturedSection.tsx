
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import CategoryFeaturedCarousel from './CategoryFeaturedCarousel';
import { Category } from '@/types';

const CategoryFeaturedSection = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select()
          .order('name');
          
        if (error) throw error;
        setCategories(data as Category[]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-heartfelt-burgundy"></div>
      </div>
    );
  }

  return (
    <div className="bg-heartfelt-cream/10">
      {/* Special sections first */}
      <CategoryFeaturedCarousel categoryName="New Arrivals" limit={8} />
      <CategoryFeaturedCarousel categoryName="Best Sellers" limit={8} />
      
      {/* Then all other categories */}
      {categories.map((category) => (
        <CategoryFeaturedCarousel 
          key={category.id} 
          categoryName={category.name} 
          limit={8}
        />
      ))}
    </div>
  );
};

export default CategoryFeaturedSection;
