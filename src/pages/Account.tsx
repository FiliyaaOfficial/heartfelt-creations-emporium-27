
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { User, Package, Heart, LogOut, Settings, CreditCard } from "lucide-react";

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
      title: "Not implemented",
      description: "Login functionality is not yet implemented",
    });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Not implemented",
      description: "Signup functionality is not yet implemented",
    });
  };

  if (!user.isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-serif font-semibold mb-6">My Account</h1>
        
        <div className="max-w-md mx-auto">
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" required />
                </div>
                
                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <Input id="login-password" type="password" required />
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <Button type="button" variant="link" className="px-0">
                    Forgot password?
                  </Button>
                  <Button type="submit">Login</Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input id="signup-name" type="text" required />
                </div>
                
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" required />
                </div>
                
                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" required />
                </div>
                
                <div>
                  <Label htmlFor="signup-confirm">Confirm Password</Label>
                  <Input id="signup-confirm" type="password" required />
                </div>
                
                <div className="pt-2">
                  <Button type="submit" className="w-full">Sign Up</Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-serif font-semibold mb-6">My Account</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Account Navigation */}
        <aside className="lg:w-64 shrink-0">
          <nav className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-4 border-b">
              <p className="font-medium text-lg">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            
            <ul>
              <li>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-none h-12 px-4 font-normal"
                >
                  <User size={18} className="mr-3" />
                  Profile
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-none h-12 px-4 font-normal"
                >
                  <Package size={18} className="mr-3" />
                  Orders
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-none h-12 px-4 font-normal"
                >
                  <Heart size={18} className="mr-3" />
                  Wishlist
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-none h-12 px-4 font-normal"
                >
                  <CreditCard size={18} className="mr-3" />
                  Payment Methods
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-none h-12 px-4 font-normal"
                >
                  <Settings size={18} className="mr-3" />
                  Settings
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-none h-12 px-4 font-normal text-red-500 hover:text-red-600"
                >
                  <LogOut size={18} className="mr-3" />
                  Logout
                </Button>
              </li>
            </ul>
          </nav>
        </aside>
        
        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-medium mb-4">Profile Information</h2>
            <p className="text-gray-500 mb-6">
              Manage your account details and preferences
            </p>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user.name} />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user.email} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="Add phone number" />
                </div>
                
                <div>
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" type="date" />
                </div>
              </div>
              
              <div className="pt-4">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
