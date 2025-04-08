
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <div className="text-center max-w-md">
        <div className="bg-filiyaa-peach-100 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="text-6xl font-serif font-bold text-filiyaa-peach-600">404</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="bg-filiyaa-peach-500 hover:bg-filiyaa-peach-600 w-full">
              <Home size={18} className="mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link to="/support">
            <Button variant="outline" className="border-filiyaa-peach-500 text-filiyaa-peach-600 hover:bg-filiyaa-peach-50 w-full">
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
