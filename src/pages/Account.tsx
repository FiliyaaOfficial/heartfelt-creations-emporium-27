
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
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
  Edit,
  Calendar,
  Mail,
  Phone,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Order } from "@/types";
import ProductCard from "@/components/ProductCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

interface UserMetadata {
  email?: string;
  email_verified?: boolean;
  phone_verified?: boolean;
  provider?: string;
  providers?: string[];
  last_sign_in_at?: string;
  created_at?: string;
  updated_at?: string;
}

const Account = () => {
  const { user, isAuthenticated, loading, signOut } = useAuth();
  const { wishlistItems, isLoading: wishlistLoading } = useWishlist();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userMetadata, setUserMetadata] = useState<UserMetadata | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCompleteUserData();
      fetchUserOrders();
    }
  }, [isAuthenticated, user]);

  const fetchCompleteUserData = async () => {
    if (!user) return;
    
    setProfileLoading(true);
    try {
      console.log('Fetching complete user data for:', user.id);
      
      // Fetch user metadata from auth (frontend)
      const userAuthData = {
        email: user.email,
        email_verified: user.email_confirmed_at ? true : false,
        phone_verified: user.phone_confirmed_at ? true : false,
        provider: user.app_metadata?.provider,
        providers: user.app_metadata?.providers,
        last_sign_in_at: user.last_sign_in_at,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };
      setUserMetadata(userAuthData);
      console.log('User auth metadata:', userAuthData);
      
      // Fetch profile data from backend
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      console.log('Profile fetch result:', { profileData, error });

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      }

      // Set profile data or create default if none exists
      const finalProfile = profileData || {
        id: user.id,
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || '',
        phone: user.phone || '',
        avatar_url: user.user_metadata?.avatar_url || '',
        created_at: user.created_at,
        updated_at: user.updated_at
      };

      setProfile(finalProfile);
      console.log('Final profile data:', finalProfile);

    } catch (error) {
      console.error('Error fetching complete user data:', error);
      toast.error('Failed to load user data');
      
      // Fallback to basic user data
      setProfile({
        id: user.id,
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || '',
        phone: user.phone || '',
        avatar_url: user.user_metadata?.avatar_url || ''
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    if (!user) return;
    
    setOrdersLoading(true);
    try {
      console.log('Fetching orders for user:', user.id);
      
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('Orders data:', ordersData);
      setOrders(ordersData || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load order history');
    } finally {
      setOrdersLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      console.log('Updating profile with:', updates);
      
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          ...updates,
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updates } : null);
      toast.success('Profile updated successfully');
      
      await fetchCompleteUserData();
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'processing':
        return <Package className="h-4 w-4 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-orange-500" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

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
    <div className="container mx-auto px-4 py-6 md:py-12">
      <div className="relative mb-6 md:mb-10">
        <div className="absolute inset-0 bg-heartfelt-cream/30 rounded-2xl -z-10"></div>
        <div className="py-6 md:py-10 px-4 md:px-6">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-semibold mb-2">My Account</h1>
          <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
            Manage your personal information, orders, and preferences.
          </p>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Account Navigation */}
        <aside className="w-full lg:w-64 shrink-0">
          <nav className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
            <div className="p-4 md:p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12 md:h-16 md:w-16">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-heartfelt-cream/50 text-heartfelt-burgundy text-lg">
                    {profile?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm md:text-lg truncate">
                    {profile?.first_name && profile?.last_name 
                      ? `${profile.first_name} ${profile.last_name}`
                      : user?.email
                    }
                  </p>
                  <p className="text-xs md:text-sm text-gray-500 truncate">{user?.email}</p>
                  {userMetadata?.provider && (
                    <p className="text-xs text-gray-400 capitalize">
                      via {userMetadata.provider}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
              <TabsList className="flex-col h-auto bg-transparent p-2 space-y-1 w-full">
                <TabsTrigger 
                  value="profile" 
                  className="w-full justify-start data-[state=active]:bg-heartfelt-burgundy data-[state=active]:text-white text-sm md:text-base"
                >
                  <User size={16} className="mr-3" />
                  Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="orders" 
                  className="w-full justify-start data-[state=active]:bg-heartfelt-burgundy data-[state=active]:text-white text-sm md:text-base"
                >
                  <Package size={16} className="mr-3" />
                  Orders
                </TabsTrigger>
                <TabsTrigger 
                  value="wishlist" 
                  className="w-full justify-start data-[state=active]:bg-heartfelt-burgundy data-[state=active]:text-white text-sm md:text-base"
                >
                  <Heart size={16} className="mr-3" />
                  Wishlist
                </TabsTrigger>
                <TabsTrigger 
                  value="addresses" 
                  className="w-full justify-start data-[state=active]:bg-heartfelt-burgundy data-[state=active]:text-white text-sm md:text-base"
                >
                  <Map size={16} className="mr-3" />
                  Addresses
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="w-full justify-start data-[state=active]:bg-heartfelt-burgundy data-[state=active]:text-white text-sm md:text-base"
                >
                  <Shield size={16} className="mr-3" />
                  Security
                </TabsTrigger>
              </TabsList>
              
              <div className="px-2 pb-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 text-sm md:text-base"
                  onClick={handleSignOut}
                >
                  <LogOut size={16} className="mr-3" />
                  Logout
                </Button>
              </div>
            </Tabs>
          </nav>
        </aside>
        
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="profile">
              <div className="bg-white shadow-sm rounded-xl p-4 md:p-8 border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <div>
                    <h2 className="text-xl font-serif font-medium mb-2">Profile Information</h2>
                    <p className="text-muted-foreground text-sm">
                      Manage your account details and preferences
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
                
                {profileLoading ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Account Information Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Mail className="h-4 w-4 mr-2 text-heartfelt-burgundy" />
                          <h3 className="font-medium text-sm md:text-base">Email</h3>
                        </div>
                        <p className="text-sm text-gray-600 break-all">{user?.email}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {userMetadata?.email_verified ? '✓ Verified' : '⚠ Not verified'}
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Calendar className="h-4 w-4 mr-2 text-heartfelt-burgundy" />
                          <h3 className="font-medium text-sm md:text-base">Member Since</h3>
                        </div>
                        <p className="text-sm text-gray-600">{formatDate(userMetadata?.created_at)}</p>
                        <p className="text-xs text-gray-400 mt-1">Last login: {formatDate(userMetadata?.last_sign_in_at)}</p>
                      </div>
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                        <Button type="submit" className="bg-heartfelt-burgundy hover:bg-heartfelt-dark w-full sm:w-auto">
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="orders">
              <div className="bg-white shadow-sm rounded-xl p-4 md:p-8 border border-gray-100">
                <h2 className="text-xl font-serif font-medium mb-6">Order History</h2>
                
                {ordersLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="p-4 border rounded-lg animate-pulse">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                    <Button asChild className="bg-heartfelt-burgundy hover:bg-heartfelt-dark">
                      <Link to="/categories">Start Shopping</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-medium text-sm md:text-base">Order #{order.id.slice(0, 8)}</h3>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(order.status || 'pending')}
                                <span className="text-sm capitalize">{order.status}</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500">
                              Placed on {formatDate(order.created_at)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-heartfelt-burgundy">
                              {formatPrice(order.total_amount)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {order.payment_status || 'pending'}
                            </p>
                          </div>
                        </div>
                        
                        {/* Order Items Preview */}
                        <div className="border-t pt-4">
                          <p className="text-sm text-gray-600 mb-2">
                            Items: {(order as any).order_items?.length || 0}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {(order as any).order_items?.slice(0, 3).map((item: any) => (
                              <div key={item.id} className="flex items-center space-x-2 text-sm">
                                <img 
                                  src={item.products?.image_url || "/placeholder.svg"} 
                                  alt={item.products?.name}
                                  className="w-8 h-8 object-cover rounded"
                                />
                                <span className="truncate">{item.products?.name}</span>
                                <span className="text-gray-500">×{item.quantity}</span>
                              </div>
                            ))}
                            {(order as any).order_items?.length > 3 && (
                              <span className="text-sm text-gray-500">
                                +{(order as any).order_items.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="wishlist">
              <div className="bg-white shadow-sm rounded-xl p-4 md:p-8 border border-gray-100">
                <h2 className="text-xl font-serif font-medium mb-6">My Wishlist</h2>
                
                {wishlistLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="space-y-4 animate-pulse">
                        <div className="aspect-square bg-gray-200 rounded-lg"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : wishlistItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-muted-foreground mb-4">Your wishlist is empty.</p>
                    <Button asChild className="bg-heartfelt-burgundy hover:bg-heartfelt-dark">
                      <Link to="/categories">Browse Products</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {wishlistItems.map((item) => (
                      <ProductCard key={item.id} product={item.product} />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="addresses">
              <div className="bg-white shadow-sm rounded-xl p-4 md:p-8 border border-gray-100">
                <h2 className="text-xl font-serif font-medium mb-6">Saved Addresses</h2>
                <div className="text-center py-12">
                  <Map className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-muted-foreground mb-4">No saved addresses yet.</p>
                  <Button variant="outline" className="w-full sm:w-auto">
                    Add New Address
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security">
              <div className="bg-white shadow-sm rounded-xl p-4 md:p-8 border border-gray-100">
                <h2 className="text-xl font-serif font-medium mb-6">Security Settings</h2>
                <div className="space-y-4 md:space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
                    <div>
                      <h3 className="font-medium">Password</h3>
                      <p className="text-sm text-muted-foreground">Change your account password</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      Change
                    </Button>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">Add extra security to your account</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
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
