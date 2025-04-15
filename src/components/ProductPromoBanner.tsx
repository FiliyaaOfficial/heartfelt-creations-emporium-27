
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, IndianRupee, Sparkles, Gift } from 'lucide-react';

const ProductPromoBanner = () => {
  return (
    <section className="py-12 md:py-16 px-4">
      <div className="container mx-auto">
        {/* Heading */}
        <div className="flex flex-col items-center justify-center mb-10 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-heartfelt-cream/30 rounded-full mb-4">
            <Sparkles className="h-5 w-5 text-heartfelt-burgundy" />
          </div>
          <h2 className="section-title">Special Offers</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Limited time deals on our most popular handcrafted items
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* First Promo */}
          <div className="rounded-2xl overflow-hidden relative shadow-lg group hover-card h-[380px] md:h-[420px]">
            <div className="absolute inset-0 bg-gradient-to-r from-heartfelt-burgundy/90 to-heartfelt-burgundy/70 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1618160472735-0a8f52836bf7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
              alt="Diwali special gifts" 
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-0 right-0 m-4 z-30">
              <div className="bg-white/95 text-heartfelt-burgundy font-bold rounded-full flex items-center justify-center w-16 h-16 shadow-lg">
                <div className="text-center leading-tight">
                  <span className="block text-xs">SAVE</span>
                  <span className="text-lg">30%</span>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 z-20 p-6 md:p-8 flex flex-col justify-end text-white">
              <div className="bg-white/20 backdrop-blur-sm w-fit px-3 py-1 rounded-full text-xs font-medium mb-3 border border-white/30">
                Limited Time Offer
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-serif mb-2">Diwali Special Collection</h3>
                <p className="mb-3 text-white/90 text-sm md:text-base">Celebrate the festival of lights with our exclusive handcrafted gifts</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                    <IndianRupee size={14} />
                    <span className="text-xl font-bold">499</span>
                    <span className="text-sm text-white/70 line-through ml-1"><IndianRupee size={10} /> 799</span>
                  </div>
                </div>
              </div>
              <Link to="/category/diwali" className="mt-4 inline-block">
                <Button className="bg-white text-heartfelt-burgundy hover:bg-heartfelt-cream group relative overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    Shop Now 
                    <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Second Promo */}
          <div className="rounded-2xl overflow-hidden relative shadow-lg group hover-card h-[380px] md:h-[420px]">
            <div className="absolute inset-0 bg-gradient-to-r from-heartfelt-dark/90 to-heartfelt-dark/70 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1544159714-bc7aa3a2cd5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
              alt="Handcrafted jewelry" 
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-0 right-0 m-4 z-30">
              <div className="bg-white/95 text-heartfelt-burgundy font-bold rounded-full flex items-center justify-center w-16 h-16 shadow-lg">
                <div className="text-center leading-tight">
                  <span className="block text-xs">SAVE</span>
                  <span className="text-lg">40%</span>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 z-20 p-6 md:p-8 flex flex-col justify-end text-white">
              <div className="bg-white/20 backdrop-blur-sm w-fit px-3 py-1 rounded-full text-xs font-medium mb-3 border border-white/30">
                New Arrivals
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-serif mb-2">Handcrafted Jewelry</h3>
                <p className="mb-3 text-white/90 text-sm md:text-base">Artisan-made jewelry pieces to complement your traditional outfits</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                    <IndianRupee size={14} />
                    <span className="text-xl font-bold">799</span>
                    <span className="text-sm text-white/70 line-through ml-1"><IndianRupee size={10} /> 1299</span>
                  </div>
                </div>
              </div>
              <Link to="/category/jewelry" className="mt-4 inline-block">
                <Button className="bg-white text-heartfelt-burgundy hover:bg-heartfelt-cream group relative overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    Explore Collection 
                    <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPromoBanner;
