
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
    <section className="py-16 bg-white relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-heartfelt-cream rounded-br-full opacity-60"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-heartfelt-pink/10 rounded-tl-full"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="section-title text-center">Shop by Category</h2>
        <p className="section-subtitle text-center">
          Explore our handcrafted collections, each made with love and attention to detail.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-12">
          {categories.map((category) => (
            <Link 
              key={category.id}
              to={`/categories/${encodeURIComponent(category.name)}`}
              className="flex flex-col items-center group"
            >
              <div className="w-24 h-24 rounded-full bg-heartfelt-cream flex items-center justify-center mb-4 group-hover:bg-heartfelt-burgundy transition-colors duration-300">
                <div className="text-heartfelt-burgundy group-hover:text-white transition-colors duration-300">
                  {iconMap[category.icon]}
                </div>
              </div>
              <h3 className="text-xl font-serif font-medium mb-2 group-hover:text-heartfelt-burgundy transition-colors">{category.name}</h3>
              <p className="text-gray-700 text-sm text-center">{category.description}</p>
            </Link>
          ))}
        </div>
        
        <div className="mt-12 text-center">
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
