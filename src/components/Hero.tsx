
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronRight, ShoppingBag, Gift } from 'lucide-react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { useEffect, useState, useRef } from 'react';

const heroSlides = [
  {
    title: "Handcrafted Gifts for Every Occasion",
    subtitle: "Discover unique Indian artisan crafts that convey emotions words cannot express. Created with love, delivered across India.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    primaryLink: "/categories",
    primaryText: "Shop Now",
    secondaryLink: "/custom",
    secondaryText: "Custom Orders"
  },
  {
    title: "Personalized Gift Collections",
    subtitle: "Find the perfect gift that tells your unique story. Each piece selected with intention and meaning.",
    image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    primaryLink: "/categories/personalized",
    primaryText: "Browse Collection",
    secondaryLink: "/custom",
    secondaryText: "Custom Designs"
  },
  {
    title: "Special Occasions Made Memorable",
    subtitle: "Celebrate life's precious moments with gifts that leave lasting impressions.",
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    primaryLink: "/categories/occasions",
    primaryText: "Explore Gifts",
    secondaryLink: "/categories",
    secondaryText: "View All"
  }
];

const Hero = () => {
  const [api, setApi] = useState<any>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!api) return;
    
    // Auto advance every 10 seconds
    intervalRef.current = window.setInterval(() => {
      api.scrollNext();
    }, 10000);
    
    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [api]);

  return (
    <section className="relative bg-gradient-to-b from-heartfelt-cream to-white overflow-hidden">
      <Carousel className="w-full px-6" opts={{ loop: true }} setApi={setApi}>
        <CarouselContent>
          {heroSlides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="container mx-auto py-16 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  {/* Content */}
                  <div className="order-2 md:order-1 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 text-heartfelt-dark">
                      <span className="text-heartfelt-burgundy">{slide.title.split(' ')[0]}</span> {slide.title.split(' ').slice(1).join(' ')}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg mx-auto md:mx-0">
                      {slide.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                      <Link to={slide.primaryLink}>
                        <Button className="bg-heartfelt-burgundy hover:bg-heartfelt-dark text-white px-8 py-6 text-lg rounded-full">
                          <ShoppingBag className="mr-2" size={20} />
                          {slide.primaryText}
                        </Button>
                      </Link>
                      <Link to={slide.secondaryLink}>
                        <Button variant="outline" className="border-heartfelt-burgundy text-heartfelt-burgundy hover:bg-heartfelt-cream/50 px-8 py-6 text-lg rounded-full">
                          <Gift className="mr-2" size={20} />
                          {slide.secondaryText}
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  {/* Image */}
                  <div className="order-1 md:order-2 relative">
                    <div className="aspect-square rounded-full overflow-hidden bg-heartfelt-cream border-8 border-white shadow-lg mx-auto max-w-md">
                      <img 
                        src={slide.image}
                        alt="Beautifully wrapped gifts"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="absolute -top-4 -left-4 w-20 h-20 bg-heartfelt-pink/30 rounded-full animate-pulse"></div>
                    <div className="absolute top-1/2 -right-8 w-16 h-16 bg-heartfelt-cream rounded-full"></div>
                    <div className="absolute -bottom-4 left-1/4 w-12 h-12 bg-heartfelt-burgundy/20 rounded-full"></div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <div className="absolute z-10 left-4 right-4 top-1/2 -translate-y-1/2 flex justify-between">
          <CarouselPrevious className="relative h-10 w-10 rounded-full bg-white/80 hover:bg-white border border-heartfelt-cream -translate-y-1/2 -left-0" />
          <CarouselNext className="relative h-10 w-10 rounded-full bg-white/80 hover:bg-white border border-heartfelt-cream -translate-y-1/2 -right-0" />
        </div>
      </Carousel>
      
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
