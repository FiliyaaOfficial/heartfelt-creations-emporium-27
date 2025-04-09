
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Category as CategoryType, Product as ProductType } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from '@/components/ProductCard';
import { Coffee, Flower, Heart, Book, Gift, Camera } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const categoryIcons: { [key: string]: React.ReactNode } = {
  'Artisan Chocolates': <Coffee size={24} />,
  'Flower Bouquets': <Flower size={24} />,
  'Embroidery Art': <Heart size={24} />,
  'Memory Books': <Book size={24} />,
  'Gift Hampers': <Gift size={24} />,
  'Custom Orders': <Camera size={24} />,
};

const Categories = () => {
  const { categoryName } = useParams<{ categoryName?: string }>();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(categoryName || null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select()
          .order('name');

        if (error) throw error;
        setCategories(data as CategoryType[]);

        // If categoryName is provided in URL but not in state, update state
        if (categoryName && !activeCategory) {
          setActiveCategory(categoryName);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: "Error fetching categories",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    };

    fetchCategories();
  }, [categoryName, activeCategory, toast]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let query = supabase.from('products').select();
        
        if (activeCategory) {
          query = query.eq('category', activeCategory);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        setProducts(data as ProductType[]);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error fetching products",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, toast]);

  return (
    <div className="container mx-auto px-4 py-10 md:py-16">
      <div className="relative mb-16">
        <div className="absolute inset-0 bg-heartfelt-cream/30 rounded-2xl -z-10"></div>
        <div className="py-12 px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-serif font-semibold text-center mb-3">
            {activeCategory || "All Categories"}
          </h1>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            Explore our handcrafted collections, each made with love and attention to detail.
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        <button
          className={`rounded-full px-5 py-2.5 font-medium text-sm transition-colors flex items-center gap-2
            ${!activeCategory ? 'bg-heartfelt-burgundy text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
          onClick={() => setActiveCategory(null)}
        >
          All
        </button>
        
        {categories.map((category) => (
          <button
            key={category.id}
            className={`rounded-full px-5 py-2.5 font-medium text-sm transition-colors flex items-center gap-2
              ${activeCategory === category.name 
                ? 'bg-heartfelt-burgundy text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
            onClick={() => setActiveCategory(category.name)}
          >
            {categoryIcons[category.name]}
            {category.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="h-[300px] bg-heartfelt-cream/20 animate-pulse rounded-xl"></div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-heartfelt-cream/10 rounded-xl">
          <h3 className="text-xl font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground">
            {activeCategory 
              ? `There are currently no products in the ${activeCategory} category.` 
              : "There are currently no products available."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
