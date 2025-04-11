import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface NewsletterProps {
  className?: string;
  variant?: 'default' | 'sidebar' | 'footer';
}

const Newsletter = ({ className, variant = 'default' }: NewsletterProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email address",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubscribed(true);
      toast({
        title: "Successfully subscribed!",
        description: "Thank you for joining our newsletter.",
        variant: "default",
      });
      setEmail('');
      
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (variant === 'sidebar') {
    return (
      <div className={cn("bg-white p-5 rounded-lg shadow-sm", className)}>
        <h3 className="font-medium text-lg mb-2">Stay Updated</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Subscribe to our newsletter for exclusive offers and updates.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="space-y-3">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50"
              disabled={isSubmitting || isSubscribed}
            />
            <Button 
              type="submit" 
              className="w-full bg-heartfelt-burgundy hover:bg-heartfelt-dark"
              disabled={isSubmitting || isSubscribed}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">◌</span>
                  Subscribing...
                </>
              ) : isSubscribed ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Subscribed!
                </>
              ) : (
                'Subscribe'
              )}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={className}>
        <h3 className="text-white font-medium mb-2">Join Our Newsletter</h3>
        <p className="text-white/80 text-sm mb-3">
          Get updates on new products and exclusive offers.
        </p>
        <form onSubmit={handleSubmit} className="flex">
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-r-none focus:ring-0"
            disabled={isSubmitting || isSubscribed}
          />
          <Button 
            type="submit" 
            className="bg-heartfelt-cream text-heartfelt-burgundy hover:bg-white rounded-l-none"
            disabled={isSubmitting || isSubscribed}
          >
            {isSubmitting ? (
              <span className="animate-spin">◌</span>
            ) : isSubscribed ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              'Subscribe'
            )}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className={cn("bg-heartfelt-burgundy/10 py-14 px-4", className)}>
      <div className="container mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center justify-center p-2 bg-heartfelt-burgundy/20 rounded-full mb-4">
          <Mail size={20} className="text-heartfelt-burgundy" />
        </div>
        <h2 className="text-2xl md:text-3xl font-serif font-medium mb-3">
          Join Our Newsletter
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-6">
          Subscribe to our newsletter and be the first to know about new products, special offers, and upcoming events.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-grow"
            disabled={isSubmitting || isSubscribed}
          />
          <Button 
            type="submit" 
            className="bg-heartfelt-burgundy hover:bg-heartfelt-dark"
            disabled={isSubmitting || isSubscribed}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">◌</span>
                Subscribing...
              </>
            ) : isSubscribed ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Subscribed!
              </>
            ) : (
              'Subscribe'
            )}
          </Button>
        </form>
        
        <p className="text-xs text-muted-foreground mt-4">
          By subscribing, you agree to our <Link to="/privacy" className="underline">Privacy Policy</Link>. You can unsubscribe at any time.
        </p>
      </div>
    </div>
  );
};

export default Newsletter;
