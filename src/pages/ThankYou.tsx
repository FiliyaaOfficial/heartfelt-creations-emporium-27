
import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Home, Mail, MessageSquare, Palette } from 'lucide-react';

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const formType = searchParams.get('form') || 'contact';

  const getFormConfig = (type: string) => {
    switch (type) {
      case 'newsletter':
        return {
          title: 'Thanks for Subscribing!',
          description: 'You\'ve successfully subscribed to our newsletter. Get ready for exclusive offers and heartfelt gift ideas.',
          icon: <Mail className="w-16 h-16 text-heartfelt-burgundy" />,
          message: 'Check your email for a welcome message and your first exclusive offer!'
        };
      case 'support':
        return {
          title: 'Message Received!',
          description: 'Thank you for reaching out to us. We\'ve received your support request and will get back to you soon.',
          icon: <MessageSquare className="w-16 h-16 text-heartfelt-burgundy" />,
          message: 'Our support team typically responds within 24 hours during business days.'
        };
      case 'custom':
        return {
          title: 'Custom Order Submitted!',
          description: 'Your custom order request has been received. We\'re excited to bring your vision to life!',
          icon: <Palette className="w-16 h-16 text-heartfelt-burgundy" />,
          message: 'Our design team will review your request and contact you within 2-3 business days with a quote and timeline.'
        };
      default:
        return {
          title: 'Thank You!',
          description: 'Your form has been successfully submitted. We appreciate you reaching out to us.',
          icon: <CheckCircle className="w-16 h-16 text-heartfelt-burgundy" />,
          message: 'We will get back to you as soon as possible.'
        };
    }
  };

  const config = getFormConfig(formType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-heartfelt-cream/20 via-white to-heartfelt-burgundy/5 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              {config.icon}
            </div>
            <CardTitle className="text-2xl font-bold text-heartfelt-dark">
              {config.title}
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              {config.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-gray-700 leading-relaxed">
              {config.message}
            </p>
            
            <div className="space-y-3">
              <Button 
                asChild 
                className="w-full bg-heartfelt-burgundy hover:bg-heartfelt-dark py-6 text-lg"
              >
                <Link to="/">
                  <Home className="w-5 h-5 mr-2" />
                  Return to Home
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                className="w-full border-heartfelt-burgundy text-heartfelt-burgundy hover:bg-heartfelt-burgundy hover:text-white py-6 text-lg"
              >
                <Link to="/shop">
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThankYou;
