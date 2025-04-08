
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gift, Coffee, Heart, Book, Camera, Flower } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Category as CategoryType } from '@/types';
import { useToast } from '@/components/ui/use-toast';

const CategorySection = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Icon mapping
  const iconMap: Record<string, React.ReactNode> = {
    'Coffee': <Coffee size={32} />,
    'Flower': <Flower size={32} />,
    'Heart': <Heart size={32} />,
    'Book': <Book size={32} />,
    'Gift': <Gift size={32} />,
    'Camera': <Camera size={32} />,
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
      <section className="container-custom">
        <h2 className="section-title text-center">Shop by Category</h2>
        <p className="section-subtitle text-center">
          Explore our handcrafted collections, each made with love and attention to detail.
        </p>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-filiyaa-peach-600"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="container-custom">
      <h2 className="section-title text-center">Shop by Category</h2>
      <p className="section-subtitle text-center">
        Explore our handcrafted collections, each made with love and attention to detail.
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        {categories.map((category) => (
          <Link 
            key={category.id}
            to={`/categories/${encodeURIComponent(category.name)}`}
            className={`${category.background_color} rounded-2xl p-6 text-center transition-transform hover:-translate-y-1 hover:shadow-lg flex flex-col items-center`}
          >
            <div className="mb-4 text-filiyaa-peach-700">
              {iconMap[category.icon]}
            </div>
            <h3 className="text-xl font-serif font-medium mb-2">{category.name}</h3>
            <p className="text-gray-700 text-sm">{category.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
