
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Minus, Plus, ShoppingBag, Heart, Share2, Check, Award, ShieldCheck, Truck, Package, Star, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { toast as sonnerToast } from "sonner";
import ProductReviews from '@/components/ProductReviews';
import RelatedProducts from '@/components/RelatedProducts';
import ProductCustomization from '@/components/ProductCustomization';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [customization, setCustomization] = useState('');
  const [customizationImages, setCustomizationImages] = useState<string[]>([]);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [inWishlist, setInWishlist] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        console.log('Fetching product with ID:', id);
        const { data, error } = await supabase
          .from('products')
          .select()
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching product:', error);
          throw error;
        }
        
        console.log('Product fetched successfully:', data);
        setProduct(data as Product);
        setActiveImage(data.image_url || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12');
        
        // After fetching product, get related products
        if (data.category) {
          fetchRelatedProducts(data.category);
        }
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

  const fetchRelatedProducts = async (category: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select()
        .eq('category', category)
        .neq('id', id)
        .limit(4);

      if (error) throw error;
      setRelatedProducts(data as Product[]);
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

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
      // For customizable products, include customization data
      const productWithCustomization = {
        ...product,
        customization: product.is_customizable ? customization : undefined,
        customizationImages: product.is_customizable ? customizationImages : undefined
      };
      
      addToCart(productWithCustomization, quantity);
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

  const handleCustomizationChange = (newCustomization: string, images: string[]) => {
    setCustomization(newCustomization);
    setCustomizationImages(images);
  };

  // Simulated product images (in a real app, these would come from the database)
  const productImages = [
    product?.image_url || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12',
    'https://images.unsplash.com/photo-1567721913486-6585f069b332',
    'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
  ].filter(Boolean);

  // Product features
  const productFeatures = [
    { icon: <Award className="text-heartfelt-burgundy" />, title: 'Premium Quality', description: 'Handcrafted with attention to detail' },
    { icon: <ShieldCheck className="text-heartfelt-burgundy" />, title: '1 Year Warranty', description: 'We stand behind our products' },
    { icon: <Truck className="text-heartfelt-burgundy" />, title: 'Free Shipping', description: 'On orders over ₹2000' },
  ];

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
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-1 text-sm text-muted-foreground">
          <li><Link to="/" className="hover:text-heartfelt-burgundy">Home</Link></li>
          <li><ChevronRight size={14} /></li>
          <li><Link to="/categories" className="hover:text-heartfelt-burgundy">Categories</Link></li>
          <li><ChevronRight size={14} /></li>
          <li>
            <Link 
              to={`/categories/${product.category.toLowerCase()}`} 
              className="hover:text-heartfelt-burgundy"
            >
              {product.category}
            </Link>
          </li>
          <li><ChevronRight size={14} /></li>
          <li className="text-foreground font-medium">{product.name}</li>
        </ol>
      </nav>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Product Gallery */}
        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden bg-white shadow-sm border border-heartfelt-cream aspect-square relative">
            <img 
              src={activeImage} 
              alt={product.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1546868871-7041f2a55e12';
              }}
            />
            
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.is_new && (
                <span className="premium-badge bg-heartfelt-burgundy text-white">New Arrival</span>
              )}
              {product.is_bestseller && (
                <span className="premium-badge bg-heartfelt-pink text-white">Bestseller</span>
              )}
              {product.is_customizable && (
                <span className="premium-badge bg-blue-500 text-white">Customizable</span>
              )}
            </div>
          </div>
          
          {/* Thumbnail Gallery */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {productImages.map((img, idx) => (
              <button 
                key={idx}
                className={`rounded-md overflow-hidden border-2 ${activeImage === img ? 'border-heartfelt-burgundy' : 'border-heartfelt-cream'} w-20 h-20 flex-shrink-0`}
                onClick={() => setActiveImage(img || '')}
              >
                <img 
                  src={img} 
                  alt={`${product.name} thumbnail ${idx + 1}`} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1546868871-7041f2a55e12';
                  }}
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Product Details */}
        <div>
          <div className="mb-6">
            <p className="text-sm text-heartfelt-burgundy font-medium uppercase tracking-wider mb-2">{product.category}</p>
            <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-3">{product.name}</h1>
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={18} 
                  className={i < 4 ? "fill-heartfelt-burgundy text-heartfelt-burgundy" : "text-gray-300"}
                />
              ))}
              <span className="text-sm font-medium ml-2">4.0</span>
              <span className="text-sm text-muted-foreground ml-1">(12 reviews)</span>
            </div>
            
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
          
          {/* Product Features */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {productFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg border border-heartfelt-cream">
                <div className="flex-shrink-0 mt-1">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-medium text-sm">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          
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
      
      {/* Product Customization - Only show for customizable products */}
      {product.is_customizable && (
        <ProductCustomization
          onCustomizationChange={handleCustomizationChange}
          initialCustomization={customization}
          initialImages={customizationImages}
        />
      )}
      
      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="bg-white p-6 rounded-lg border border-heartfelt-cream">
            <h3 className="text-xl font-serif font-semibold mb-4">Product Description</h3>
            <p className="text-gray-700 mb-4">
              {product.description}
            </p>
            <p className="text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, velit vel bibendum bibendum, 
              risus nibh congue libero, ac congue urna velit vel nibh. Nulla facilisi. Sed auctor, nibh vel bibendum 
              bibendum, risus nibh congue libero, ac congue urna velit vel nibh.
            </p>
          </TabsContent>
          <TabsContent value="specifications" className="bg-white p-6 rounded-lg border border-heartfelt-cream">
            <h3 className="text-xl font-serif font-semibold mb-4">Product Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Dimensions</h4>
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-heartfelt-cream">
                      <td className="py-2 text-muted-foreground">Height</td>
                      <td className="py-2">10 inches</td>
                    </tr>
                    <tr className="border-b border-heartfelt-cream">
                      <td className="py-2 text-muted-foreground">Width</td>
                      <td className="py-2">8 inches</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-muted-foreground">Weight</td>
                      <td className="py-2">1.2 kg</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Materials</h4>
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-heartfelt-cream">
                      <td className="py-2 text-muted-foreground">Primary Material</td>
                      <td className="py-2">Premium Quality Cotton</td>
                    </tr>
                    <tr className="border-b border-heartfelt-cream">
                      <td className="py-2 text-muted-foreground">Secondary Material</td>
                      <td className="py-2">Natural Dyes</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-muted-foreground">Finishing</td>
                      <td className="py-2">Hand-finished</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-8">
              <h4 className="font-medium text-sm mb-2">Care Instructions</h4>
              <ul className="list-disc list-inside text-sm space-y-2 text-gray-700">
                <li>Hand wash with cold water</li>
                <li>Do not bleach</li>
                <li>Hang dry in shade</li>
                <li>Iron on low temperature if needed</li>
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="bg-white p-6 rounded-lg border border-heartfelt-cream">
            <ProductReviews productId={product.id} />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Related Products Section */}
      <RelatedProducts 
        products={relatedProducts}
        category={product.category}
      />
    </div>
  );
};

export default ProductDetail;
