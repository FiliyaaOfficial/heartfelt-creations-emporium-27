
import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Gift } from 'lucide-react';
import GoogleIcon from '@/components/icons/GoogleIcon';

const Auth = () => {
  const { isAuthenticated, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign in failed:', error);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container mx-auto py-20 px-4">
      <div className="max-w-md mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-heartfelt-burgundy mb-4">
            <Gift size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-heartfelt-burgundy mb-2">Welcome to Filiyaa</h1>
          <p className="text-gray-600">Sign in with Google to start shopping for heartfelt gifts</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Sign in to continue</CardTitle>
            <CardDescription>
              Please sign in with your Google account to place orders and access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleGoogleSignIn}
              className="w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 py-6 text-lg"
              size="lg"
            >
              <GoogleIcon />
              <span className="ml-3">Continue with Google</span>
            </Button>
            
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
