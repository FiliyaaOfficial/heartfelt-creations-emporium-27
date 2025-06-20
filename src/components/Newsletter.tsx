
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface NewsletterProps {
  variant?: 'default' | 'footer';
  className?: string;
}

const Newsletter: React.FC<NewsletterProps> = ({ variant = 'default', className }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') {
          toast.error('You are already subscribed to our newsletter!');
        } else {
          toast.error('Failed to subscribe. Please try again.');
        }
      } else {
        toast.success('Successfully subscribed to our newsletter!');
        setEmail('');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFooterVariant = variant === 'footer';

  return (
    <div className={cn(
      isFooterVariant 
        ? "text-center" 
        : "bg-gradient-to-r from-heartfelt-sage/10 to-heartfelt-peach/10 py-16",
      className
    )}>
      <div className={cn(
        "max-w-2xl mx-auto",
        !isFooterVariant && "px-4"
      )}>
        <h2 className={cn(
          "font-serif mb-4",
          isFooterVariant 
            ? "text-xl md:text-2xl text-white" 
            : "text-3xl md:text-4xl text-gray-900 text-center"
        )}>
          {isFooterVariant ? "Stay Updated" : "Stay Connected"}
        </h2>
        <p className={cn(
          "mb-6",
          isFooterVariant 
            ? "text-white/80 text-sm md:text-base" 
            : "text-gray-600 text-center text-lg"
        )}>
          {isFooterVariant 
            ? "Get the latest updates on new products and exclusive offers." 
            : "Subscribe to our newsletter for the latest handcrafted gifts and special offers."}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={cn(
              "flex-1",
              isFooterVariant 
                ? "bg-white/10 border-white/20 text-white placeholder:text-white/60" 
                : "bg-white"
            )}
            required
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            className={cn(
              isFooterVariant 
                ? "bg-white text-heartfelt-burgundy hover:bg-white/90" 
                : "bg-heartfelt-sage hover:bg-heartfelt-sage/90 text-white"
            )}
          >
            {isLoading ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;
