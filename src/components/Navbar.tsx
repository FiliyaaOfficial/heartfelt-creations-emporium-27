
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, ShoppingBag, Heart, Menu, X, User } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Input } from '@/components/ui/input';
import { useWishlist } from '@/contexts/WishlistContext';
import { cn } from '@/lib/utils';
import NavCategoriesMenu from './NavCategoriesMenu';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { totalItems } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const location = useLocation();
  
  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchContainer = document.getElementById('search-container');
      if (isSearchOpen && searchContainer && !searchContainer.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  // Close the mobile menu when navigating to a different route
  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [navigate]);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-heartfelt-cream">
      <div className="container mx-auto px-4 flex justify-between items-center h-16 md:h-20">
        <Link to="/" className="flex items-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-heartfelt-burgundy transition-all">Filiyaa</h1>
        </Link>

        <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
          <Link 
            to="/" 
            className={cn(
              "text-sm lg:text-base text-gray-800 hover:text-heartfelt-burgundy transition-colors font-medium px-2 py-1",
              isActivePath('/') && !isActivePath('/shop') && !isActivePath('/blog') && !isActivePath('/custom') && !isActivePath('/support') 
                ? "text-heartfelt-burgundy font-semibold" 
                : ""
            )}
          >
            Home
          </Link>
          <Link 
            to="/shop" 
            className={cn(
              "text-sm lg:text-base text-gray-800 hover:text-heartfelt-burgundy transition-colors font-medium px-2 py-1",
              isActivePath('/shop') ? "text-heartfelt-burgundy font-semibold" : ""
            )}
          >
            Shop
          </Link>
          <NavCategoriesMenu activePath={location.pathname} />
          <Link 
            to="/custom" 
            className={cn(
              "text-sm lg:text-base text-gray-800 hover:text-heartfelt-burgundy transition-colors font-medium px-2 py-1",
              isActivePath('/custom') ? "text-heartfelt-burgundy font-semibold" : ""
            )}
          >
            Custom Orders
          </Link>
          <Link 
            to="/blog" 
            className={cn(
              "text-sm lg:text-base text-gray-800 hover:text-heartfelt-burgundy transition-colors font-medium px-2 py-1",
              isActivePath('/blog') ? "text-heartfelt-burgundy font-semibold" : ""
            )}
          >
            Blog
          </Link>
          <Link 
            to="/support" 
            className={cn(
              "text-sm lg:text-base text-gray-800 hover:text-heartfelt-burgundy transition-colors font-medium px-2 py-1",
              isActivePath('/support') ? "text-heartfelt-burgundy font-semibold" : ""
            )}
          >
            Support
          </Link>
        </nav>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <div id="search-container" className="relative flex items-center">
            <button 
              onClick={toggleSearch}
              className="text-gray-700 hover:text-heartfelt-burgundy transition-colors p-1" 
              aria-label="Search"
            >
              <Search size={isMobile ? 18 : 20} className={cn(isSearchOpen ? "text-heartfelt-burgundy" : "")} />
            </button>
            
            <form 
              onSubmit={handleSearch} 
              className={cn(
                "absolute right-0 top-full mt-2 transition-all duration-300 bg-white shadow-md rounded-md",
                isSearchOpen ? "opacity-100 visible w-[200px] sm:w-[250px] md:w-[300px]" : "opacity-0 invisible w-0"
              )}
            >
              <div className="flex items-center p-2">
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus={isSearchOpen}
                />
                <Button 
                  type="submit" 
                  variant="ghost" 
                  size="icon"
                  className="ml-1"
                  aria-label="Submit search"
                >
                  <Search size={16} />
                </Button>
              </div>
            </form>
          </div>
          
          <Link to="/wishlist" className="text-gray-700 hover:text-heartfelt-burgundy transition-colors p-1 relative group">
            <Heart size={isMobile ? 18 : 20} className="group-hover:scale-110 transition-transform duration-200" />
            {wishlistItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-heartfelt-pink text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-scale-in">
                {wishlistItems > 9 ? '9+' : wishlistItems}
              </span>
            )}
          </Link>
          
          <Link to="/cart" className="text-gray-700 hover:text-heartfelt-burgundy transition-colors p-1 relative group">
            <ShoppingBag size={isMobile ? 18 : 20} className="group-hover:scale-110 transition-transform duration-200" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-heartfelt-burgundy text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-scale-in">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Link>
          
          <Link to="/account">
            <Button variant="ghost" size="icon" className="text-gray-700 hover:text-heartfelt-burgundy transition-colors">
              <User size={isMobile ? 18 : 20} />
            </Button>
          </Link>

          <button
            className="md:hidden text-gray-700 hover:text-heartfelt-burgundy transition-colors p-1"
            onClick={toggleMenu}
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-heartfelt-cream">
          <div className="container mx-auto px-4 py-4">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative w-full">
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pr-10 text-sm"
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
              <Link 
                to="/" 
                className={cn(
                  "text-base font-medium text-gray-800 hover:text-heartfelt-burgundy py-2 transition-colors border-b border-gray-100",
                  isActivePath('/') && !isActivePath('/shop') && !isActivePath('/blog') && !isActivePath('/custom') && !isActivePath('/support')
                    ? "text-heartfelt-burgundy font-semibold" 
                    : ""
                )}
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link 
                to="/shop" 
                className={cn(
                  "text-base font-medium text-gray-800 hover:text-heartfelt-burgundy py-2 transition-colors border-b border-gray-100",
                  isActivePath('/shop') ? "text-heartfelt-burgundy font-semibold" : ""
                )}
                onClick={toggleMenu}
              >
                Shop
              </Link>
              <Link 
                to="/categories" 
                className={cn(
                  "text-base font-medium text-gray-800 hover:text-heartfelt-burgundy py-2 transition-colors border-b border-gray-100",
                  isActivePath('/categories') || isActivePath('/category') ? "text-heartfelt-burgundy font-semibold" : ""
                )}
                onClick={toggleMenu}
              >
                Categories
              </Link>
              <Link 
                to="/custom" 
                className={cn(
                  "text-base font-medium text-gray-800 hover:text-heartfelt-burgundy py-2 transition-colors border-b border-gray-100",
                  isActivePath('/custom') ? "text-heartfelt-burgundy font-semibold" : ""
                )}
                onClick={toggleMenu}
              >
                Custom Orders
              </Link>
              <Link 
                to="/blog" 
                className={cn(
                  "text-base font-medium text-gray-800 hover:text-heartfelt-burgundy py-2 transition-colors border-b border-gray-100",
                  isActivePath('/blog') ? "text-heartfelt-burgundy font-semibold" : ""
                )}
                onClick={toggleMenu}
              >
                Blog
              </Link>
              <Link 
                to="/support" 
                className={cn(
                  "text-base font-medium text-gray-800 hover:text-heartfelt-burgundy py-2 transition-colors border-b border-gray-100",
                  isActivePath('/support') ? "text-heartfelt-burgundy font-semibold" : ""
                )}
                onClick={toggleMenu}
              >
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
