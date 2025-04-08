
import React from 'react';
import { Star } from 'lucide-react';

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
      <StarRating rating={rating} />
      <p className="my-4 text-gray-700">{text}</p>
      <div className="mt-auto pt-4 flex items-center">
        <img 
          src={image} 
          alt={name} 
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{location}</p>
          <p className="text-xs text-heartfelt-mauve mt-1">{productBought}</p>
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
      productBought: 'Purchased: Artisanal Chocolate Gift Box'
    },
    {
      name: 'Michael Smith',
      location: 'Chicago, IL',
      text: 'I ordered a custom embroidery piece for my wife\'s birthday and it exceeded all expectations. The attention to detail was remarkable and my wife absolutely loved it.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      productBought: 'Purchased: Custom Family Portrait Embroidery'
    },
    {
      name: 'Sophia Garcia',
      location: 'Austin, TX',
      text: 'The anniversary memory book I ordered was such a special gift. The quality was exceptional and I appreciate how they incorporated all the photos and memories I sent.',
      rating: 4,
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      productBought: 'Purchased: Personalized Anniversary Memory Book'
    },
    {
      name: 'James Wilson',
      location: 'Denver, CO',
      text: 'The flower bouquet was absolutely gorgeous and stayed fresh for over a week! The arrangement looked even better than the pictures online. Will definitely order again.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      productBought: 'Purchased: Spring Bliss Flower Bouquet'
    },
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center">What Our Customers Say</h2>
        <p className="section-subtitle text-center">
          Real experiences from people who have shared our handcrafted creations.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
