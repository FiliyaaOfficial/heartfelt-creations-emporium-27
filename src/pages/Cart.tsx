import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCurrency } from '@/hooks/useCurrency';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, isLoading, subtotal } = useCart();
  const { formatCurrency } = useCurrency();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-serif font-semibold text-center mb-4">Your Shopping Cart</h1>
      <div className="mx-auto max-w-6xl">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-filiyaa-peach-600"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-filiyaa-peach-50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <ShoppingBag size={40} className="text-filiyaa-peach-500" />
            </div>
            <h2 className="text-2xl font-serif font-medium mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Looks like you haven't added any products to your cart yet.</p>
            <Link to="/categories">
              <Button className="bg-filiyaa-peach-500 hover:bg-filiyaa-peach-600">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div className="md:col-span-2 lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <table className="w-full">
                  <thead className="border-b border-gray-100">
                    <tr>
                      <th className="text-left pb-4">Product</th>
                      <th className="text-center pb-4 hidden sm:table-cell">Price</th>
                      <th className="text-center pb-4">Quantity</th>
                      <th className="text-right pb-4 hidden sm:table-cell">Total</th>
                      <th className="pb-4 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {cartItems.map((item) => {
                      // Safely handle customization images
                      const customizationImages = item.selected_options?.customizationImages;
                      let imageArray: string[] = [];
                      
                      if (Array.isArray(customizationImages)) {
                        imageArray = customizationImages;
                      } else if (typeof customizationImages === 'string') {
                        imageArray = [customizationImages];
                      }
                      
                      return (
                        <tr key={item.id} className="py-4">
                          <td className="py-4">
                            <div className="flex items-start space-x-3">
                              <img 
                                src={item.product.image_url} 
                                alt={item.product.name} 
                                className="h-16 w-16 object-cover rounded flex-shrink-0"
                                loading="lazy"
                              />
                              <div className="flex-grow">
                                <h3 className="font-medium">{item.product.name}</h3>
                                <p className="text-sm text-muted-foreground">{item.product.category}</p>
                                <p className="text-sm text-filiyaa-peach-600 font-medium sm:hidden">
                                  {formatCurrency(item.product.price)}
                                </p>
                                
                                {/* Show customization details */}
                                {item.customization && (
                                  <div className="mt-2 p-2 bg-blue-50 rounded-md">
                                    <p className="text-xs font-medium text-blue-800 mb-1">Customization:</p>
                                    <p className="text-xs text-blue-700">{item.customization}</p>
                                    
                                    {/* Show customization images if available */}
                                    {imageArray.length > 0 && (
                                      <div className="mt-2 flex gap-1">
                                        {imageArray.slice(0, 3).map((imageUrl: string, index: number) => (
                                          <div key={index} className="relative">
                                            <img 
                                              src={imageUrl} 
                                              alt={`Customization ${index + 1}`}
                                              className="w-8 h-8 object-cover rounded border"
                                            />
                                            {index === 2 && imageArray.length > 3 && (
                                              <div className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center">
                                                <span className="text-white text-xs">+{imageArray.length - 3}</span>
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="text-center hidden sm:table-cell">
                            {formatCurrency(item.product.price)}
                          </td>
                          <td className="py-4">
                            <div className="flex items-center justify-center">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="p-1 rounded-l border border-gray-200 disabled:opacity-50"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={16} />
                              </button>
                              <div className="px-4 py-1 border-t border-b border-gray-200 min-w-[40px] text-center">
                                {item.quantity}
                              </div>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.product.stock_quantity}
                                className="p-1 rounded-r border border-gray-200 disabled:opacity-50"
                                aria-label="Increase quantity"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </td>
                          <td className="text-right hidden sm:table-cell">
                            {formatCurrency(item.product.price * item.quantity)}
                          </td>
                          <td className="py-4 text-right">
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-500 hover:text-filiyaa-peach-500"
                              aria-label="Remove item"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium mb-4">Order Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="border-t pt-3 mt-3 border-gray-100">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-filiyaa-peach-600">{formatCurrency(subtotal)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Tax included</p>
                  </div>
                </div>
                <Link to="/checkout">
                  <Button className="w-full bg-filiyaa-peach-500 hover:bg-filiyaa-peach-600">
                    Checkout <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
                <Link to="/categories" className="block text-center mt-4 text-sm text-filiyaa-peach-600 hover:text-filiyaa-peach-700">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
