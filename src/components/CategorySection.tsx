
import React from 'react';
import { Gift, Coffee, Heart, Book, Camera, Flower } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CategoryProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  bgColor: string;
}

const Category = ({ icon, title, description, link, bgColor }: CategoryProps) => {
  return (
    <Link 
      to={link}
      className={`${bgColor} rounded-2xl p-6 text-center transition-transform hover:-translate-y-1 hover:shadow-lg flex flex-col items-center`}
    >
      <div className="mb-4 text-heartfelt-burgundy">{icon}</div>
      <h3 className="text-xl font-serif font-medium mb-2">{title}</h3>
      <p className="text-gray-700 text-sm">{description}</p>
    </Link>
  );
};

const CategorySection = () => {
  const categories = [
    {
      icon: <Coffee size={32} />,
      title: "Artisan Chocolates",
      description: "Handcrafted delights for chocolate lovers",
      link: "/category/chocolates",
      bgColor: "bg-heartfelt-cream",
    },
    {
      icon: <Flower size={32} />,
      title: "Flower Bouquets",
      description: "Beautiful blooms to express feelings",
      link: "/category/bouquets",
      bgColor: "bg-heartfelt-pink/40",
    },
    {
      icon: <Heart size={32} />,
      title: "Embroidery Art",
      description: "Personalized stitched creations",
      link: "/category/embroidery",
      bgColor: "bg-heartfelt-cream",
    },
    {
      icon: <Book size={32} />,
      title: "Memory Books",
      description: "Preserve precious memories forever",
      link: "/category/memory-books",
      bgColor: "bg-heartfelt-pink/40",
    },
    {
      icon: <Gift size={32} />,
      title: "Gift Hampers",
      description: "Curated collections of heartfelt gifts",
      link: "/category/gift-hampers",
      bgColor: "bg-heartfelt-cream",
    },
    {
      icon: <Camera size={32} />,
      title: "Custom Orders",
      description: "Create something uniquely yours",
      link: "/custom",
      bgColor: "bg-heartfelt-pink/40",
    },
  ];

  return (
    <section className="container-custom">
      <h2 className="section-title text-center">Shop by Category</h2>
      <p className="section-subtitle text-center">
        Explore our handcrafted collections, each made with love and attention to detail.
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        {categories.map((category, index) => (
          <Category 
            key={index}
            icon={category.icon}
            title={category.title}
            description={category.description}
            link={category.link}
            bgColor={category.bgColor}
          />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
