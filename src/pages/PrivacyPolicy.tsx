
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PrivacyPolicy = () => {
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
          <h1 className="text-3xl md:text-4xl font-serif font-semibold">Privacy Policy</h1>
          <p className="text-muted-foreground mt-2">Last updated: April 10, 2025</p>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <p>At Filiyaa, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.</p>
            
            <h2>Information We Collect</h2>
            <p>We collect information that you provide directly to us, such as when you:</p>
            <ul>
              <li>Create an account</li>
              <li>Make a purchase</li>
              <li>Sign up for our newsletter</li>
              <li>Contact our customer service</li>
              <li>Participate in surveys or promotions</li>
            </ul>
            
            <p>This information may include:</p>
            <ul>
              <li>Contact information (name, email address, mailing address, phone number)</li>
              <li>Payment information (credit card details, billing address)</li>
              <li>Account credentials (username, password)</li>
              <li>Order history and preferences</li>
              <li>Communications with our customer service team</li>
            </ul>
            
            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your orders, products, and services</li>
              <li>Send you marketing communications (if you have opted in)</li>
              <li>Improve our website, products, and services</li>
              <li>Detect, prevent, and address fraud or security issues</li>
              <li>Comply with legal obligations</li>
            </ul>
            
            <h2>Cookies and Tracking Technologies</h2>
            <p>We use cookies and similar tracking technologies to track activity on our website and to hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
            
            <h2>Third-Party Sharing</h2>
            <p>We may share your information with:</p>
            <ul>
              <li>Service providers who perform services on our behalf (payment processors, shipping companies)</li>
              <li>Business partners with whom we jointly offer products or services</li>
              <li>Legal authorities when required by law or to protect our rights</li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>
            
            <h2>Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect the security of your personal information. However, please note that no method of transmission over the internet or electronic storage is 100% secure.</p>
            
            <h2>Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Correct any inaccurate or incomplete information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to or restrict processing of your information</li>
              <li>Receive a copy of your information in a structured, machine-readable format</li>
            </ul>
            
            <h2>Children's Privacy</h2>
            <p>Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13.</p>
            
            <h2>Updates to This Policy</h2>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>
            
            <h2>Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <p>
              Filiyaa<br />
              Email: privacy@filiyaa.com<br />
              Address: 123 Craft Street, Artisan City, AC 12345
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
