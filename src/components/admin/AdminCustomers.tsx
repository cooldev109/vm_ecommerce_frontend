import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Loader2,
  Search,
  Users as UsersIcon,
  Sparkles,
  Eye,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as customerService from '@/services/customerService';
import { formatCurrency } from '@/lib/utils';

export const AdminCustomers = () => {
  const [customers, setCustomers] = useState<customerService.Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<customerService.CustomerStats | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Customer details dialog
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<customerService.CustomerDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    loadCustomers();
    loadStats();
  }, [page]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getAllCustomers(page, 20, search);
      setCustomers(data.customers);
      setTotalPages(data.pagination.totalPages);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load customers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await customerService.getCustomerStats();
      setStats(data);
    } catch (error: any) {
      console.error('Failed to load customer stats:', error);
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadCustomers();
  };

  const handleViewDetails = async (customerId: string) => {
    try {
      setLoadingDetails(true);
      setDetailsDialogOpen(true);
      const data = await customerService.getCustomerDetails(customerId);
      setSelectedCustomer(data.customer);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load customer details',
        variant: 'destructive',
      });
      setDetailsDialogOpen(false);
    } finally {
      setLoadingDetails(false);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-feminine group hover-rose-glow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.customersWithOrders} with orders
              </p>
            </CardContent>
          </Card>

          <Card className="card-feminine group hover-rose-glow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">New This Month</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.newCustomersThisMonth}</div>
              <p className="text-xs text-muted-foreground mt-1">New registrations</p>
            </CardContent>
          </Card>

          <Card className="card-feminine group hover-rose-glow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Retention Rate</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.customerRetentionRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.repeatCustomers} repeat customers
              </p>
            </CardContent>
          </Card>

          <Card className="card-feminine group hover-rose-glow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Top Customer</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              {stats.topCustomers.length > 0 ? (
                <>
                  <div className="text-xl font-bold text-purple-600">
                    ${stats.topCustomers[0].totalSpent.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {stats.topCustomers[0].name || stats.topCustomers[0].email}
                  </p>
                </>
              ) : (
                <div className="text-xl font-bold text-muted-foreground">No data</div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Customers List */}
      {stats && stats.topCustomers.length > 0 && (
        <Card className="card-feminine">
          <CardHeader className="border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-rose-gold flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-accent" />
              </div>
              <div>
                <CardTitle>Top Customers by Spending</CardTitle>
                <CardDescription>Your most valuable customers</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {stats.topCustomers.map((customer, index) => (
                <div key={customer.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-rose-gold flex items-center justify-center font-bold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{customer.name || 'Unknown'}</p>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">${customer.totalSpent.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{customer.orderCount} orders</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customers Table */}
      <Card className="card-feminine">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-rose-gold flex items-center justify-center">
                <ShoppingBag className="h-4 w-4 text-accent" />
              </div>
              <div>
                <CardTitle>All Customers</CardTitle>
                <CardDescription>View and manage customer information</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Search */}
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="border-border/50"
            />
            <Button onClick={handleSearch} variant="outline" className="border-gold-accent">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-accent mx-auto" />
                <p className="text-muted-foreground mt-2">Loading customers...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-md border border-border/50">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Total Orders</TableHead>
                      <TableHead className="text-right">Total Spent</TableHead>
                      <TableHead className="text-right">Avg Order</TableHead>
                      <TableHead>Last Order</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                          <UsersIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No customers found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      customers.map((customer) => (
                        <TableRow key={customer.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium">
                            <div>
                              <p>{customer.firstName || customer.lastName
                                ? `${customer.firstName} ${customer.lastName}`.trim()
                                : 'No name'}</p>
                              {customer.customerType === 'BUSINESS' && (
                                <Badge variant="secondary" className="mt-1">Business</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                          <TableCell>
                            {customer.role === 'ADMIN' ? (
                              <Badge variant="default" className="bg-purple-600">Admin</Badge>
                            ) : (
                              <Badge variant="outline">User</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-medium">{customer.totalOrders}</TableCell>
                          <TableCell className="text-right font-medium text-green-600">
                            {formatCurrency(customer.totalSpent)}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {formatCurrency(customer.avgOrderValue)}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {formatDate(customer.lastOrderDate)}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {formatDate(customer.registrationDate)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(customer.id)}
                              title="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Customer Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              Complete profile and order history
            </DialogDescription>
          </DialogHeader>

          {loadingDetails ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Profile Information</h3>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Name</dt>
                      <dd className="font-medium">
                        {selectedCustomer.profile.firstName} {selectedCustomer.profile.lastName}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Email</dt>
                      <dd className="font-medium">{selectedCustomer.email}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Phone</dt>
                      <dd className="font-medium">{selectedCustomer.profile.phone || 'N/A'}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Customer Type</dt>
                      <dd>
                        <Badge variant="secondary">{selectedCustomer.profile.customerType}</Badge>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Role</dt>
                      <dd>
                        {selectedCustomer.role === 'ADMIN' ? (
                          <Badge className="bg-purple-600">Admin</Badge>
                        ) : (
                          <Badge variant="outline">User</Badge>
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Statistics</h3>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Total Orders</dt>
                      <dd className="font-medium text-lg">{selectedCustomer.statistics.totalOrders}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Lifetime Value</dt>
                      <dd className="font-medium text-lg text-green-600">
                        {formatCurrency(selectedCustomer.statistics.lifetimeValue)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Average Order Value</dt>
                      <dd className="font-medium">{formatCurrency(selectedCustomer.statistics.avgOrderValue)}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Last Order</dt>
                      <dd className="font-medium">{formatDate(selectedCustomer.statistics.lastOrderDate)}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Registration Date</dt>
                      <dd className="font-medium">{formatDate(selectedCustomer.registrationDate)}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Order History */}
              <div>
                <h3 className="font-semibold mb-4">Order History</h3>
                {selectedCustomer.orderHistory.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-8">No orders yet</p>
                ) : (
                  <div className="rounded-md border border-border/50">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Payment</TableHead>
                          <TableHead className="text-right">Items</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedCustomer.orderHistory.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-mono text-sm">{order.id}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{order.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={order.paymentStatus === 'PAID' ? 'default' : 'secondary'}
                                className={order.paymentStatus === 'PAID' ? 'bg-green-600' : ''}
                              >
                                {order.paymentStatus}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">{order.itemCount}</TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(order.total)}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(order.createdAt)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
