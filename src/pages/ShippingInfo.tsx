
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Truck, Clock, Globe, PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ShippingInfo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-heartfelt-cream/5">
      {/* Header */}
      <div className="bg-heartfelt-burgundy/10 py-10">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            size="sm" 
            asChild 
            className="mb-4"
          >
            <Link to="/" className="flex items-center">
              <ArrowLeft size={16} className="mr-1" /> Back to Home
            </Link>
          </Button>
          <h1 className="text-3xl md:text-4xl font-serif font-semibold">Shipping Information</h1>
          <p className="text-muted-foreground mt-2">Everything you need to know about shipping and delivery</p>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Shipping Info Cards */}
          <div className="md:col-span-1">
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="bg-heartfelt-burgundy/10 p-3 rounded-full text-heartfelt-burgundy mr-4">
                    <Truck size={24} />
                  </div>
                  <h3 className="text-xl font-medium">Shipping Methods</h3>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center justify-between">
                    <span>Standard Shipping</span>
                    <span className="font-medium">3-5 business days</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Express Shipping</span>
                    <span className="font-medium">1-2 business days</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>International Shipping</span>
                    <span className="font-medium">7-14 business days</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Same Day Delivery</span>
                    <span className="font-medium">Select cities only</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="bg-heartfelt-burgundy/10 p-3 rounded-full text-heartfelt-burgundy mr-4">
                    <Clock size={24} />
                  </div>
                  <h3 className="text-xl font-medium">Processing Times</h3>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center justify-between">
                    <span>In-Stock Items</span>
                    <span className="font-medium">1-2 business days</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Custom Orders</span>
                    <span className="font-medium">5-7 business days</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Personalized Items</span>
                    <span className="font-medium">3-5 business days</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Gift Hampers</span>
                    <span className="font-medium">2-3 business days</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="bg-heartfelt-burgundy/10 p-3 rounded-full text-heartfelt-burgundy mr-4">
                    <Globe size={24} />
                  </div>
                  <h3 className="text-xl font-medium">International Orders</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  We ship to most countries worldwide. International orders may be subject to customs duties and taxes which are the responsibility of the recipient.
                </p>
                <p className="text-sm text-muted-foreground">
                  Please note that international shipping times may vary depending on customs processing in your country.
                </p>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
              <div className="prose prose-lg max-w-none">
                <h2>Shipping Policy</h2>
                <p>At Filiyaa, we strive to deliver your handcrafted items safely and promptly. We carefully package each item to ensure it reaches you in perfect condition. Please review the information below for details about our shipping process.</p>
                
                <h3>Shipping Costs</h3>
                <p>Shipping costs are calculated based on the weight, dimensions, and destination of your order. The exact shipping cost will be displayed during checkout before payment is processed.</p>
                
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 text-left">Order Value</th>
                      <th className="border p-2 text-left">Domestic Shipping</th>
                      <th className="border p-2 text-left">International Shipping</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">Under $50</td>
                      <td className="border p-2">$5.99</td>
                      <td className="border p-2">$15.99</td>
                    </tr>
                    <tr>
                      <td className="border p-2">$50 - $100</td>
                      <td className="border p-2">$3.99</td>
                      <td className="border p-2">$12.99</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Over $100</td>
                      <td className="border p-2">FREE</td>
                      <td className="border p-2">$9.99</td>
                    </tr>
                  </tbody>
                </table>
                
                <h3>Order Tracking</h3>
                <p>Once your order ships, you will receive a confirmation email with a tracking number. You can track your package by:</p>
                <ul>
                  <li>Clicking the tracking link in your shipping confirmation email</li>
                  <li>Logging into your account and viewing your order history</li>
                  <li>Contacting our customer service team with your order number</li>
                </ul>
                
                <h3>Delivery Times</h3>
                <p>Please note that delivery times are estimates and not guarantees. Factors such as weather conditions, holidays, and customs clearance (for international orders) can affect delivery times.</p>
                
                <h4>Domestic Orders:</h4>
                <ul>
                  <li>Standard Shipping: 3-5 business days</li>
                  <li>Express Shipping: 1-2 business days</li>
                  <li>Same Day Delivery: Available in select cities for orders placed before 11am local time</li>
                </ul>
                
                <h4>International Orders:</h4>
                <ul>
                  <li>Standard International: 7-14 business days</li>
                  <li>Express International: 3-5 business days</li>
                </ul>
                
                <div className="bg-heartfelt-burgundy/10 p-4 rounded-lg my-6">
                  <h3 className="text-heartfelt-burgundy mb-2">Free Shipping Offer</h3>
                  <p className="mb-0">Enjoy free domestic shipping on all orders over $100. The free shipping option will automatically be applied at checkout when eligible.</p>
                </div>
                
                <h3>Damaged or Lost Items</h3>
                <p>If your package arrives damaged or is lost during transit:</p>
                <ol>
                  <li>Contact our customer service team within 48 hours of delivery (for damaged items)</li>
                  <li>Provide your order number and photos of the damaged packaging/product if applicable</li>
                  <li>We will work with you to resolve the issue by offering a replacement or refund</li>
                </ol>
                
                <h3>Special Shipping Circumstances</h3>
                
                <h4>Perishable Items</h4>
                <p>For items like our Artisan Chocolates and other perishable products, we use special insulated packaging and expedited shipping to ensure freshness. These items may have different shipping restrictions and are only available for delivery to select regions.</p>
                
                <h4>Oversized Items</h4>
                <p>Large items such as certain Gift Hampers may incur additional shipping fees which will be clearly displayed during checkout.</p>
                
                <h3>Contact Us</h3>
                <p>If you have any questions about shipping, please contact our customer service team:</p>
                <p>
                  Email: shipping@filiyaa.com<br />
                  Phone: (555) 123-4567<br />
                  Hours: Monday through Friday, 9am to 5pm EST
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;
