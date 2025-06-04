
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, User } from 'lucide-react';

interface CheckoutProtectionProps {
  children: React.ReactNode;
}

const CheckoutProtection: React.FC<CheckoutProtectionProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="container mx-auto py-20 px-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-heartfelt-burgundy"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-20 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <ShieldCheck className="mx-auto h-12 w-12 text-heartfelt-burgundy mb-4" />
              <CardTitle>Login Required</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Please sign in to your account to proceed with checkout and place orders securely.
              </p>
              <Button 
                className="w-full bg-heartfelt-burgundy hover:bg-heartfelt-dark"
                onClick={() => window.location.href = '/auth'}
              >
                <User className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default CheckoutProtection;
