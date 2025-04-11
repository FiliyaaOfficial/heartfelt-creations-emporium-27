
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TermsOfService = () => {
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
          <h1 className="text-3xl md:text-4xl font-serif font-semibold">Terms of Service</h1>
          <p className="text-muted-foreground mt-2">Last updated: April 10, 2025</p>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <p>Welcome to Filiyaa. Please read these Terms of Service carefully before using our website. By accessing or using our website, you agree to be bound by these Terms.</p>
            
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using our website, you agree to these Terms of Service and our Privacy Policy. If you do not agree to these Terms, please do not use our website.</p>
            
            <h2>2. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of the website constitutes acceptance of the modified Terms.</p>
            
            <h2>3. Account Registration</h2>
            <p>To access certain features of our website, you may need to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities under your account. You agree to provide accurate and complete information and to update your information as needed.</p>
            
            <h2>4. Products and Orders</h2>
            <h3>4.1 Product Information</h3>
            <p>We strive to accurately display our products, but we do not guarantee that product images perfectly reflect the actual appearance. Due to the handmade nature of our products, variations in color, pattern, and size may occur.</p>
            
            <h3>4.2 Pricing and Availability</h3>
            <p>All prices are displayed in USD and are subject to change. We reserve the right to modify prices, discontinue products, or limit quantities at any time without notice. We do not guarantee the availability of all products shown on our website.</p>
            
            <h3>4.3 Order Acceptance</h3>
            <p>Your order constitutes an offer to purchase. We reserve the right to accept or decline your order for any reason, including product unavailability, errors in pricing or product information, or suspected fraud.</p>
            
            <h2>5. Payment Terms</h2>
            <p>We accept various payment methods as indicated during checkout. By providing payment information, you represent that you are authorized to use the payment method and that the information is accurate and complete.</p>
            
            <h2>6. Shipping and Delivery</h2>
            <p>Shipping times and costs will be provided during checkout. We are not responsible for delays caused by carriers, customs, or other circumstances beyond our control. Risk of loss and title for items purchased pass to you upon delivery.</p>
            
            <h2>7. Returns and Refunds</h2>
            <p>Please refer to our Shipping and Return Policy for information on returns, exchanges, and refunds. Custom-made or personalized items may not be returnable unless defective.</p>
            
            <h2>8. Intellectual Property</h2>
            <p>All content on our website, including text, images, logos, and designs, is the property of Filiyaa and is protected by copyright, trademark, and other intellectual property laws. You may not use, reproduce, or distribute our content without our express permission.</p>
            
            <h2>9. User Content</h2>
            <p>By submitting reviews, comments, or other content to our website, you grant us a non-exclusive, royalty-free, perpetual, and worldwide license to use, display, and distribute your content in connection with our website and business.</p>
            
            <h2>10. Limitation of Liability</h2>
            <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, FILIYAA SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE WEBSITE OR PRODUCTS PURCHASED.</p>
            
            <h2>11. Dispute Resolution</h2>
            <p>Any dispute arising from these Terms or your use of our website shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. The arbitration shall take place in [Your City, State].</p>
            
            <h2>12. Governing Law</h2>
            <p>These Terms are governed by the laws of [Your State/Country], without regard to its conflict of law principles.</p>
            
            <h2>13. Contact Information</h2>
            <p>If you have any questions about these Terms, please contact us at:</p>
            <p>
              Filiyaa<br />
              Email: terms@filiyaa.com<br />
              Address: 123 Craft Street, Artisan City, AC 12345
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
