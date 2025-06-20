
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Send } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    try {
      // Check if email already exists
      const { data: existingSubscription } = await supabase
        .from('newsletter_subscriptions')
        .select('email')
        .eq('email', email)
        .single();

      if (existingSubscription) {
        toast.error('This email is already subscribed to our newsletter');
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert({
          email: email,
          is_active: true,
          subscribed_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error subscribing to newsletter:', error);
        toast.error('Failed to subscribe. Please try again.');
        return;
      }

      toast.success('Successfully subscribed to our newsletter! 🎉');
      setEmail('');
      
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-r from-heartfelt-burgundy to-heartfelt-dark py-16">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Mail className="w-8 h-8 text-heartfelt-cream" />
            <h2 className="text-3xl font-bold text-white">Stay Connected</h2>
          </div>
          <p className="text-heartfelt-cream text-lg mb-8">
            Subscribe to our newsletter and be the first to know about new collections, 
            exclusive offers, and handcrafted inspiration delivered to your inbox.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:border-heartfelt-cream focus:bg-white/20"
            />
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-heartfelt-cream text-heartfelt-dark hover:bg-white font-semibold px-8"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-heartfelt-dark border-t-transparent rounded-full"></div>
                  Subscribing...
                </div>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Subscribe
                </>
              )}
            </Button>
          </form>
          
          <p className="text-heartfelt-cream/80 text-sm mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
