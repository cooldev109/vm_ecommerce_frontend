import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Activity,
  Calendar,
  RefreshCw
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { getAnalytics, type AnalyticsData } from '@/services/analyticsService';
import { useToast } from '@/hooks/use-toast';

// Luxury theme colors
const CHART_COLORS = {
  primary: '#C4A576', // Gold
  secondary: '#D4AF6A', // Light Gold
  accent: '#B8956A', // Rose Gold
  success: '#10B981', // Green
  danger: '#EF4444', // Red
  categories: {
    CANDLES: '#C4A576',
    ACCESSORIES: '#D4AF6A',
    SETS: '#E8C7A1'
  }
};

const PIE_COLORS = ['#C4A576', '#D4AF6A', '#E8C7A1', '#B8956A', '#A88B5F'];

export const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getAnalytics();
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { bg: string; text: string; border: string }> = {
      PENDING: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
      PROCESSING: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      PAID: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
      SHIPPED: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
      DELIVERED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
      CANCELLED: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
    };

    const variant = variants[status] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };

    return (
      <Badge className={`${variant.bg} ${variant.text} ${variant.border} border`}>
        {status}
      </Badge>
    );
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
          <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No analytics data available</p>
          <Button onClick={loadAnalytics} className="mt-4" variant="outline">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold text-foreground">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive store performance metrics</p>
        </div>
        <Button onClick={loadAnalytics} variant="outline" className="hover-glow">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Key Metrics Cards */}
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
            <div className="text-3xl font-bold text-foreground">
              {formatCurrency(analytics.revenue.total)}
            </div>
            <div className="flex items-center gap-2 mt-2">
              {analytics.revenue.growth >= 0 ? (
                <span className="flex items-center text-xs text-green-600">
                  <ArrowUpRight className="h-3 w-3" />
                  {analytics.revenue.growth.toFixed(1)}%
                </span>
              ) : (
                <span className="flex items-center text-xs text-red-600">
                  <ArrowDownRight className="h-3 w-3" />
                  {Math.abs(analytics.revenue.growth).toFixed(1)}%
                </span>
              )}
              <span className="text-xs text-muted-foreground">vs last month</span>
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
            <div className="text-3xl font-bold text-foreground">
              {formatNumber(analytics.orders.total)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {formatNumber(analytics.orders.paid)} paid orders
            </p>
          </CardContent>
        </Card>

        {/* Total Customers */}
        <Card className="card-feminine group hover-rose-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
            <div className="w-10 h-10 rounded-full bg-gradient-rose-gold flex items-center justify-center group-hover:animate-gentle-pulse">
              <Users className="h-5 w-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {formatNumber(analytics.customers.total)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Unique customers
            </p>
          </CardContent>
        </Card>

        {/* Average Order Value */}
        <Card className="card-feminine group hover-rose-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Order Value</CardTitle>
            <div className="w-10 h-10 rounded-full bg-gradient-rose-gold flex items-center justify-center group-hover:animate-gentle-pulse">
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {formatCurrency(analytics.revenue.avgOrderValue)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Per order average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trends - This Month Summary */}
      <Card className="card-feminine">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly and weekly performance</CardDescription>
            </div>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-sm text-muted-foreground mb-1">This Month</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(analytics.revenue.thisMonth)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatNumber(analytics.orders.thisMonth)} orders
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-sm text-muted-foreground mb-1">Last Month</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(analytics.revenue.lastMonth)}
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-sm text-muted-foreground mb-1">This Week</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(analytics.revenue.thisWeek)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="card-feminine">
          <CardHeader className="border-b border-border/50">
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Daily revenue over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.salesOverTime}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={CHART_COLORS.primary}
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="card-feminine">
          <CardHeader className="border-b border-border/50">
            <CardTitle>Revenue by Category</CardTitle>
            <CardDescription>Sales distribution across product categories</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.revenueByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, revenue }) =>
                    `${category}: ${formatCurrency(revenue)}`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {analytics.revenueByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: any) => formatCurrency(value)}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card className="card-feminine">
          <CardHeader className="border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-rose-gold flex items-center justify-center">
                <Package className="h-4 w-4 text-accent" />
              </div>
              <div>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Best selling products by quantity and revenue</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {analytics.topProducts.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">No sales data yet</p>
                </div>
              ) : (
                analytics.topProducts.map((product, index) => (
                  <div
                    key={product.productId}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-rose-gold flex items-center justify-center text-sm font-bold text-white">
                      #{index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatNumber(product.quantitySold)} sold
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gradient-gold">
                        {formatCurrency(product.revenue)}
                      </p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="card-feminine">
          <CardHeader className="border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-rose-gold flex items-center justify-center">
                <Activity className="h-4 w-4 text-accent" />
              </div>
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest {analytics.recentOrders.length} orders</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {analytics.recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">No orders yet</p>
                </div>
              ) : (
                analytics.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium font-mono">{order.id}</p>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {order.customerName} • {order.itemCount} items
                      </p>
                    </div>
                    <div className="text-sm font-bold text-gradient-gold">
                      {formatCurrency(order.total)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Distribution */}
      <Card className="card-feminine">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-rose-gold flex items-center justify-center">
              <Activity className="h-4 w-4 text-accent" />
            </div>
            <div>
              <CardTitle>Order Status Distribution</CardTitle>
              <CardDescription>Breakdown of orders by current status</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(analytics.orders.byStatus).map(([status, count]) => (
              <div
                key={status}
                className="text-center p-4 rounded-lg bg-muted/30 border border-border/50 hover:shadow-soft transition-all"
              >
                <p className="text-2xl font-bold text-foreground">{count}</p>
                <p className="text-xs text-muted-foreground capitalize mt-1">
                  {status.toLowerCase()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
