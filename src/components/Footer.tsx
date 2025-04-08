
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-heartfelt-burgundy text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8">
          {/* About section */}
          <div>
            <h3 className="font-serif text-xl font-semibold mb-4">Heartfelt Creations</h3>
            <p className="text-white/80 mb-4">
              Handcrafted gifts made with love, delivering emotions and creating lasting memories.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-white/80 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" className="text-white/80 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" className="text-white/80 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-white/80 hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/best-sellers" className="text-white/80 hover:text-white transition-colors">Best Sellers</Link></li>
              <li><Link to="/new-arrivals" className="text-white/80 hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link to="/custom" className="text-white/80 hover:text-white transition-colors">Custom Orders</Link></li>
              <li><Link to="/about" className="text-white/80 hover:text-white transition-colors">Our Story</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-serif text-lg font-medium mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/categories/chocolates" className="text-white/80 hover:text-white transition-colors">Artisan Chocolates</Link></li>
              <li><Link to="/categories/bouquets" className="text-white/80 hover:text-white transition-colors">Flower Bouquets</Link></li>
              <li><Link to="/categories/embroidery" className="text-white/80 hover:text-white transition-colors">Embroidery Art</Link></li>
              <li><Link to="/categories/memory-books" className="text-white/80 hover:text-white transition-colors">Memory Books</Link></li>
              <li><Link to="/categories/gift-hampers" className="text-white/80 hover:text-white transition-colors">Gift Hampers</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-medium mb-4">Contact Us</h3>
            <div className="space-y-3">
              <p className="flex items-start">
                <Mail size={18} className="mr-2 mt-1" />
                <span className="text-white/80">support@heartfeltcreations.com</span>
              </p>
              <p className="flex items-start">
                <Phone size={18} className="mr-2 mt-1" />
                <span className="text-white/80">+1 (555) 123-4567</span>
              </p>
            </div>
            
            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="font-medium mb-2">Join Our Newsletter</h4>
              <form className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="px-3 py-2 text-sm rounded-l-md bg-white/10 border-white/20 border focus:outline-none focus:border-white/50 flex-grow"
                />
                <button 
                  type="submit"
                  className="bg-white text-heartfelt-burgundy px-3 py-2 text-sm rounded-r-md hover:bg-opacity-90 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="pt-6 border-t border-white/20 text-center text-white/70 text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; 2025 Heartfelt Creations. All rights reserved.</p>
            <div className="flex space-x-4 mt-3 md:mt-0">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/shipping" className="hover:text-white transition-colors">Shipping Info</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
