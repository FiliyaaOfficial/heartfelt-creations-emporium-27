
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-filiyaa-peach-50 to-white">
      <div className="container mx-auto px-4 py-10 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="order-2 md:order-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 text-filiyaa-peach-800">
              <span className="text-filiyaa-peach-600">Heartfelt</span> Gifts for Every Occasion
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg mx-auto md:mx-0">
              Discover unique handcrafted gifts that convey emotions words cannot express.
              Created with love, delivered with care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/categories">
                <Button className="bg-filiyaa-peach-500 hover:bg-filiyaa-peach-600 text-white px-8 py-6 text-lg rounded-full">
                  Shop Now
                </Button>
              </Link>
              <Link to="/custom">
                <Button variant="outline" className="border-filiyaa-peach-500 text-filiyaa-peach-500 hover:bg-filiyaa-peach-50 px-8 py-6 text-lg rounded-full">
                  Custom Orders
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Image */}
          <div className="order-1 md:order-2 relative">
            <div className="aspect-square rounded-full overflow-hidden bg-filiyaa-peach-100 border-8 border-white shadow-lg mx-auto max-w-md">
              <img 
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Beautifully wrapped gifts"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-filiyaa-pink-200 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute top-1/2 -right-8 w-16 h-16 bg-filiyaa-cream-300 rounded-full opacity-70"></div>
            <div className="absolute -bottom-4 left-1/4 w-12 h-12 bg-filiyaa-peach-300 rounded-full opacity-80"></div>
          </div>
        </div>
      </div>
      
      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" fill="white">
          <path d="M0,96L60,85.3C120,75,240,53,360,58.7C480,64,600,96,720,96C840,96,960,64,1080,53.3C1200,43,1320,53,1380,58.7L1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
