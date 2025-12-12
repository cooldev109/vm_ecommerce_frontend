import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Store,
  Mail,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  Truck,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Settings2,
  Database
} from 'lucide-react';
import { toast } from 'sonner';

export const AdminSettings = () => {
  const [saving, setSaving] = useState(false);

  // Store Settings
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'V&M Candles',
    storeEmail: 'contact@vmcandles.com',
    storePhone: '+56 9 1234 5678',
    storeAddress: 'Santiago, Chile',
    currency: 'USD',
    taxRate: '19',
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    orderConfirmation: true,
    orderShipped: true,
    newUserRegistration: true,
    lowStockAlert: true,
    subscriptionRenewal: true,
    paymentFailed: true,
  });

  // Shipping Settings
  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: '100',
    standardShippingRate: '10',
    expressShippingRate: '25',
    internationalShipping: false,
  });

  // Feature Flags
  const [features, setFeatures] = useState({
    subscriptionsEnabled: true,
    audioExperienceEnabled: true,
    guestCheckout: false,
    reviewsEnabled: true,
    wishlistEnabled: true,
  });

  const handleSaveSettings = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground">Store Settings</h2>
          <p className="text-muted-foreground">Configure your V&M Candle store preferences</p>
        </div>
        <Button
          onClick={handleSaveSettings}
          disabled={saving}
          className="btn-gradient-gold"
        >
          {saving ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save All Settings
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Information */}
        <Card className="card-feminine">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-rose-gold flex items-center justify-center">
                <Store className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle>Store Information</CardTitle>
                <CardDescription>Basic store details and contact info</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={storeSettings.storeName}
                onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeEmail">Contact Email</Label>
              <Input
                id="storeEmail"
                type="email"
                value={storeSettings.storeEmail}
                onChange={(e) => setStoreSettings({ ...storeSettings, storeEmail: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storePhone">Phone Number</Label>
              <Input
                id="storePhone"
                value={storeSettings.storePhone}
                onChange={(e) => setStoreSettings({ ...storeSettings, storePhone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeAddress">Address</Label>
              <Textarea
                id="storeAddress"
                value={storeSettings.storeAddress}
                onChange={(e) => setStoreSettings({ ...storeSettings, storeAddress: e.target.value })}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={storeSettings.currency}
                  onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={storeSettings.taxRate}
                  onChange={(e) => setStoreSettings({ ...storeSettings, taxRate: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="card-feminine">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-rose-gold flex items-center justify-center">
                <Bell className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Configure email notification preferences</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries({
              orderConfirmation: 'Order Confirmation',
              orderShipped: 'Order Shipped',
              newUserRegistration: 'New User Registration',
              lowStockAlert: 'Low Stock Alert',
              subscriptionRenewal: 'Subscription Renewal',
              paymentFailed: 'Payment Failed Alert',
            }).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor={key}>{label}</Label>
                  <p className="text-xs text-muted-foreground">
                    Send email when {label.toLowerCase()}
                  </p>
                </div>
                <Switch
                  id={key}
                  checked={notifications[key as keyof typeof notifications]}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, [key]: checked })
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Shipping Settings */}
        <Card className="card-feminine">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-rose-gold flex items-center justify-center">
                <Truck className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle>Shipping Configuration</CardTitle>
                <CardDescription>Set shipping rates and options</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="freeShippingThreshold">Free Shipping Threshold ($)</Label>
              <Input
                id="freeShippingThreshold"
                type="number"
                value={shippingSettings.freeShippingThreshold}
                onChange={(e) =>
                  setShippingSettings({ ...shippingSettings, freeShippingThreshold: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Orders above this amount qualify for free shipping
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="standardShippingRate">Standard Shipping ($)</Label>
                <Input
                  id="standardShippingRate"
                  type="number"
                  value={shippingSettings.standardShippingRate}
                  onChange={(e) =>
                    setShippingSettings({ ...shippingSettings, standardShippingRate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expressShippingRate">Express Shipping ($)</Label>
                <Input
                  id="expressShippingRate"
                  type="number"
                  value={shippingSettings.expressShippingRate}
                  onChange={(e) =>
                    setShippingSettings({ ...shippingSettings, expressShippingRate: e.target.value })
                  }
                />
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>International Shipping</Label>
                <p className="text-xs text-muted-foreground">
                  Enable shipping to international addresses
                </p>
              </div>
              <Switch
                checked={shippingSettings.internationalShipping}
                onCheckedChange={(checked) =>
                  setShippingSettings({ ...shippingSettings, internationalShipping: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Feature Flags */}
        <Card className="card-feminine">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-rose-gold flex items-center justify-center">
                <Settings2 className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle>Feature Toggles</CardTitle>
                <CardDescription>Enable or disable store features</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries({
              subscriptionsEnabled: { label: 'Subscriptions', desc: 'Allow customers to subscribe to plans' },
              audioExperienceEnabled: { label: 'Audio Experience', desc: 'Enable audio content for subscribers' },
              guestCheckout: { label: 'Guest Checkout', desc: 'Allow purchases without account' },
              reviewsEnabled: { label: 'Product Reviews', desc: 'Allow customers to leave reviews' },
              wishlistEnabled: { label: 'Wishlist', desc: 'Enable wishlist functionality' },
            }).map(([key, { label, desc }]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={key}>{label}</Label>
                    {features[key as keyof typeof features] ? (
                      <Badge variant="default" className="bg-green-600 text-xs">Active</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">Disabled</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                <Switch
                  id={key}
                  checked={features[key as keyof typeof features]}
                  onCheckedChange={(checked) =>
                    setFeatures({ ...features, [key]: checked })
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="card-feminine">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-rose-gold flex items-center justify-center">
              <Database className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current system health and integrations</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Database', status: 'healthy', icon: Database },
              { label: 'Payments (Webpay)', status: 'healthy', icon: CreditCard },
              { label: 'Email Service', status: 'healthy', icon: Mail },
              { label: 'SSL Certificate', status: 'healthy', icon: Shield },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border/50"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  item.status === 'healthy' ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  {item.status === 'healthy' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className={`text-xs capitalize ${
                    item.status === 'healthy' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {item.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="card-feminine">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="border-gold-accent hover-glow">
              <RefreshCw className="mr-2 h-4 w-4" />
              Clear Cache
            </Button>
            <Button variant="outline" className="border-gold-accent hover-glow">
              <Database className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button variant="outline" className="border-gold-accent hover-glow">
              <Mail className="mr-2 h-4 w-4" />
              Test Email
            </Button>
            <Button variant="outline" className="border-gold-accent hover-glow">
              <Globe className="mr-2 h-4 w-4" />
              View Site
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
