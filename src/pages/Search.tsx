
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, X } from "lucide-react";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    // Update URL search params
    setSearchParams({ q: searchQuery });
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .ilike("name", `%${searchQuery}%`)
        .order("name");
        
      if (error) throw error;
      
      setProducts(data || []);
    } catch (err) {
      console.error("Error searching products:", err);
      setError("Failed to search products. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const clearSearch = () => {
    setSearchQuery("");
    setProducts([]);
    setSearchParams({});
  };

  // Search on initial load if query param exists
  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
      handleSearch();
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-serif font-semibold mb-6">Search Products</h1>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative max-w-xl">
          <Input
            type="search"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-24"
          />
          <div className="absolute right-0 top-0 h-full flex items-center space-x-1 pr-1">
            {searchQuery && (
              <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                onClick={clearSearch} 
                className="h-8 w-8"
              >
                <X size={16} />
              </Button>
            )}
            <Button type="submit" className="h-8">
              <SearchIcon size={16} className="mr-2" />
              Search
            </Button>
          </div>
        </div>
      </form>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-filiyaa-peach-500 border-t-transparent rounded-full"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-700">
          {error}
        </div>
      ) : (
        <>
          {searchParams.get("q") && (
            <h2 className="font-medium text-lg mb-4">
              {products.length === 0
                ? "No products found"
                : `Found ${products.length} product${products.length !== 1 ? "s" : ""} for "${searchParams.get("q")}"`}
            </h2>
          )}
          
          {products.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Search;
