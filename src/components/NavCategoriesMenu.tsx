
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { Category as CategoryType } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

const CategoryItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
CategoryItem.displayName = "CategoryItem";

interface NavCategoriesMenuProps {
  activePath?: string;
}

const NavCategoriesMenu = ({ activePath }: NavCategoriesMenuProps) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const isActiveCategory = activePath?.startsWith('/categories') || activePath?.startsWith('/category');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories for navbar...');
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .limit(6); // Limit to prevent an overly large dropdown
          
        if (error) {
          console.error('Error fetching categories:', error);
          throw error;
        }
        
        console.log('Fetched categories for navbar:', data);
        setCategories(data as CategoryType[]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger 
            className={cn(
              "text-sm lg:text-base text-gray-800 hover:text-heartfelt-burgundy transition-colors font-medium px-2 py-1",
              isActiveCategory ? "text-heartfelt-burgundy font-semibold" : ""
            )}
          >
            Categories
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2 bg-white border border-heartfelt-cream/50 shadow-md">
              {isLoading ? (
                <li className="col-span-2 flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-heartfelt-burgundy"></div>
                </li>
              ) : categories.length > 0 ? (
                <>
                  {categories.map((category) => (
                    <CategoryItem
                      key={category.id}
                      title={category.name}
                      href={`/category/${encodeURIComponent(category.name)}`}
                    >
                      {category.description || 'Discover beautiful handcrafted items in this category'}
                    </CategoryItem>
                  ))}
                  <li className="col-span-2">
                    <div className="mt-4 flex justify-center">
                      <Link 
                        to="/categories"
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "w-full justify-center bg-heartfelt-cream hover:bg-heartfelt-burgundy hover:text-white text-center"
                        )}
                      >
                        View All Categories
                      </Link>
                    </div>
                  </li>
                </>
              ) : (
                <li className="col-span-2 flex items-center justify-center p-4">
                  <p className="text-sm text-muted-foreground">No categories available</p>
                </li>
              )}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavCategoriesMenu;
