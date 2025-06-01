
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Flame, Sparkles } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  icon?: string;
}

const CategoryCircles = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories...');
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');
          
        console.log('Categories query result:', { data, error });
        
        if (error) {
          console.error('Error fetching categories:', error);
          throw error;
        }
        
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-heartfelt-burgundy"></div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto py-2 bg-white border-b border-heartfelt-cream/40">
      <div className="container mx-auto px-2 md:px-4">
        <div className="flex gap-4 md:gap-8 min-w-max py-2">
          <Link 
            to="/best-sellers" 
            className="flex flex-col items-center group"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-heartfelt-burgundy/20 overflow-hidden group-hover:border-heartfelt-burgundy transition-colors duration-300 flex items-center justify-center bg-heartfelt-cream/20">
              <Flame size={24} className="text-heartfelt-burgundy" />
            </div>
            <span className="text-xs md:text-sm mt-1 font-medium flex items-center">
              Best Sellers <Flame size={14} className="ml-1 text-orange-500" />
            </span>
          </Link>

          <Link 
            to="/new-arrivals" 
            className="flex flex-col items-center group"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-heartfelt-burgundy/20 overflow-hidden group-hover:border-heartfelt-burgundy transition-colors duration-300 flex items-center justify-center bg-heartfelt-cream/20">
              <Sparkles size={24} className="text-heartfelt-burgundy" />
            </div>
            <span className="text-xs md:text-sm mt-1 font-medium flex items-center">
              New Arrivals <span className="text-xs font-semibold bg-heartfelt-cream px-2 py-1 rounded-full text-heartfelt-burgundy ml-1">NEW</span>
            </span>
          </Link>
          
          {categories.map((category) => (
            <Link 
              key={category.id}
              to={`/category/${encodeURIComponent(category.name)}`}
              className="flex flex-col items-center group"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-heartfelt-cream overflow-hidden group-hover:border-heartfelt-burgundy transition-colors duration-300">
                {category.image_url ? (
                  <img 
                    src={category.image_url} 
                    alt={category.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-heartfelt-cream/20 flex items-center justify-center">
                    <Sparkles size={24} className="text-heartfelt-burgundy/50" />
                  </div>
                )}
              </div>
              <span className="text-xs md:text-sm mt-1 font-medium">{category.name}</span>
            </Link>
          ))}
          
          <Link 
            to="/custom" 
            className="flex flex-col items-center group"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-heartfelt-cream overflow-hidden group-hover:border-heartfelt-burgundy transition-colors duration-300 bg-gradient-to-r from-heartfelt-pink/20 to-heartfelt-burgundy/10 flex items-center justify-center">
              <Sparkles size={24} className="text-heartfelt-burgundy" />
            </div>
            <span className="text-xs md:text-sm mt-1 font-medium">Custom</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryCircles;
