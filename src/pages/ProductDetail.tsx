import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, ShoppingBag, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select()
          .eq('id', id)
          .single();

        if (error) throw error;
        setProduct(data as Product);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    if (product && quantity < product.stock_quantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-filiyaa-peach-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-serif font-semibold mb-4">Product Not Found</h1>
        <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/categories">
          <Button className="bg-filiyaa-peach-500 hover:bg-filiyaa-peach-600">
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <div className="rounded-xl overflow-hidden bg-white shadow-sm">
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-auto object-cover"
          />
        </div>
        
        {/* Product Details */}
        <div>
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
            <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-2">{product.name}</h1>
            <p className="text-2xl font-serif text-filiyaa-peach-600 font-semibold mb-4">
              {formatCurrency(product.price)}
            </p>
            <div className="h-px bg-gray-200 my-6"></div>
            <p className="text-gray-700 mb-6">{product.description}</p>
          </div>
          
          {/* Quantity Selector */}
          <div className="mb-6">
            <p className="font-medium mb-2">Quantity</p>
            <div className="flex items-center">
              <button 
                onClick={handleDecreaseQuantity}
                disabled={quantity <= 1}
                className="p-2 rounded-l border border-gray-300 disabled:opacity-50"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <div className="px-6 py-2 border-t border-b border-gray-300 text-center">
                {quantity}
              </div>
              <button 
                onClick={handleIncreaseQuantity}
                disabled={product.stock_quantity <= quantity}
                className="p-2 rounded-r border border-gray-300 disabled:opacity-50"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
              <span className="ml-4 text-sm text-muted-foreground">
                {product.stock_quantity} available
              </span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="bg-filiyaa-peach-500 hover:bg-filiyaa-peach-600 flex-1"
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
            >
              <ShoppingBag size={18} className="mr-2" />
              Add to Cart
            </Button>
            <Button variant="outline" className="border-filiyaa-peach-500 text-filiyaa-peach-600 hover:bg-filiyaa-peach-50">
              <Heart size={18} className="mr-2" />
              Add to Wishlist
            </Button>
          </div>
          
          {/* Product Metadata */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Product ID</p>
                <p className="font-medium">{product.id.slice(0, 8)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium">{product.category}</p>
              </div>
              {product.is_new && (
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium text-filiyaa-peach-600">New Arrival</p>
                </div>
              )}
              {product.is_bestseller && (
                <div>
                  <p className="text-sm text-muted-foreground">Popularity</p>
                  <p className="font-medium text-filiyaa-cream-600">Bestseller</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
