
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, ShoppingBag, Heart, Menu, X, User, LogOut } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Input } from '@/components/ui/input';
import { useWishlist } from '@/contexts/WishlistContext';
import { cn } from '@/lib/utils';
import NavCategoriesMenu from './NavCategoriesMenu';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { totalItems } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const location = useLocation();
  
  const isActivePath = (path: string) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    if (path !== '/' && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
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

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const name = user.user_metadata?.full_name || user.email || '';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getUserDisplayName = () => {
    if (!user) return 'User';
    return user.user_metadata?.full_name || user.email || 'User';
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
  }, [location.pathname]);

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
              "text-sm lg:text-base font-medium px-3 py-2 rounded-lg transition-all duration-200",
              isActivePath('/') 
                ? "text-heartfelt-burgundy bg-heartfelt-cream/50 shadow-sm font-semibold" 
                : "text-gray-800 hover:text-heartfelt-burgundy hover:bg-heartfelt-cream/30"
            )}
          >
            Home
          </Link>
          <Link 
            to="/shop" 
            className={cn(
              "text-sm lg:text-base font-medium px-3 py-2 rounded-lg transition-all duration-200",
              isActivePath('/shop') 
                ? "text-heartfelt-burgundy bg-heartfelt-cream/50 shadow-sm font-semibold" 
                : "text-gray-800 hover:text-heartfelt-burgundy hover:bg-heartfelt-cream/30"
            )}
          >
            Shop
          </Link>
          <div className={cn(
            "rounded-lg transition-all duration-200",
            (isActivePath('/categories') || isActivePath('/category')) 
              ? "bg-heartfelt-cream/50 shadow-sm" 
              : ""
          )}>
            <NavCategoriesMenu activePath={location.pathname} />
          </div>
          <Link 
            to="/custom" 
            className={cn(
              "text-sm lg:text-base font-medium px-3 py-2 rounded-lg transition-all duration-200",
              isActivePath('/custom') 
                ? "text-heartfelt-burgundy bg-heartfelt-cream/50 shadow-sm font-semibold" 
                : "text-gray-800 hover:text-heartfelt-burgundy hover:bg-heartfelt-cream/30"
            )}
          >
            Custom Orders
          </Link>
          <Link 
            to="/blog" 
            className={cn(
              "text-sm lg:text-base font-medium px-3 py-2 rounded-lg transition-all duration-200",
              isActivePath('/blog') 
                ? "text-heartfelt-burgundy bg-heartfelt-cream/50 shadow-sm font-semibold" 
                : "text-gray-800 hover:text-heartfelt-burgundy hover:bg-heartfelt-cream/30"
            )}
          >
            Blog
          </Link>
          <Link 
            to="/support" 
            className={cn(
              "text-sm lg:text-base font-medium px-3 py-2 rounded-lg transition-all duration-200",
              isActivePath('/support') 
                ? "text-heartfelt-burgundy bg-heartfelt-cream/50 shadow-sm font-semibold" 
                : "text-gray-800 hover:text-heartfelt-burgundy hover:bg-heartfelt-cream/30"
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
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-700 hover:text-heartfelt-burgundy transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-heartfelt-burgundy text-white text-xs">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-heartfelt-burgundy text-white text-xs">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">{getUserDisplayName()}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/account" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Account</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="icon" className="text-gray-700 hover:text-heartfelt-burgundy transition-colors">
                <User size={isMobile ? 18 : 20} />
              </Button>
            </Link>
          )}

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
            
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className={cn(
                  "text-base font-medium py-3 px-4 rounded-lg transition-all duration-200 border-b border-gray-100",
                  isActivePath('/') 
                    ? "text-heartfelt-burgundy bg-heartfelt-cream/50 font-semibold" 
                    : "text-gray-800 hover:text-heartfelt-burgundy hover:bg-heartfelt-cream/30"
                )}
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link 
                to="/shop" 
                className={cn(
                  "text-base font-medium py-3 px-4 rounded-lg transition-all duration-200 border-b border-gray-100",
                  isActivePath('/shop') 
                    ? "text-heartfelt-burgundy bg-heartfelt-cream/50 font-semibold" 
                    : "text-gray-800 hover:text-heartfelt-burgundy hover:bg-heartfelt-cream/30"
                )}
                onClick={toggleMenu}
              >
                Shop
              </Link>
              <Link 
                to="/categories" 
                className={cn(
                  "text-base font-medium py-3 px-4 rounded-lg transition-all duration-200 border-b border-gray-100",
                  (isActivePath('/categories') || isActivePath('/category')) 
                    ? "text-heartfelt-burgundy bg-heartfelt-cream/50 font-semibold" 
                    : "text-gray-800 hover:text-heartfelt-burgundy hover:bg-heartfelt-cream/30"
                )}
                onClick={toggleMenu}
              >
                Categories
              </Link>
              <Link 
                to="/custom" 
                className={cn(
                  "text-base font-medium py-3 px-4 rounded-lg transition-all duration-200 border-b border-gray-100",
                  isActivePath('/custom') 
                    ? "text-heartfelt-burgundy bg-heartfelt-cream/50 font-semibold" 
                    : "text-gray-800 hover:text-heartfelt-burgundy hover:bg-heartfelt-cream/30"
                )}
                onClick={toggleMenu}
              >
                Custom Orders
              </Link>
              <Link 
                to="/blog" 
                className={cn(
                  "text-base font-medium py-3 px-4 rounded-lg transition-all duration-200 border-b border-gray-100",
                  isActivePath('/blog') 
                    ? "text-heartfelt-burgundy bg-heartfelt-cream/50 font-semibold" 
                    : "text-gray-800 hover:text-heartfelt-burgundy hover:bg-heartfelt-cream/30"
                )}
                onClick={toggleMenu}
              >
                Blog
              </Link>
              <Link 
                to="/support" 
                className={cn(
                  "text-base font-medium py-3 px-4 rounded-lg transition-all duration-200 border-b border-gray-100",
                  isActivePath('/support') 
                    ? "text-heartfelt-burgundy bg-heartfelt-cream/50 font-semibold" 
                    : "text-gray-800 hover:text-heartfelt-burgundy hover:bg-heartfelt-cream/30"
                )}
                onClick={toggleMenu}
              >
                Support
              </Link>
              
              {!isAuthenticated && (
                <Link 
                  to="/auth" 
                  className="text-base font-medium py-3 px-4 rounded-lg transition-all duration-200 border-b border-gray-100 text-heartfelt-burgundy hover:bg-heartfelt-cream/30"
                  onClick={toggleMenu}
                >
                  Sign in with Google
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
