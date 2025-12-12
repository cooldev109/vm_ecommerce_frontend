import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Clock,
  BarChart3
} from 'lucide-react';
import { getOrderAnalytics, type OrderAnalytics } from '@/services/orderService';
import { useToast } from '@/hooks/use-toast';

export const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState<OrderAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getOrderAnalytics();
      setAnalytics(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load analytics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-accent mx-auto" />
            <div className="absolute inset-0 animate-glow-pulse rounded-full" />
          </div>
          <p className="text-muted-foreground mt-4">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card className="card-feminine">
        <CardContent className="py-12 text-center">
          <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No analytics data available</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate growth (mock data for display)
  const revenueGrowth = analytics.thisMonth.revenue > 0 ? 12.5 : 0;
  const ordersGrowth = analytics.thisMonth.orders > 0 ? 8.2 : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'PROCESSING':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Processing</Badge>;
      case 'PAID':
        return <Badge variant="default" className="bg-green-600">Paid</Badge>;
      case 'SHIPPED':
        return <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">Shipped</Badge>;
      case 'DELIVERED':
        return <Badge variant="default" className="bg-emerald-600">Delivered</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500';
      case 'PROCESSING': return 'bg-blue-500';
      case 'PAID': return 'bg-green-500';
      case 'SHIPPED': return 'bg-purple-500';
      case 'DELIVERED': return 'bg-emerald-500';
      case 'CANCELLED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const totalStatusCount = Object.values(analytics.ordersByStatus).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Stats Grid with Oriental Styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <Card className="card-feminine group hover-rose-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <div className="w-10 h-10 rounded-full bg-gradient-rose-gold flex items-center justify-center group-hover:animate-gentle-pulse">
              <DollarSign className="h-5 w-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">${analytics.totalRevenue.toFixed(2)}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className={`flex items-center text-xs ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {revenueGrowth >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {Math.abs(revenueGrowth)}%
              </span>
              <span className="text-xs text-muted-foreground">from {analytics.paidOrdersCount} orders</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card className="card-feminine group hover-rose-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            <div className="w-10 h-10 rounded-full bg-gradient-rose-gold flex items-center justify-center group-hover:animate-gentle-pulse">
              <ShoppingCart className="h-5 w-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{analytics.totalOrders}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className={`flex items-center text-xs ${ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {ordersGrowth >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {Math.abs(ordersGrowth)}%
              </span>
              <span className="text-xs text-muted-foreground">all time orders</span>
            </div>
          </CardContent>
        </Card>

        {/* This Month */}
        <Card className="card-feminine group hover-rose-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
            <div className="w-10 h-10 rounded-full bg-gradient-rose-gold flex items-center justify-center group-hover:animate-gentle-pulse">
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{analytics.thisMonth.orders}</div>
            <div className="flex items-center gap-2 mt-2">
              <Sparkles className="h-3 w-3 text-accent" />
              <span className="text-xs text-muted-foreground">${analytics.thisMonth.revenue.toFixed(2)} revenue</span>
            </div>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card className="card-feminine group hover-rose-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Order Status</CardTitle>
            <div className="w-10 h-10 rounded-full bg-gradient-rose-gold flex items-center justify-center group-hover:animate-gentle-pulse">
              <Package className="h-5 w-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(analytics.ordersByStatus).slice(0, 3).map(([status, count]) => (
                <div key={status} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{status}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                  <Progress
                    value={totalStatusCount > 0 ? (count / totalStatusCount) * 100 : 0}
                    className="h-1.5"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="card-feminine">
          <CardHeader className="border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-rose-gold flex items-center justify-center">
                <Clock className="h-4 w-4 text-accent" />
              </div>
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest {analytics.recentOrders.length} orders from your store</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {analytics.recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">No orders yet</p>
                </div>
              ) : (
                analytics.recentOrders.map((order, index) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium font-mono">{order.id}</p>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {order.firstName} {order.lastName} • {order.items.length} items
                      </p>
                    </div>
                    <div className="text-sm font-bold text-gradient-gold">${parseFloat(order.total.toString()).toFixed(2)}</div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="card-feminine">
          <CardHeader className="border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-rose-gold flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-accent" />
              </div>
              <div>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Best selling products (all time)</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {analytics.topProducts.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">No sales yet</p>
                </div>
              ) : (
                analytics.topProducts.map((item, index) => {
                  const translation = item.product?.translations?.[0];
                  const maxSold = Math.max(...analytics.topProducts.map(p => p.totalSold));
                  const percentage = (item.totalSold / maxSold) * 100;

                  return (
                    <div
                      key={item.productId}
                      className="space-y-2"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                            #{index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {translation?.name || item.productId}
                            </p>
                            <p className="text-xs text-muted-foreground">{item.totalSold} sold</p>
                          </div>
                        </div>
                        <div className="text-sm font-bold">
                          ${(parseFloat(item.product?.price?.toString() || '0') * item.totalSold).toFixed(2)}
                        </div>
                      </div>
                      <Progress value={percentage} className="h-1.5" />
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Overview */}
      <Card className="card-feminine">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-rose-gold flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-accent" />
            </div>
            <div>
              <CardTitle>Order Status Overview</CardTitle>
              <CardDescription>Distribution of orders by status</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(analytics.ordersByStatus).map(([status, count]) => (
              <div
                key={status}
                className="text-center p-4 rounded-lg bg-muted/30 border border-border/50 hover:shadow-soft transition-all"
              >
                <div className={`w-3 h-3 rounded-full ${getStatusColor(status)} mx-auto mb-2`} />
                <p className="text-2xl font-bold text-foreground">{count}</p>
                <p className="text-xs text-muted-foreground capitalize">{status.toLowerCase()}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
