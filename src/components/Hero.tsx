
import React from 'react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-r from-heartfelt-cream to-heartfelt-pink py-16 md:py-24">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0 md:pr-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-heartfelt-burgundy leading-tight mb-4">
            Handcrafted Gifts from the Heart
          </h1>
          <p className="text-lg text-gray-700 mb-6 md:mb-8 max-w-lg">
            Discover unique handmade treasures that capture emotions and create lasting memories. From artisanal chocolates to personalized keepsakes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-heartfelt-burgundy hover:bg-opacity-90 text-white px-8 py-6 rounded-lg text-lg">
              Shop Collection
            </Button>
            <Button variant="outline" className="border-heartfelt-burgundy text-heartfelt-burgundy hover:bg-heartfelt-burgundy hover:text-white px-8 py-6 rounded-lg text-lg">
              Custom Order
            </Button>
          </div>
        </div>
        <div className="md:w-1/2 grid grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="rounded-2xl overflow-hidden shadow-lg transform md:translate-y-8">
            <img 
              src="https://images.unsplash.com/photo-1549007994-cb92caebd54b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Handmade chocolates" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1573830101453-81de3befb9c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Beautiful flower bouquet" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1544967082-d9d25d867d66?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Memory book" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg transform md:translate-y-8">
            <img 
              src="https://images.unsplash.com/photo-1606566739835-31c78d4422bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Embroidery design" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default Hero;
