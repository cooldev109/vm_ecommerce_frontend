import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  ArrowLeft,
  Loader2,
  FileText,
  Crown,
  Music,
  Settings,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { AdminProducts } from '@/components/admin/AdminProducts';
import { AdminOrders } from '@/components/admin/AdminOrders';
import { AdminUsers } from '@/components/admin/AdminUsers';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AdminInvoices } from '@/components/admin/AdminInvoices';
import AdminSubscriptions from '@/components/admin/AdminSubscriptions';
import { AdminAudioContent } from '@/components/admin/AdminAudioContent';
import { AdminSettings } from '@/components/admin/AdminSettings';
import { AdminAnalytics } from '@/components/admin/AdminAnalytics';

const Admin = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'dashboard');

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-oriental pattern-silk flex items-center justify-center">
        <div className="text-center animate-bloom">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4 text-accent" />
            <div className="absolute inset-0 animate-glow-pulse rounded-full" />
          </div>
          <p className="text-luxury text-lg">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Check if user is admin
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-oriental pattern-silk flex items-center justify-center">
        <Card className="card-feminine max-w-md mx-4 animate-bloom">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
              <Users className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-serif font-bold mb-3 text-foreground">Access Denied</h1>
            <p className="text-muted-foreground mb-6">You don't have permission to access this page.</p>
            <Button onClick={() => navigate('/')} className="btn-gradient-gold">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-oriental pattern-silk">
      <div className="section-padding">
        <div className="max-w-7xl mx-auto">
          {/* Header with Oriental Styling */}
          <div className="mb-8 animate-bloom">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-rose-gold flex items-center justify-center animate-gentle-pulse">
                  <Sparkles className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h1 className="font-serif text-4xl font-bold text-foreground">
                    Admin Dashboard
                  </h1>
                  <p className="text-muted-foreground">Manage your V&M Candle store</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="border-gold-accent hover-glow transition-silk"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Store
              </Button>
            </div>
            {/* Decorative Line */}
            <div className="line-rose-gold w-full" />
          </div>

          {/* Tabs with Enhanced Styling */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-9 lg:w-auto lg:inline-grid bg-silk-cream/50 backdrop-blur-sm border border-border/50 p-1 rounded-lg">
              <TabsTrigger
                value="dashboard"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft transition-elegant"
              >
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft transition-elegant"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger
                value="products"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft transition-elegant"
              >
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Products</span>
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft transition-elegant"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger
                value="invoices"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft transition-elegant"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Invoices</span>
              </TabsTrigger>
              <TabsTrigger
                value="subscriptions"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft transition-elegant"
              >
                <Crown className="h-4 w-4" />
                <span className="hidden sm:inline">Subscriptions</span>
              </TabsTrigger>
              <TabsTrigger
                value="audio"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft transition-elegant"
              >
                <Music className="h-4 w-4" />
                <span className="hidden sm:inline">Audio</span>
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft transition-elegant"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft transition-elegant"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            <div className="animate-fade-in">
              <TabsContent value="dashboard">
                <AdminDashboard />
              </TabsContent>

              <TabsContent value="analytics">
                <AdminAnalytics />
              </TabsContent>

              <TabsContent value="products">
                <AdminProducts />
              </TabsContent>

              <TabsContent value="orders">
                <AdminOrders />
              </TabsContent>

              <TabsContent value="invoices">
                <AdminInvoices />
              </TabsContent>

              <TabsContent value="subscriptions">
                <AdminSubscriptions />
              </TabsContent>

              <TabsContent value="audio">
                <AdminAudioContent />
              </TabsContent>

              <TabsContent value="users">
                <AdminUsers />
              </TabsContent>

              <TabsContent value="settings">
                <AdminSettings />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
