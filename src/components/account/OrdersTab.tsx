import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Package, FileText, Download, ChevronRight, Truck, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import * as orderService from '@/services/orderService';
import * as invoiceService from '@/services/invoiceService';
import type { Order } from '@/types';
import { resolveProductImage } from '@/lib/imageHelper';
import OrderStatusBadge from './OrderStatusBadge';
import OrderDetailsModal from './OrderDetailsModal';

const OrdersTab = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingInvoice, setGeneratingInvoice] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrders(1, 20);
      setOrders(data.orders || []);
    } catch (error: any) {
      // Only log the error, don't show toast for empty orders
      console.error('Failed to load orders:', error);
      // Don't show error toast - the UI already shows "No Orders Yet" for empty state
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      PAID: 'bg-green-100 text-green-800 border-green-200',
      FAILED: 'bg-red-100 text-red-800 border-red-200',
      REFUNDED: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    return (
      <Badge className={statusColors[status] || 'bg-gray-100 text-gray-800'} variant="outline">
        {status}
      </Badge>
    );
  };

  const getTrackingUrl = (carrier: string, trackingNumber: string) => {
    const carriers: Record<string, string> = {
      'DHL': `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`,
      'FedEx': `https://www.fedex.com/fedextrack/?tracknumbers=${trackingNumber}`,
      'UPS': `https://www.ups.com/track?tracknum=${trackingNumber}`,
      'Correos Chile': `https://www.correos.cl/SitePages/seguimiento/seguimiento.aspx?envio=${trackingNumber}`,
      'Chilexpress': `https://www.chilexpress.cl/seguimiento?codigo=${trackingNumber}`,
      'Starken': `https://www.starken.cl/seguimiento?numero=${trackingNumber}`,
    };

    return carriers[carrier] || '#';
  };

  const handleGenerateInvoice = async (orderId: string) => {
    try {
      setGeneratingInvoice(orderId);
      const response = await invoiceService.generateInvoice({ orderId });

      if (response.success && response.data) {
        toast.success('Invoice generated successfully!');
        // Open PDF in new tab
        const pdfUrl = invoiceService.getInvoicePdfUrl(response.data.invoice.id);
        window.open(pdfUrl, '_blank');
        // Reload orders to show invoice number
        await loadOrders();
      } else {
        throw new Error(response.error?.message || 'Failed to generate invoice');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate invoice');
    } finally {
      setGeneratingInvoice(null);
    }
  };

  const handleViewInvoice = async (orderId: string) => {
    try {
      const response = await invoiceService.getInvoiceByOrderId(orderId);

      if (response.success && response.data) {
        const pdfUrl = invoiceService.getInvoicePdfUrl(response.data.invoice.id);
        window.open(pdfUrl, '_blank');
      } else {
        throw new Error(response.error?.message || 'Invoice not found');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to view invoice');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="card-luxury">
        <CardContent className="py-12 text-center">
          <Package className="h-16 w-16 text-luxury mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Orders Yet</h3>
          <p className="text-luxury">Your order history will appear here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="card-luxury">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="font-serif text-xl mb-2">Order {order.id}</CardTitle>
                  <p className="text-sm text-luxury">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <OrderStatusBadge status={order.status} />
                  {getPaymentStatusBadge(order.paymentStatus)}
                </div>
              </div>
            </CardHeader>

          <CardContent>
            {/* Tracking Information */}
            {order.trackingNumber && (
              <div className="mb-4 p-4 bg-muted rounded-lg border border-border">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-sm text-luxury">Tracking Number</p>
                      <p className="font-semibold text-foreground">{order.trackingNumber}</p>
                      {order.carrier && (
                        <p className="text-sm text-luxury">Carrier: {order.carrier}</p>
                      )}
                    </div>
                  </div>
                  {order.carrier && getTrackingUrl(order.carrier, order.trackingNumber) !== '#' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(getTrackingUrl(order.carrier!, order.trackingNumber!), '_blank')}
                      className="gap-2"
                    >
                      Track Package
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Order Items - Show first 2 items */}
            <div className="space-y-3 mb-4">
              {order.items?.slice(0, 2).map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={resolveProductImage(item.product?.images?.[0] || item.image || '')}
                      alt={item.name || 'Product'}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">
                      {item.name || `Product ID: ${item.productId}`}
                    </p>
                    <p className="text-sm text-luxury">
                      Quantity: {item.quantity} × ${parseFloat(item.priceAtOrder || item.price).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-accent">
                      ${(item.quantity * parseFloat(item.priceAtOrder || item.price)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              {order.items && order.items.length > 2 && (
                <p className="text-sm text-luxury text-center">
                  +{order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Order Summary */}
            <div className="pt-4 border-t border-border">
              <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <div>
                  <p className="text-sm text-luxury">Total</p>
                  <p className="text-2xl font-semibold text-accent">
                    ${parseFloat(order.total).toFixed(2)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewDetails(order)}
                    className="gap-2"
                  >
                    View Details
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Invoice Section */}
              {order.paymentStatus === 'PAID' && (
                <div className="pt-4 border-t border-border">
                  {order.invoice ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-accent" />
                        <span className="text-luxury">
                          Invoice: <span className="font-semibold text-foreground">{order.invoice.invoiceNumber}</span>
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewInvoice(order.id)}
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download Invoice
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGenerateInvoice(order.id)}
                      disabled={generatingInvoice === order.id}
                      className="w-full gap-2"
                    >
                      {generatingInvoice === order.id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating Invoice...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4" />
                          Generate Invoice
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default OrdersTab;
