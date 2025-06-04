
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  User, 
  Package, 
  Heart, 
  LogOut, 
  Settings, 
  CreditCard, 
  Bell, 
  Shield, 
  Map,
  Edit
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
}

const Account = () => {
  const { user, isAuthenticated, loading, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProfile();
    }
  }, [isAuthenticated, user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, ...updates })
        .select();

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updates } : null);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  if (loading || profileLoading) {
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
      <div className="container mx-auto px-4 py-12">
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-heartfelt-cream/30 rounded-2xl -z-10"></div>
          <div className="py-10 px-6 text-center">
            <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-2">My Account</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Sign in to your account to manage your orders, wishlist, and more.
            </p>
          </div>
        </div>
        
        <div className="max-w-md mx-auto text-center">
          <Button 
            className="bg-heartfelt-burgundy hover:bg-heartfelt-dark"
            onClick={() => navigate('/auth')}
          >
            <User className="mr-2 h-4 w-4" />
            Sign In
          </Button>
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
              <div className="flex items-center space-x-3">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-heartfelt-cream/50 text-heartfelt-burgundy">
                    {profile?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-lg">
                    {profile?.first_name && profile?.last_name 
                      ? `${profile.first_name} ${profile.last_name}`
                      : user?.email
                    }
                  </p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
              <TabsList className="flex-col h-auto bg-transparent p-2 space-y-1">
                <TabsTrigger 
                  value="profile" 
                  className="w-full justify-start data-[state=active]:bg-heartfelt-burgundy data-[state=active]:text-white"
                >
                  <User size={18} className="mr-3" />
                  Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="orders" 
                  className="w-full justify-start data-[state=active]:bg-heartfelt-burgundy data-[state=active]:text-white"
                >
                  <Package size={18} className="mr-3" />
                  Orders
                </TabsTrigger>
                <TabsTrigger 
                  value="wishlist" 
                  className="w-full justify-start data-[state=active]:bg-heartfelt-burgundy data-[state=active]:text-white"
                >
                  <Heart size={18} className="mr-3" />
                  Wishlist
                </TabsTrigger>
                <TabsTrigger 
                  value="addresses" 
                  className="w-full justify-start data-[state=active]:bg-heartfelt-burgundy data-[state=active]:text-white"
                >
                  <Map size={18} className="mr-3" />
                  Addresses
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="w-full justify-start data-[state=active]:bg-heartfelt-burgundy data-[state=active]:text-white"
                >
                  <Shield size={18} className="mr-3" />
                  Security
                </TabsTrigger>
              </TabsList>
              
              <div className="px-2 pb-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={handleSignOut}
                >
                  <LogOut size={18} className="mr-3" />
                  Logout
                </Button>
              </div>
            </Tabs>
          </nav>
        </aside>
        
        {/* Main Content */}
        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="profile">
              <div className="bg-white shadow-sm rounded-xl p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-serif font-medium mb-2">Profile Information</h2>
                    <p className="text-muted-foreground">
                      Manage your account details and preferences
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
                
                <form className="space-y-6" onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  updateProfile({
                    first_name: formData.get('first_name') as string,
                    last_name: formData.get('last_name') as string,
                    phone: formData.get('phone') as string,
                  });
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input 
                        id="first_name" 
                        name="first_name"
                        defaultValue={profile?.first_name || ''} 
                        className="border-gray-200" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input 
                        id="last_name" 
                        name="last_name"
                        defaultValue={profile?.last_name || ''} 
                        className="border-gray-200" 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={user?.email || ''} 
                        className="border-gray-200 bg-gray-50" 
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        name="phone"
                        defaultValue={profile?.phone || ''} 
                        className="border-gray-200" 
                        placeholder="+91 1234567890"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button type="submit" className="bg-heartfelt-burgundy hover:bg-heartfelt-dark">
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="orders">
              <div className="bg-white shadow-sm rounded-xl p-8 border border-gray-100">
                <h2 className="text-xl font-serif font-medium mb-6">Order History</h2>
                <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                  <Button asChild className="bg-heartfelt-burgundy hover:bg-heartfelt-dark">
                    <Link to="/categories">Start Shopping</Link>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="wishlist">
              <div className="bg-white shadow-sm rounded-xl p-8 border border-gray-100">
                <h2 className="text-xl font-serif font-medium mb-6">My Wishlist</h2>
                <div className="text-center py-12">
                  <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-muted-foreground mb-4">Your wishlist is empty.</p>
                  <Button asChild className="bg-heartfelt-burgundy hover:bg-heartfelt-dark">
                    <Link to="/wishlist">View Wishlist</Link>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="addresses">
              <div className="bg-white shadow-sm rounded-xl p-8 border border-gray-100">
                <h2 className="text-xl font-serif font-medium mb-6">Saved Addresses</h2>
                <div className="text-center py-12">
                  <Map className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-muted-foreground mb-4">No saved addresses yet.</p>
                  <Button variant="outline">
                    Add New Address
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security">
              <div className="bg-white shadow-sm rounded-xl p-8 border border-gray-100">
                <h2 className="text-xl font-serif font-medium mb-6">Security Settings</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Password</h3>
                      <p className="text-sm text-muted-foreground">Change your account password</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">Add extra security to your account</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Account;
