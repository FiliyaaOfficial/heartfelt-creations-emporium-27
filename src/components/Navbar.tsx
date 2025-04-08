
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Menu, X, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="font-serif text-2xl font-bold text-heartfelt-burgundy">
              Heartfelt<span className="text-heartfelt-mauve">Creations</span>
            </h1>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-heartfelt-burgundy transition-colors">Home</Link>
            <Link to="/shop" className="text-foreground hover:text-heartfelt-burgundy transition-colors">Shop</Link>
            <Link to="/categories" className="text-foreground hover:text-heartfelt-burgundy transition-colors">Categories</Link>
            <Link to="/custom" className="text-foreground hover:text-heartfelt-burgundy transition-colors">Custom Order</Link>
            <Link to="/about" className="text-foreground hover:text-heartfelt-burgundy transition-colors">About</Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <button aria-label="Search" className="p-1 rounded-full hover:bg-gray-100">
              <Search size={20} />
            </button>
            <button aria-label="Wishlist" className="p-1 rounded-full hover:bg-gray-100">
              <Heart size={20} />
            </button>
            <button aria-label="Cart" className="p-1 rounded-full hover:bg-gray-100 relative">
              <ShoppingBag size={20} />
              <span className="absolute -top-1 -right-1 bg-heartfelt-burgundy text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </button>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-1 rounded-full hover:bg-gray-100"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 md:hidden">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center mb-8">
              <h1 className="font-serif text-2xl font-bold text-heartfelt-burgundy">
                Heartfelt<span className="text-heartfelt-mauve">Creations</span>
              </h1>
              <button onClick={toggleMenu} aria-label="Close menu">
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col space-y-6 text-lg">
              <Link to="/" className="text-foreground hover:text-heartfelt-burgundy transition-colors">Home</Link>
              <Link to="/shop" className="text-foreground hover:text-heartfelt-burgundy transition-colors">Shop</Link>
              <Link to="/categories" className="text-foreground hover:text-heartfelt-burgundy transition-colors">Categories</Link>
              <Link to="/custom" className="text-foreground hover:text-heartfelt-burgundy transition-colors">Custom Order</Link>
              <Link to="/about" className="text-foreground hover:text-heartfelt-burgundy transition-colors">About</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
