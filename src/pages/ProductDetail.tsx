
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Minus, Plus, ShoppingBag, Heart, Share2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { toast as sonnerToast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [inWishlist, setInWishlist] = useState(false);
  const { toast } = useToast();

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
        toast({
          title: "Error fetching product",
          description: "Could not load product details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, toast]);

  useEffect(() => {
    if (product) {
      setInWishlist(isInWishlist(product.id));
    }
  }, [product, isInWishlist]);

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
      sonnerToast("Added to cart", {
        description: `${quantity} × ${product.name} added to your cart`,
        action: {
          label: "View Cart",
          onClick: () => window.location.href = "/cart"
        },
      });
    }
  };
  
  const handleToggleWishlist = () => {
    if (!product) return;
    
    if (inWishlist) {
      removeFromWishlist(product.id);
      setInWishlist(false);
      sonnerToast("Removed from wishlist", {
        description: `${product.name} has been removed from your wishlist`,
      });
    } else {
      addToWishlist(product);
      setInWishlist(true);
      sonnerToast("Added to wishlist", {
        description: `${product.name} has been added to your wishlist`,
        action: {
          label: "View Wishlist",
          onClick: () => window.location.href = "/wishlist"
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heartfelt-burgundy"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-serif font-semibold mb-4">Product Not Found</h1>
        <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/categories">
          <Button className="bg-heartfelt-burgundy hover:bg-heartfelt-dark">
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Product Image */}
        <div className="rounded-xl overflow-hidden bg-white shadow-sm border border-heartfelt-cream">
          <div className="relative">
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-auto object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.is_new && (
                <span className="premium-badge bg-heartfelt-burgundy text-white">New Arrival</span>
              )}
              {product.is_bestseller && (
                <span className="premium-badge bg-heartfelt-pink text-white">Bestseller</span>
              )}
            </div>
          </div>
        </div>
        
        {/* Product Details */}
        <div>
          <div className="mb-6">
            <p className="text-sm text-heartfelt-burgundy font-medium uppercase tracking-wider mb-2">{product.category}</p>
            <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-3">{product.name}</h1>
            <p className="text-2xl font-serif text-heartfelt-burgundy font-semibold mb-4">
              {formatCurrency(product.price)}
            </p>
            
            <div className="h-px bg-heartfelt-cream my-6"></div>
            
            <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>
            
            {product.stock_quantity > 0 ? (
              <div className="flex items-center gap-2 mb-6">
                <Check size={18} className="text-green-600" />
                <span className="text-green-600">In Stock</span>
                <span className="text-sm text-muted-foreground ml-2">
                  ({product.stock_quantity} available)
                </span>
              </div>
            ) : (
              <div className="text-red-500 mb-6">Out of Stock</div>
            )}
          </div>
          
          {/* Quantity Selector */}
          <div className="mb-8">
            <p className="font-medium mb-3">Quantity</p>
            <div className="flex items-center">
              <button 
                onClick={handleDecreaseQuantity}
                disabled={quantity <= 1}
                className="p-2 rounded-l border border-heartfelt-cream disabled:opacity-50"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <div className="px-6 py-2 border-t border-b border-heartfelt-cream text-center min-w-[60px]">
                {quantity}
              </div>
              <button 
                onClick={handleIncreaseQuantity}
                disabled={product.stock_quantity <= quantity}
                className="p-2 rounded-r border border-heartfelt-cream disabled:opacity-50"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="bg-heartfelt-burgundy hover:bg-heartfelt-dark flex-1 py-6"
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
              size="lg"
            >
              <ShoppingBag size={18} className="mr-2" />
              Add to Cart
            </Button>
            <Button 
              variant="outline" 
              className={`border-heartfelt-burgundy py-6 ${
                inWishlist 
                  ? "bg-heartfelt-pink text-white hover:bg-heartfelt-burgundy border-heartfelt-pink" 
                  : "text-heartfelt-burgundy hover:bg-heartfelt-cream/50"
              }`}
              onClick={handleToggleWishlist}
            >
              <Heart size={18} className={`mr-2 ${inWishlist ? "fill-white" : ""}`} />
              {inWishlist ? "In Wishlist" : "Add to Wishlist"}
            </Button>
          </div>
          
          {/* Share Button */}
          <Button variant="ghost" className="mt-4 text-muted-foreground hover:text-heartfelt-burgundy">
            <Share2 size={16} className="mr-2" />
            Share this product
          </Button>
          
          {/* Product Metadata */}
          <div className="mt-8 pt-6 border-t border-heartfelt-cream">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Product ID</p>
                <p className="font-medium">{product.id.slice(0, 8)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium">{product.category}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
