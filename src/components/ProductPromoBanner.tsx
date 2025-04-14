
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, IndianRupee } from 'lucide-react';

const ProductPromoBanner = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* First Promo */}
          <div className="rounded-2xl overflow-hidden relative shadow-lg group hover-card">
            <div className="absolute inset-0 bg-gradient-to-r from-heartfelt-burgundy/80 to-heartfelt-pink/50 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1618160472735-0a8f52836bf7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
              alt="Diwali special gifts" 
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end text-white">
              <span className="bg-heartfelt-dark/80 text-white rounded-full px-3 py-1 text-xs inline-block w-fit mb-3">Limited Time Offer</span>
              <h3 className="text-3xl font-serif mb-2">Diwali Special Collection</h3>
              <p className="mb-4 text-white/90">Celebrate the festival of lights with our exclusive handcrafted gifts</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <IndianRupee size={14} />
                  <span className="text-xl font-bold">499</span>
                  <span className="text-sm text-white/70 line-through ml-1"><IndianRupee size={10} /> 799</span>
                </div>
                <span className="text-xs bg-white/20 rounded px-2 py-0.5">-30%</span>
              </div>
              <Link to="/category/diwali">
                <Button className="mt-4 bg-white text-heartfelt-burgundy hover:bg-heartfelt-cream">
                  Shop Now <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Second Promo */}
          <div className="rounded-2xl overflow-hidden relative shadow-lg group hover-card">
            <div className="absolute inset-0 bg-gradient-to-r from-heartfelt-dark/80 to-heartfelt-burgundy/50 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1544159714-bc7aa3a2cd5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
              alt="Handcrafted jewelry" 
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end text-white">
              <span className="bg-heartfelt-burgundy/80 text-white rounded-full px-3 py-1 text-xs inline-block w-fit mb-3">New Arrivals</span>
              <h3 className="text-3xl font-serif mb-2">Handcrafted Jewelry</h3>
              <p className="mb-4 text-white/90">Artisan-made jewelry pieces to complement your traditional outfits</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <IndianRupee size={14} />
                  <span className="text-xl font-bold">799</span>
                  <span className="text-sm text-white/70 line-through ml-1"><IndianRupee size={10} /> 1299</span>
                </div>
                <span className="text-xs bg-white/20 rounded px-2 py-0.5">-40%</span>
              </div>
              <Link to="/category/jewelry">
                <Button className="mt-4 bg-white text-heartfelt-burgundy hover:bg-heartfelt-cream">
                  Explore Collection <ArrowRight size={16} className="ml-2" />
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
