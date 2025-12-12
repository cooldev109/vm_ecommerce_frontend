import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Package, MapPin, Crown } from 'lucide-react';
import ProfileTab from '@/components/account/ProfileTab';
import OrdersTab from '@/components/account/OrdersTab';
import AddressesTab from '@/components/account/AddressesTab';
import SubscriptionTab from '@/components/account/SubscriptionTab';

const Account = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('profile');

  // Get tab from URL query parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['profile', 'orders', 'addresses', 'subscription'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Redirect admin users to /admin page
  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  // Redirect non-authenticated users to login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Don't render for admin users (they'll be redirected)
  if (!isAuthenticated || (user && user.role === 'ADMIN')) {
    return null;
  }

  return (
    <div className="min-h-screen section-padding">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-12 text-center">
          My Account
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="subscription" className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              <span className="hidden sm:inline">Subscription</span>
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Addresses</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileTab />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersTab />
          </TabsContent>

          <TabsContent value="subscription">
            <SubscriptionTab />
          </TabsContent>

          <TabsContent value="addresses">
            <AddressesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Account;
