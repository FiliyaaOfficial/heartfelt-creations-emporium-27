
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gift, Coffee, Heart, Book, Camera, Flower } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Category as CategoryType } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { Button } from './ui/button';

const CategorySection = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Icon mapping
  const iconMap: Record<string, React.ReactNode> = {
    'Coffee': <Coffee size={36} />,
    'Flower': <Flower size={36} />,
    'Heart': <Heart size={36} />,
    'Book': <Book size={36} />,
    'Gift': <Gift size={36} />,
    'Camera': <Camera size={36} />,
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select();
          
        if (error) throw error;
        setCategories(data as CategoryType[]);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: "Error fetching categories",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, [toast]);

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center">Shop by Category</h2>
          <p className="section-subtitle text-center">
            Explore our handcrafted collections, each made with love and attention to detail.
          </p>
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heartfelt-burgundy"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-heartfelt-cream rounded-br-full opacity-60 transform -translate-x-8"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-heartfelt-pink/10 rounded-tl-full transform translate-x-12"></div>
      <div className="absolute top-1/4 right-1/4 w-16 h-16 rounded-full bg-heartfelt-burgundy/5"></div>
      <div className="absolute bottom-1/3 left-1/4 w-24 h-24 rounded-full bg-heartfelt-cream/30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="section-title">Explore our Collections</h2>
          <p className="section-subtitle max-w-2xl mx-auto px-2">
            Each category features unique handcrafted items, made with attention to detail and filled with love.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 mt-8 md:mt-12">
          {categories.map((category) => (
            <Link 
              key={category.id}
              to={`/category/${encodeURIComponent(category.name)}`}
              className="flex flex-col items-center group hover-card"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-heartfelt-cream shadow-sm flex items-center justify-center mb-3 md:mb-4 group-hover:bg-heartfelt-burgundy transition-colors duration-300 shine-effect">
                <div className="text-heartfelt-burgundy group-hover:text-white transition-colors duration-300">
                  {iconMap[category.icon] || <Gift size={36} />}
                </div>
              </div>
              <h3 className="text-base md:text-xl font-serif font-medium mb-1 md:mb-2 group-hover:text-heartfelt-burgundy transition-colors text-center">
                {category.name}
              </h3>
              <p className="text-gray-700 text-xs md:text-sm text-center line-clamp-2 px-1">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
        
        <div className="mt-10 md:mt-12 text-center">
          <Link to="/categories">
            <Button className="bg-heartfelt-burgundy hover:bg-heartfelt-dark">
              Browse All Categories
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
