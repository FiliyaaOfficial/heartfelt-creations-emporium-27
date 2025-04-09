
import React from 'react';
import { Mail, Phone, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const NoticeBar = () => {
  return (
    <div className="bg-heartfelt-dark text-white py-2 px-4">
      <div className="container mx-auto flex justify-between items-center text-sm">
        <div className="flex items-center space-x-4">
          <a href="mailto:contact@heartfelt.com" className="flex items-center hover:text-heartfelt-cream transition-colors">
            <Mail size={14} className="mr-1" />
            <span>contact@heartfelt.com</span>
          </a>
          <a href="tel:+1234567890" className="hidden md:flex items-center hover:text-heartfelt-cream transition-colors">
            <Phone size={14} className="mr-1" />
            <span>+1 (234) 567-890</span>
          </a>
        </div>
        
        <div className="flex items-center space-x-3">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-heartfelt-cream transition-colors">
            <Facebook size={16} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-heartfelt-cream transition-colors">
            <Instagram size={16} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-heartfelt-cream transition-colors">
            <Twitter size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default NoticeBar;
