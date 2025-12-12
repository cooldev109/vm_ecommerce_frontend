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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Eye, Loader2, Package2, Truck, FileText } from 'lucide-react';
import { getAllOrders, updateOrderStatus, updateOrderTracking, type Order } from '@/services/orderService';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import { resolveProductImage } from '@/lib/imageHelper';

export const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [generatingInvoice, setGeneratingInvoice] = useState(false);
  const { toast } = useToast();

  // Form state for order details dialog
  const [statusUpdate, setStatusUpdate] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders(1, 50);
      setOrders(data.orders);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setStatusUpdate(order.status);
    setTrackingNumber(order.trackingNumber || '');
    setCarrier(order.carrier || '');
    setAdminNotes(order.adminNotes || '');
    setDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || statusUpdate === selectedOrder.status) return;

    try {
      setUpdating(true);
      await updateOrderStatus(selectedOrder.id, { status: statusUpdate as any });
      toast({
        title: 'Success',
        description: 'Order status updated successfully',
      });
      await loadOrders();
      setDialogOpen(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update order status',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateTracking = async () => {
    if (!selectedOrder) return;

    try {
      setUpdating(true);
      await updateOrderTracking(selectedOrder.id, {
        trackingNumber,
        carrier,
        adminNotes,
      });
      toast({
        title: 'Success',
        description: 'Tracking information updated successfully',
      });
      await loadOrders();
      setDialogOpen(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update tracking',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleGenerateInvoice = async () => {
    if (!selectedOrder) return;

    try {
      setGeneratingInvoice(true);
      await api.post('/invoices/generate', { orderId: selectedOrder.id });
      toast({
        title: 'Success',
        description: 'Invoice generated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error?.message || 'Failed to generate invoice',
        variant: 'destructive',
      });
    } finally {
      setGeneratingInvoice(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-yellow-100">Pending</Badge>;
      case 'PROCESSING':
        return <Badge variant="outline" className="bg-blue-100">Processing</Badge>;
      case 'PAID':
        return <Badge variant="default" className="bg-green-600">Paid</Badge>;
      case 'SHIPPED':
        return <Badge variant="secondary">Shipped</Badge>;
      case 'DELIVERED':
        return <Badge variant="default" className="bg-emerald-600">Delivered</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline">Pending</Badge>;
      case 'PAID':
        return <Badge variant="default" className="bg-green-600">Paid</Badge>;
      case 'FAILED':
        return <Badge variant="destructive">Failed</Badge>;
      case 'REFUNDED':
        return <Badge variant="secondary">Refunded</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>Manage customer orders and tracking</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">{order.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.firstName} {order.lastName}</p>
                            <p className="text-xs text-muted-foreground">{order.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-sm">{order.items.length}</TableCell>
                        <TableCell className="font-semibold">${parseFloat(order.total.toString()).toFixed(2)}</TableCell>
                        <TableCell>{getPaymentBadge(order.paymentStatus)}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewOrder(order)}
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
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Manage order status and tracking information
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Customer Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name:</p>
                    <p className="font-medium">{selectedOrder.firstName} {selectedOrder.lastName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email:</p>
                    <p className="font-medium">{selectedOrder.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone:</p>
                    <p className="font-medium">{selectedOrder.phone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Customer Type:</p>
                    <p className="font-medium">{selectedOrder.customerType}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Package2 className="h-4 w-4" />
                  Order Items
                </h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border-b pb-2">
                      <div className="flex items-center gap-3">
                        <img src={resolveProductImage(item.image)} alt={item.name} className="w-12 h-12 object-cover rounded" />
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-semibold">${parseFloat(item.price.toString()).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>${parseFloat(selectedOrder.subtotal.toString()).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping:</span>
                    <span>${parseFloat(selectedOrder.shippingCost.toString()).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t">
                    <span>Total:</span>
                    <span>${parseFloat(selectedOrder.total.toString()).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Update Status</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="status">Order Status</Label>
                    <Select value={statusUpdate} onValueChange={setStatusUpdate}>
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="PROCESSING">Processing</SelectItem>
                        <SelectItem value="PAID">Paid</SelectItem>
                        <SelectItem value="SHIPPED">Shipped</SelectItem>
                        <SelectItem value="DELIVERED">Delivered</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleUpdateStatus}
                    disabled={updating || statusUpdate === selectedOrder.status}
                    className="w-full"
                  >
                    {updating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Update Status
                  </Button>
                </div>
              </div>

              {/* Tracking Information */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Tracking Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="tracking">Tracking Number</Label>
                    <Input
                      id="tracking"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="carrier">Carrier</Label>
                    <Input
                      id="carrier"
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      placeholder="e.g., Chilexpress, Starken, Correos Chile"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Admin Notes</Label>
                    <Textarea
                      id="notes"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Internal notes about this order"
                      rows={3}
                    />
                  </div>
                  <Button
                    onClick={handleUpdateTracking}
                    disabled={updating}
                    className="w-full"
                    variant="secondary"
                  >
                    {updating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Update Tracking
                  </Button>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Shipping Address</h3>
                <div className="text-sm space-y-1">
                  <p>{selectedOrder.shippingAddress}</p>
                  <p>{selectedOrder.shippingCity}, {selectedOrder.shippingPostalCode}</p>
                  <p>{selectedOrder.shippingCountry}</p>
                </div>
              </div>

              {/* Generate Invoice */}
              {selectedOrder.paymentStatus === 'PAID' && (
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Invoice
                  </h3>
                  <Button
                    onClick={handleGenerateInvoice}
                    disabled={generatingInvoice}
                    className="w-full"
                    variant="outline"
                  >
                    {generatingInvoice ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Generating Invoice...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Invoice
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Generate a PDF invoice for this paid order
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
