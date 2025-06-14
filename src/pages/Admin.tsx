
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  FileText, 
  MessageSquare, 
  Settings,
  BarChart3,
  Calendar
} from 'lucide-react';
import ProductManagement from '@/components/admin/ProductManagement';
import OrderManagement from '@/components/admin/OrderManagement';
import BlogManagement from '@/components/admin/BlogManagement';
import UserManagement from '@/components/admin/UserManagement';
import CustomOrderManagement from '@/components/admin/CustomOrderManagement';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Simple admin check - in production, you'd want proper role-based auth
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // For now, check if user email contains 'admin' - replace with proper role check
  const isAdmin = user?.email?.includes('admin') || user?.email?.includes('owner');
  
  if (!isAdmin) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground">You don't have permission to access the admin panel.</p>
      </div>
    );
  }

  const dashboardStats = [
    { title: 'Total Products', value: '156', icon: Package, color: 'text-blue-600' },
    { title: 'Orders Today', value: '23', icon: ShoppingCart, color: 'text-green-600' },
    { title: 'Total Users', value: '1,234', icon: Users, color: 'text-purple-600' },
    { title: 'Blog Posts', value: '45', icon: FileText, color: 'text-orange-600' },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your e-commerce platform</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 size={16} />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package size={16} />
            Products
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingCart size={16} />
            Orders
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users size={16} />
            Users
          </TabsTrigger>
          <TabsTrigger value="blog" className="flex items-center gap-2">
            <FileText size={16} />
            Blog
          </TabsTrigger>
          <TabsTrigger value="custom-orders" className="flex items-center gap-2">
            <MessageSquare size={16} />
            Custom Orders
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Calendar size={16} />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardStats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <p className="font-medium">Order #1234</p>
                      <p className="text-sm text-muted-foreground">John Doe</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹2,499</p>
                      <p className="text-sm text-green-600">Completed</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <p className="font-medium">Order #1235</p>
                      <p className="text-sm text-muted-foreground">Jane Smith</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹1,899</p>
                      <p className="text-sm text-orange-600">Pending</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Low Stock Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <p className="font-medium">Handcrafted Mug</p>
                      <p className="text-sm text-muted-foreground">Kitchen</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-600">3 left</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <p className="font-medium">Wooden Frame</p>
                      <p className="text-sm text-muted-foreground">Decor</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-600">1 left</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <ProductManagement />
        </TabsContent>

        <TabsContent value="orders">
          <OrderManagement />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="blog">
          <BlogManagement />
        </TabsContent>

        <TabsContent value="custom-orders">
          <CustomOrderManagement />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
