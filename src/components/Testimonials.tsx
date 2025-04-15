
import React from 'react';
import { Star } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface TestimonialProps {
  name: string;
  location: string;
  text: string;
  rating: number;
  image: string;
  productBought: string;
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star 
          key={star}
          className={star <= rating ? "text-heartfelt-gold fill-heartfelt-gold" : "text-gray-300"}
          size={16}
        />
      ))}
    </div>
  );
};

const Testimonial = ({ name, location, text, rating, image, productBought }: TestimonialProps) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="mb-3 flex items-center justify-between">
        <StarRating rating={rating} />
        <span className="text-xs text-heartfelt-burgundy font-semibold bg-heartfelt-burgundy/10 px-2 py-1 rounded-full">
          {productBought.replace('Purchased: ', '')}
        </span>
      </div>
      <p className="my-4 text-gray-700 italic">&ldquo;{text}&rdquo;</p>
      <div className="mt-auto pt-4 flex items-center">
        <img 
          src={image} 
          alt={name} 
          className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-heartfelt-cream"
        />
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{location}</p>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Emma Johnson',
      location: 'New York, NY',
      text: 'The chocolate gift box I ordered for my mom was absolutely stunning. The presentation was beautiful and the chocolates were delicious. My mom couldn\'t stop raving about them!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      productBought: 'Artisanal Chocolate Gift Box'
    },
    {
      name: 'Michael Smith',
      location: 'Chicago, IL',
      text: 'I ordered a custom embroidery piece for my wife\'s birthday and it exceeded all expectations. The attention to detail was remarkable and my wife absolutely loved it.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      productBought: 'Custom Family Portrait Embroidery'
    },
    {
      name: 'Sophia Garcia',
      location: 'Austin, TX',
      text: 'The anniversary memory book I ordered was such a special gift. The quality was exceptional and I appreciate how they incorporated all the photos and memories I sent.',
      rating: 4,
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      productBought: 'Personalized Anniversary Memory Book'
    },
    {
      name: 'James Wilson',
      location: 'Denver, CO',
      text: 'The flower bouquet was absolutely gorgeous and stayed fresh for over a week! The arrangement looked even better than the pictures online. Will definitely order again.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      productBought: 'Spring Bliss Flower Bouquet'
    },
  ];

  return (
    <section className="bg-gradient-to-b from-white to-heartfelt-cream/20 py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12">
          <div className="inline-flex mb-3 px-4 py-1 rounded-full bg-heartfelt-burgundy/10 text-heartfelt-burgundy text-sm font-medium">
            Customer Stories
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-3 text-center">What Our Customers Say</h2>
          <p className="text-muted-foreground text-center max-w-lg">
            Real experiences from people who have shared our handcrafted creations with their loved ones.
          </p>
        </div>
        
        <div className="relative px-4 md:px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4 pr-4">
                  <div className="h-full">
                    <Testimonial {...testimonial} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="-left-4 bg-white border-heartfelt-burgundy text-heartfelt-burgundy hover:bg-heartfelt-cream" />
              <CarouselNext className="-right-4 bg-white border-heartfelt-burgundy text-heartfelt-burgundy hover:bg-heartfelt-cream" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
