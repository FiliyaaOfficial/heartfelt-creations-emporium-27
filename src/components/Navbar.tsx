import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, Menu, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-serif text-2xl font-bold text-heartfelt-burgundy">
          Heartfelt Creations
        </Link>
        
        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/products" className="text-gray-700 hover:text-heartfelt-burgundy transition-colors">
            All Products
          </Link>
          <Link to="/best-sellers" className="text-gray-700 hover:text-heartfelt-burgundy transition-colors">
            Best Sellers
          </Link>
          <Link to="/new-arrivals" className="text-gray-700 hover:text-heartfelt-burgundy transition-colors">
            New Arrivals
          </Link>
          <Link to="/custom" className="text-gray-700 hover:text-heartfelt-burgundy transition-colors">
            Custom Orders
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-heartfelt-burgundy transition-colors">
            Our Story
          </Link>
        </nav>
        
        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <Link to="/search" className="p-2 text-gray-700 hover:text-heartfelt-burgundy transition-colors">
            <Search size={20} />
          </Link>
          
          {/* Wishlist */}
          <Link to="/wishlist" className="p-2 text-gray-700 hover:text-heartfelt-burgundy transition-colors">
            <Heart size={20} />
          </Link>
          
          {/* Cart */}
          <Link to="/cart" className="p-2 text-gray-700 hover:text-heartfelt-burgundy transition-colors relative">
            <ShoppingCart size={20} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-filiyaa-peach-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartItemCount}
              </span>
            )}
          </Link>
          
          {/* Account */}
          <Link to="/account" className="p-2 text-gray-700 hover:text-heartfelt-burgundy transition-colors">
            <User size={20} />
          </Link>
          
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-heartfelt-burgundy transition-colors"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden py-4 px-4 bg-gray-50 border-t">
          <nav className="flex flex-col space-y-4">
            <Link to="/products" className="text-gray-700 hover:text-heartfelt-burgundy transition-colors">
              All Products
            </Link>
            <Link to="/best-sellers" className="text-gray-700 hover:text-heartfelt-burgundy transition-colors">
              Best Sellers
            </Link>
            <Link to="/new-arrivals" className="text-gray-700 hover:text-heartfelt-burgundy transition-colors">
              New Arrivals
            </Link>
            <Link to="/custom" className="text-gray-700 hover:text-heartfelt-burgundy transition-colors">
              Custom Orders
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-heartfelt-burgundy transition-colors">
              Our Story
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
