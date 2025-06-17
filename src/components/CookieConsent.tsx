
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Cookie } from 'lucide-react';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="mx-auto max-w-4xl bg-white border-t-4 border-heartfelt-burgundy shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Cookie className="h-6 w-6 text-heartfelt-burgundy mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">We use cookies</h3>
              <p className="text-sm text-gray-600 mb-4">
                We use cookies to enhance your browsing experience, serve personalized content, 
                and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={acceptCookies}
                  className="bg-heartfelt-burgundy hover:bg-heartfelt-dark"
                >
                  Accept All
                </Button>
                <Button 
                  onClick={declineCookies}
                  variant="outline"
                >
                  Decline
                </Button>
              </div>
            </div>
            <Button
              onClick={declineCookies}
              variant="ghost"
              size="sm"
              className="p-1 h-auto"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieConsent;
