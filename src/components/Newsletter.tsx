import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, CheckCircle, Phone } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

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
      console.log('Subscribing email to newsletter:', email);
      
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .insert([
          {
            email: email,
            subscribed_at: new Date().toISOString(),
            is_active: true
          }
        ])
        .select();

      if (error) {
        console.error('Newsletter subscription error:', error);
        
        // Handle duplicate email error
        if (error.code === '23505') {
          toast({
            title: "Already subscribed",
            description: "This email is already subscribed to our newsletter.",
            variant: "default",
          });
        } else {
          throw error;
        }
      } else {
        console.log('Newsletter subscription successful:', data);
        
        setIsSubscribed(true);
        toast({
          title: "Successfully subscribed!",
          description: "Thank you for joining our newsletter. We'll keep you updated on new products and offers.",
          variant: "default",
        });
        setEmail('');
        
        setTimeout(() => {
          setIsSubscribed(false);
        }, 5000);
      }
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

  const whatsappNumber = "7050682347";
  const whatsappMessage = "Hi! I'm interested in your handcrafted products.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

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
        
        <div className="mt-4 pt-4 border-t">
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full bg-green-500 hover:bg-green-600 text-white rounded-md py-2 px-4 transition-colors"
          >
            <Phone className="mr-2 h-4 w-4" />
            WhatsApp Us
          </a>
        </div>
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
        
        <div className="mt-3">
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white text-sm flex items-center"
          >
            <Phone className="mr-2 h-3 w-3" />
            WhatsApp: {whatsappNumber}
          </a>
        </div>
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
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto mb-6">
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
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <p className="text-xs text-muted-foreground">
            By subscribing, you agree to our <Link to="/privacy" className="underline">Privacy Policy</Link>. You can unsubscribe at any time.
          </p>
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-green-600 hover:text-green-700 font-medium"
          >
            <Phone className="mr-2 h-4 w-4" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
