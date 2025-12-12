import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Package, MapPin, CreditCard } from 'lucide-react';
import type { Order } from '@/types';
import OrderTimeline from './OrderTimeline';
import OrderStatusBadge from './OrderStatusBadge';
import { resolveProductImage } from '@/lib/imageHelper';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsModal = ({ order, isOpen, onClose }: OrderDetailsModalProps) => {
  if (!order) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Order Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <p className="text-sm text-luxury">Order ID</p>
              <p className="text-lg font-semibold text-foreground">{order.id}</p>
              <p className="text-sm text-luxury mt-1">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="flex flex-col gap-2 items-start sm:items-end">
              <OrderStatusBadge status={order.status} />
              {getPaymentStatusBadge(order.paymentStatus)}
            </div>
          </div>

          <Separator />

          {/* Order Timeline */}
          <div>
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Package className="h-5 w-5 text-accent" />
              Order Status
            </h3>
            <OrderTimeline order={order} />
          </div>

          {/* Tracking Information */}
          {order.trackingNumber && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Package className="h-5 w-5 text-accent" />
                  Tracking Information
                </h3>
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-luxury">Tracking Number</p>
                      <p className="font-semibold text-foreground">{order.trackingNumber}</p>
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
                  {order.carrier && (
                    <div>
                      <p className="text-sm text-luxury">Carrier</p>
                      <p className="font-semibold text-foreground">{order.carrier}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Order Items */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Package className="h-5 w-5 text-accent" />
              Items
            </h3>
            <div className="space-y-3">
              {order.items?.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 bg-muted rounded-lg">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-background flex-shrink-0">
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
            </div>
          </div>

          <Separator />

          {/* Shipping & Billing Info */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Shipping Address */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-accent" />
                Shipping Address
              </h3>
              <div className="bg-muted p-4 rounded-lg space-y-1">
                <p className="font-semibold text-foreground">
                  {order.firstName} {order.lastName}
                </p>
                <p className="text-sm text-luxury">{order.shippingStreet || order.shippingAddress}</p>
                <p className="text-sm text-luxury">
                  {order.shippingCity}
                  {order.shippingRegion && `, ${order.shippingRegion}`}
                </p>
                <p className="text-sm text-luxury">
                  {order.shippingPostalCode} {order.shippingCountry}
                </p>
                {order.phone && <p className="text-sm text-luxury mt-2">{order.phone}</p>}
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-accent" />
                Payment Information
              </h3>
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-luxury">Subtotal</span>
                  <span className="text-foreground font-semibold">
                    ${parseFloat(order.subtotal).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-luxury">Shipping</span>
                  <span className="text-foreground font-semibold">
                    ${parseFloat(order.shippingCost).toFixed(2)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-foreground font-semibold">Total</span>
                  <span className="text-accent font-bold text-lg">
                    ${parseFloat(order.total).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
