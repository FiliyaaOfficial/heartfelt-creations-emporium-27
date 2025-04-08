
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, ShoppingBag, Heart, Menu, X, User } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Input } from '@/components/ui/input';
import { useWishlist } from '@/contexts/WishlistContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-filiyaa-peach-100">
      <div className="container mx-auto px-4 flex justify-between items-center h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-filiyaa-peach-600">Filiyaa</h1>
        </Link>

        {/* Search Bar - Desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Search products..."
              className="pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              variant="ghost" 
              className="absolute right-0 top-0 h-full px-3"
              aria-label="Search"
            >
              <Search size={18} />
            </Button>
          </div>
        </form>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-800 hover:text-filiyaa-peach-500 transition-colors">
            Home
          </Link>
          <Link to="/categories" className="text-gray-800 hover:text-filiyaa-peach-500 transition-colors">
            Shop
          </Link>
          <Link to="/custom" className="text-gray-800 hover:text-filiyaa-peach-500 transition-colors">
            Custom Orders
          </Link>
          <Link to="/support" className="text-gray-800 hover:text-filiyaa-peach-500 transition-colors">
            Support
          </Link>
        </nav>

        {/* Right-side icons */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/search')}
            className="md:hidden text-gray-700 hover:text-filiyaa-peach-500 transition-colors p-1" 
            aria-label="Search"
          >
            <Search size={20} />
          </button>
          <Link to="/wishlist" className="text-gray-700 hover:text-filiyaa-peach-500 transition-colors p-1 relative">
            <Heart size={20} />
            {wishlistItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-filiyaa-peach-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {wishlistItems > 9 ? '9+' : wishlistItems}
              </span>
            )}
          </Link>
          <Link to="/cart" className="text-gray-700 hover:text-filiyaa-peach-500 transition-colors p-1 relative">
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-filiyaa-peach-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Link>
          <Link to="/account">
            <Button variant="ghost" size="icon" className="text-gray-700 hover:text-filiyaa-peach-500 transition-colors">
              <User size={20} />
            </Button>
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700 hover:text-filiyaa-peach-500 transition-colors p-1"
            onClick={toggleMenu}
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-filiyaa-peach-100">
          <div className="container mx-auto px-4 py-4">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative w-full">
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  type="submit" 
                  variant="ghost" 
                  className="absolute right-0 top-0 h-full px-3"
                  aria-label="Search"
                >
                  <Search size={18} />
                </Button>
              </div>
            </form>
            
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-800 hover:text-filiyaa-peach-500 py-2 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/categories" className="text-gray-800 hover:text-filiyaa-peach-500 py-2 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Shop
              </Link>
              <Link to="/custom" className="text-gray-800 hover:text-filiyaa-peach-500 py-2 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Custom Orders
              </Link>
              <Link to="/support" className="text-gray-800 hover:text-filiyaa-peach-500 py-2 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Support
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
