
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone } from 'lucide-react';
import Newsletter from './Newsletter';

const Footer = () => {
  return (
    <footer className="bg-heartfelt-burgundy text-white">
      <Newsletter variant="footer" className="container mx-auto px-4 py-8 border-b border-white/10" />
      
      <div className="container mx-auto px-4 pt-8 md:pt-12 pb-6">
        {/* Top section */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12 mb-8">
          {/* About section */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <h3 className="font-serif text-lg md:text-xl font-semibold mb-3 md:mb-4">Filiyaa</h3>
            <p className="text-white/80 mb-4 text-sm md:text-base leading-relaxed">
              Handcrafted gifts made with love, delivering emotions and creating lasting memories.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="https://instagram.com" className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://twitter.com" className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full" aria-label="Twitter">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-base md:text-lg font-medium mb-3 md:mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-white/80 hover:text-white transition-colors text-sm md:text-base">All Products</Link></li>
              <li><Link to="/shop?filter=bestseller" className="text-white/80 hover:text-white transition-colors text-sm md:text-base">Best Sellers</Link></li>
              <li><Link to="/shop?filter=new" className="text-white/80 hover:text-white transition-colors text-sm md:text-base">New Arrivals</Link></li>
              <li><Link to="/custom" className="text-white/80 hover:text-white transition-colors text-sm md:text-base">Custom Orders</Link></li>
              <li><Link to="/blog" className="text-white/80 hover:text-white transition-colors text-sm md:text-base">Our Blog</Link></li>
              <li><Link to="/support" className="text-white/80 hover:text-white transition-colors text-sm md:text-base">Our Story</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-serif text-base md:text-lg font-medium mb-3 md:mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/category/Artisan%20Chocolates" className="text-white/80 hover:text-white transition-colors text-sm md:text-base">Artisan Chocolates</Link></li>
              <li><Link to="/category/Flower%20Bouquets" className="text-white/80 hover:text-white transition-colors text-sm md:text-base">Flower Bouquets</Link></li>
              <li><Link to="/category/Embroidery%20Art" className="text-white/80 hover:text-white transition-colors text-sm md:text-base">Embroidery Art</Link></li>
              <li><Link to="/category/Memory%20Books" className="text-white/80 hover:text-white transition-colors text-sm md:text-base">Memory Books</Link></li>
              <li><Link to="/category/Gift%20Hampers" className="text-white/80 hover:text-white transition-colors text-sm md:text-base">Gift Hampers</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <h3 className="font-serif text-base md:text-lg font-medium mb-3 md:mb-4">Contact Us</h3>
            <div className="space-y-3">
              <p className="flex items-start">
                <Mail size={16} className="mr-3 mt-1 flex-shrink-0" />
                <span className="text-white/80 text-sm md:text-base break-all">support@filiyaa.com</span>
              </p>
              <p className="flex items-start">
                <Phone size={16} className="mr-3 mt-1 flex-shrink-0" />
                <span className="text-white/80 text-sm md:text-base">+1 (555) 123-4567</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="pt-6 border-t border-white/20 text-center text-white/70 text-xs md:text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <p>&copy; 2025 Filiyaa. All rights reserved.</p>
            <div className="flex flex-wrap justify-center md:justify-end space-x-4 gap-y-2">
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
