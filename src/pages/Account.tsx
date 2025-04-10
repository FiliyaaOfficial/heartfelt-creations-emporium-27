
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { 
  User, 
  Package, 
  Heart, 
  LogOut, 
  Settings, 
  CreditCard, 
  Key, 
  Bell, 
  Shield, 
  Calendar,
  Bookmark,
  Map
} from "lucide-react";
import { Link } from "react-router-dom";

const Account = () => {
  const { toast } = useToast();
  // Mock data - in a real app, this would come from your authentication system
  const [user] = useState({
    name: "Guest User",
    email: "guest@example.com",
    isLoggedIn: false,
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Login successful",
      description: "Welcome back to Heartfelt!",
    });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Account created",
      description: "Welcome to Heartfelt!",
    });
  };

  if (!user.isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-heartfelt-cream/30 rounded-2xl -z-10"></div>
          <div className="py-10 px-6 text-center">
            <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-2">My Account</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Sign in to your account or create a new one to manage your orders, wishlist, and more.
            </p>
          </div>
        </div>
        
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input 
                      id="login-email" 
                      type="email" 
                      placeholder="your@email.com"
                      className="mt-1" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <Input 
                      id="login-password" 
                      type="password" 
                      className="mt-1"
                      placeholder="••••••••" 
                      required 
                    />
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <Button type="button" variant="link" className="px-0 text-heartfelt-burgundy">
                      Forgot password?
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-heartfelt-burgundy hover:bg-heartfelt-dark"
                    >
                      <User size={18} className="mr-2" />
                      Login
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input 
                      id="signup-name" 
                      type="text" 
                      placeholder="John Doe"
                      className="mt-1" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="your@email.com"
                      className="mt-1" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <Input 
                      id="signup-password" 
                      type="password" 
                      className="mt-1"
                      placeholder="••••••••" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <Input 
                      id="signup-confirm" 
                      type="password" 
                      className="mt-1"
                      placeholder="••••••••" 
                      required 
                    />
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      className="w-full bg-heartfelt-burgundy hover:bg-heartfelt-dark"
                    >
                      <User size={18} className="mr-2" />
                      Sign Up
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Need help? <Link to="/support" className="text-heartfelt-burgundy hover:underline">Contact our support team</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-heartfelt-cream/30 rounded-2xl -z-10"></div>
        <div className="py-10 px-6">
          <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-2">My Account</h1>
          <p className="text-muted-foreground max-w-2xl">
            Manage your personal information, orders, and preferences.
          </p>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Account Navigation */}
        <aside className="lg:w-64 shrink-0">
          <nav className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="w-16 h-16 bg-heartfelt-cream/50 rounded-full flex items-center justify-center mx-auto mb-3">
                <User size={28} className="text-heartfelt-burgundy" />
              </div>
              <p className="font-medium text-lg text-center">{user.name}</p>
              <p className="text-sm text-gray-500 text-center">{user.email}</p>
            </div>
            
            <div className="p-2">
              <div className="py-1">
                <p className="px-3 text-xs uppercase font-semibold text-muted-foreground mb-1">Account</p>
                <ul>
                  <li>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start rounded-lg h-10 px-3 font-normal text-gray-800"
                    >
                      <User size={18} className="mr-3 text-heartfelt-burgundy" />
                      Profile
                    </Button>
                  </li>
                  <li>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start rounded-lg h-10 px-3 font-normal text-gray-800"
                    >
                      <Shield size={18} className="mr-3 text-heartfelt-burgundy" />
                      Security
                    </Button>
                  </li>
                  <li>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start rounded-lg h-10 px-3 font-normal text-gray-800"
                    >
                      <Bell size={18} className="mr-3 text-heartfelt-burgundy" />
                      Notifications
                    </Button>
                  </li>
                </ul>
              </div>
              
              <div className="py-1 mt-2">
                <p className="px-3 text-xs uppercase font-semibold text-muted-foreground mb-1">Shopping</p>
                <ul>
                  <li>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start rounded-lg h-10 px-3 font-normal text-gray-800"
                    >
                      <Package size={18} className="mr-3 text-heartfelt-burgundy" />
                      Orders
                    </Button>
                  </li>
                  <li>
                    {/* Fix: Changed from 'as={Link}' to 'asChild' and wrapped with Link */}
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start rounded-lg h-10 px-3 font-normal text-gray-800"
                      asChild
                    >
                      <Link to="/wishlist">
                        <Heart size={18} className="mr-3 text-heartfelt-burgundy" />
                        Wishlist
                      </Link>
                    </Button>
                  </li>
                  <li>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start rounded-lg h-10 px-3 font-normal text-gray-800"
                    >
                      <CreditCard size={18} className="mr-3 text-heartfelt-burgundy" />
                      Payment Methods
                    </Button>
                  </li>
                  <li>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start rounded-lg h-10 px-3 font-normal text-gray-800"
                    >
                      <Map size={18} className="mr-3 text-heartfelt-burgundy" />
                      Addresses
                    </Button>
                  </li>
                </ul>
              </div>
              
              <div className="py-1 mt-2">
                <p className="px-3 text-xs uppercase font-semibold text-muted-foreground mb-1">Other</p>
                <ul>
                  <li>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start rounded-lg h-10 px-3 font-normal text-gray-800"
                    >
                      <Settings size={18} className="mr-3 text-heartfelt-burgundy" />
                      Preferences
                    </Button>
                  </li>
                  <li>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start rounded-lg h-10 px-3 font-normal text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={18} className="mr-3" />
                      Logout
                    </Button>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </aside>
        
        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white shadow-sm rounded-xl p-8 border border-gray-100">
            <h2 className="text-xl font-serif font-medium mb-2">Profile Information</h2>
            <p className="text-muted-foreground mb-6">
              Manage your account details and preferences
            </p>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user.name} className="border-gray-200" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user.email} className="border-gray-200" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="Add phone number" className="border-gray-200" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" type="date" className="border-gray-200" />
                </div>
              </div>
              
              <div className="pt-4">
                <Button type="submit" className="bg-heartfelt-burgundy hover:bg-heartfelt-dark">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>

          {/* Activity Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-heartfelt-cream/30 p-2.5 rounded-lg">
                  <Package size={20} className="text-heartfelt-burgundy" />
                </div>
                <h3 className="font-medium">Recent Orders</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">You have no recent orders.</p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/categories">Shop Now</Link>
              </Button>
            </div>
            
            <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-heartfelt-cream/30 p-2.5 rounded-lg">
                  <Heart size={20} className="text-heartfelt-burgundy" />
                </div>
                <h3 className="font-medium">Wishlist</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">You have 0 items in your wishlist.</p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/wishlist">View Wishlist</Link>
              </Button>
            </div>
            
            <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-heartfelt-cream/30 p-2.5 rounded-lg">
                  <Bell size={20} className="text-heartfelt-burgundy" />
                </div>
                <h3 className="font-medium">Notifications</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">You have no new notifications.</p>
              <Button variant="outline" size="sm" className="w-full">
                View Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
