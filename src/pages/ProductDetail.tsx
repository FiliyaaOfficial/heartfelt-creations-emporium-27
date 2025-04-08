
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Heart, Minus, Plus, Check, ShoppingBag, Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Product as ProductType } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/lib/utils';
import FeaturedProducts from '@/components/FeaturedProducts';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const { toast } = useToast();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        setProduct(data as ProductType);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Error fetching product",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, toast]);

  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    if (product && value > product.stock_quantity) return;
    setQuantity(value);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    await addToCart(product, quantity);
    setAddedToCart(true);
    
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-filiyaa-peach-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-medium mb-4">Product not found</h2>
        <p>The product you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="bg-gray-50 rounded-2xl overflow-hidden">
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-cover aspect-square" 
              />
            </div>
          </div>
          
          {/* Product Details */}
          <div>
            <div className="mb-2">
              <span className="text-sm text-filiyaa-peach-600 font-medium">{product.category}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-3">{product.name}</h1>
            <div className="mb-6">
              <span className="text-2xl font-serif font-semibold text-filiyaa-peach-700">{formatCurrency(product.price)}</span>
              <span className="text-sm text-gray-500 ml-2">Tax included</span>
            </div>
            
            <div className="prose mb-8">
              <p>{product.description}</p>
            </div>
            
            <Separator className="my-6" />
            
            {/* Quantity Selector */}
            <div className="mb-6">
              <p className="font-medium mb-2">Quantity</p>
              <div className="flex items-center">
                <button 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="p-2 rounded-l bg-gray-100 border border-gray-200 disabled:opacity-50"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <div className="px-6 py-2 border-t border-b border-gray-200 min-w-[60px] text-center">
                  {quantity}
                </div>
                <button 
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock_quantity}
                  className="p-2 rounded-r bg-gray-100 border border-gray-200 disabled:opacity-50"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {product.stock_quantity > 0 
                  ? `${product.stock_quantity} items available` 
                  : "Out of stock"}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Button 
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0 || addedToCart}
                className="flex-1 bg-filiyaa-peach-500 hover:bg-filiyaa-peach-600 text-white px-8 py-6 rounded-lg"
              >
                {addedToCart ? (
                  <>
                    <Check size={20} className="mr-2" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} className="mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="sm:flex-initial border-filiyaa-peach-200 text-filiyaa-peach-700 hover:bg-filiyaa-peach-50"
              >
                <Heart size={20} className="mr-2" />
                Add to Wishlist
              </Button>
              <Button 
                variant="outline" 
                className="sm:flex-initial border-gray-200"
              >
                <Share2 size={20} />
              </Button>
            </div>
            
            <Separator className="my-6" />
            
            {/* Key Features */}
            <div>
              <h3 className="text-lg font-medium mb-4">Key Features</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <div className="bg-filiyaa-peach-100 rounded-full p-1 mr-2">
                    <Check size={14} className="text-filiyaa-peach-600" />
                  </div>
                  Handcrafted with premium materials
                </li>
                <li className="flex items-start">
                  <div className="bg-filiyaa-peach-100 rounded-full p-1 mr-2">
                    <Check size={14} className="text-filiyaa-peach-600" />
                  </div>
                  Unique design, perfect for gifting
                </li>
                <li className="flex items-start">
                  <div className="bg-filiyaa-peach-100 rounded-full p-1 mr-2">
                    <Check size={14} className="text-filiyaa-peach-600" />
                  </div>
                  Elegant packaging included
                </li>
                <li className="flex items-start">
                  <div className="bg-filiyaa-peach-100 rounded-full p-1 mr-2">
                    <Check size={14} className="text-filiyaa-peach-600" />
                  </div>
                  Fast delivery within 3-5 business days
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      <FeaturedProducts title="You May Also Like" subtitle="Other products you might be interested in" />
    </>
  );
};

export default ProductDetail;
