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
import { formatCurrency } from '@/lib/utils';

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
        description: error.message || 'Error al cargar pedidos',
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
        title: 'Éxito',
        description: 'Estado del pedido actualizado exitosamente',
      });
      await loadOrders();
      setDialogOpen(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al actualizar estado del pedido',
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
        title: 'Éxito',
        description: 'Información de seguimiento actualizada exitosamente',
      });
      await loadOrders();
      setDialogOpen(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al actualizar seguimiento',
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
        title: 'Éxito',
        description: 'Factura generada exitosamente',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error?.message || 'Error al generar factura',
        variant: 'destructive',
      });
    } finally {
      setGeneratingInvoice(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-yellow-100">Pendiente</Badge>;
      case 'PROCESSING':
        return <Badge variant="outline" className="bg-blue-100">Procesando</Badge>;
      case 'PAID':
        return <Badge variant="default" className="bg-green-600">Pagado</Badge>;
      case 'SHIPPED':
        return <Badge variant="secondary">Enviado</Badge>;
      case 'DELIVERED':
        return <Badge variant="default" className="bg-emerald-600">Entregado</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline">Pendiente</Badge>;
      case 'PAID':
        return <Badge variant="default" className="bg-green-600">Pagado</Badge>;
      case 'FAILED':
        return <Badge variant="destructive">Fallido</Badge>;
      case 'REFUNDED':
        return <Badge variant="secondary">Reembolsado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Pedidos</CardTitle>
          <CardDescription>Administra pedidos y seguimiento de clientes</CardDescription>
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
                    <TableHead>ID Pedido</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Pago</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="w-[100px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        No se encontraron pedidos
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
                        <TableCell className="font-semibold">{formatCurrency(parseFloat(order.total.toString()))}</TableCell>
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
            <DialogTitle>Detalles del Pedido - {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Administrar estado del pedido e información de seguimiento
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Información del Cliente</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Nombre:</p>
                    <p className="font-medium">{selectedOrder.firstName} {selectedOrder.lastName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email:</p>
                    <p className="font-medium">{selectedOrder.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Teléfono:</p>
                    <p className="font-medium">{selectedOrder.phone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tipo de Cliente:</p>
                    <p className="font-medium">{selectedOrder.customerType}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Package2 className="h-4 w-4" />
                  Items del Pedido
                </h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border-b pb-2">
                      <div className="flex items-center gap-3">
                        <img src={resolveProductImage(item.image)} alt={item.name} className="w-12 h-12 object-cover rounded" />
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Cant: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-semibold">{formatCurrency(parseFloat(item.price.toString()))}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>{formatCurrency(parseFloat(selectedOrder.subtotal.toString()))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Envío:</span>
                    <span>{formatCurrency(parseFloat(selectedOrder.shippingCost.toString()))}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t">
                    <span>Total:</span>
                    <span>{formatCurrency(parseFloat(selectedOrder.total.toString()))}</span>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Actualizar Estado</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="status">Estado del Pedido</Label>
                    <Select value={statusUpdate} onValueChange={setStatusUpdate}>
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pendiente</SelectItem>
                        <SelectItem value="PROCESSING">Procesando</SelectItem>
                        <SelectItem value="PAID">Pagado</SelectItem>
                        <SelectItem value="SHIPPED">Enviado</SelectItem>
                        <SelectItem value="DELIVERED">Entregado</SelectItem>
                        <SelectItem value="CANCELLED">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleUpdateStatus}
                    disabled={updating || statusUpdate === selectedOrder.status}
                    className="w-full"
                  >
                    {updating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Actualizar Estado
                  </Button>
                </div>
              </div>

              {/* Tracking Information */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Información de Seguimiento
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="tracking">Número de Seguimiento</Label>
                    <Input
                      id="tracking"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Ingrese número de seguimiento"
                    />
                  </div>
                  <div>
                    <Label htmlFor="carrier">Transportista</Label>
                    <Input
                      id="carrier"
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      placeholder="ej., Chilexpress, Starken, Correos Chile"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notas del Admin</Label>
                    <Textarea
                      id="notes"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Notas internas sobre este pedido"
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
                    Actualizar Seguimiento
                  </Button>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Dirección de Envío</h3>
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
                    Factura
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
                        Generando Factura...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Generar Factura
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Genera una factura PDF para este pedido pagado
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
