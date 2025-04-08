
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CustomOrderCta = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="relative overflow-hidden rounded-3xl">
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-heartfelt-burgundy/90">
          <img 
            src="https://images.unsplash.com/photo-1596920566403-2072ed942644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80" 
            alt="Custom gifts background"
            className="w-full h-full object-cover mix-blend-overlay opacity-50"
          />
        </div>
        
        {/* Content */}
        <div className="relative py-16 px-6 md:px-10 lg:px-16 flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-white mb-4">
            Can't Find Exactly What You're Looking For?
          </h2>
          <p className="text-white/90 max-w-2xl mb-8">
            We specialize in creating personalized gifts tailored precisely to your vision. 
            Share your ideas with us, and our artisans will craft something uniquely special for your loved ones.
          </p>
          <Link to="/custom">
            <Button className="bg-white text-heartfelt-burgundy hover:bg-heartfelt-cream px-8 py-6 text-lg rounded-lg">
              Create a Custom Order
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CustomOrderCta;
