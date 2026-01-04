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
        description: error.message || 'Error al cargar clientes',
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
        description: error.message || 'Error al cargar detalles del cliente',
        variant: 'destructive',
      });
      setDetailsDialogOpen(false);
    } finally {
      setLoadingDetails(false);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'Nunca';
    return new Date(date).toLocaleDateString('es-CL', {
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
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Clientes</CardTitle>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.customersWithOrders} con pedidos
              </p>
            </CardContent>
          </Card>

          <Card className="card-feminine group hover-rose-glow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Nuevos Este Mes</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.newCustomersThisMonth}</div>
              <p className="text-xs text-muted-foreground mt-1">Nuevos registros</p>
            </CardContent>
          </Card>

          <Card className="card-feminine group hover-rose-glow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Tasa de Retención</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.customerRetentionRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.repeatCustomers} clientes recurrentes
              </p>
            </CardContent>
          </Card>

          <Card className="card-feminine group hover-rose-glow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Mejor Cliente</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              {stats.topCustomers.length > 0 ? (
                <>
                  <div className="text-xl font-bold text-purple-600">
                    {formatCurrency(stats.topCustomers[0].totalSpent)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {stats.topCustomers[0].name || stats.topCustomers[0].email}
                  </p>
                </>
              ) : (
                <div className="text-xl font-bold text-muted-foreground">Sin datos</div>
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
                <CardTitle>Mejores Clientes por Gasto</CardTitle>
                <CardDescription>Tus clientes más valiosos</CardDescription>
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
                      <p className="font-medium">{customer.name || 'Desconocido'}</p>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatCurrency(customer.totalSpent)}</p>
                    <p className="text-sm text-muted-foreground">{customer.orderCount} pedidos</p>
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
                <CardTitle>Todos los Clientes</CardTitle>
                <CardDescription>Ver y gestionar información de clientes</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Search */}
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Buscar por nombre o email..."
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
                <p className="text-muted-foreground mt-2">Cargando clientes...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-md border border-border/50">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead className="text-right">Total Pedidos</TableHead>
                      <TableHead className="text-right">Total Gastado</TableHead>
                      <TableHead className="text-right">Promedio</TableHead>
                      <TableHead>Último Pedido</TableHead>
                      <TableHead>Registrado</TableHead>
                      <TableHead className="w-[100px]">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                          <UsersIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No se encontraron clientes</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      customers.map((customer) => (
                        <TableRow key={customer.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium">
                            <div>
                              <p>{customer.firstName || customer.lastName
                                ? `${customer.firstName} ${customer.lastName}`.trim()
                                : 'Sin nombre'}</p>
                              {customer.customerType === 'BUSINESS' && (
                                <Badge variant="secondary" className="mt-1">Empresa</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                          <TableCell>
                            {customer.role === 'ADMIN' ? (
                              <Badge variant="default" className="bg-purple-600">Admin</Badge>
                            ) : (
                              <Badge variant="outline">Usuario</Badge>
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
                              title="Ver detalles"
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
                    Página {page} de {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Siguiente
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
            <DialogTitle>Detalles del Cliente</DialogTitle>
            <DialogDescription>
              Perfil completo e historial de pedidos
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
                  <h3 className="font-semibold mb-4">Información del Perfil</h3>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Nombre</dt>
                      <dd className="font-medium">
                        {selectedCustomer.profile.firstName} {selectedCustomer.profile.lastName}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Email</dt>
                      <dd className="font-medium">{selectedCustomer.email}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Teléfono</dt>
                      <dd className="font-medium">{selectedCustomer.profile.phone || 'N/D'}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Tipo de Cliente</dt>
                      <dd>
                        <Badge variant="secondary">{selectedCustomer.profile.customerType}</Badge>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Rol</dt>
                      <dd>
                        {selectedCustomer.role === 'ADMIN' ? (
                          <Badge className="bg-purple-600">Admin</Badge>
                        ) : (
                          <Badge variant="outline">Usuario</Badge>
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Estadísticas</h3>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Total Pedidos</dt>
                      <dd className="font-medium text-lg">{selectedCustomer.statistics.totalOrders}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Valor de Por Vida</dt>
                      <dd className="font-medium text-lg text-green-600">
                        {formatCurrency(selectedCustomer.statistics.lifetimeValue)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Valor Promedio de Pedido</dt>
                      <dd className="font-medium">{formatCurrency(selectedCustomer.statistics.avgOrderValue)}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Último Pedido</dt>
                      <dd className="font-medium">{formatDate(selectedCustomer.statistics.lastOrderDate)}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Fecha de Registro</dt>
                      <dd className="font-medium">{formatDate(selectedCustomer.registrationDate)}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Order History */}
              <div>
                <h3 className="font-semibold mb-4">Historial de Pedidos</h3>
                {selectedCustomer.orderHistory.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-8">Sin pedidos aún</p>
                ) : (
                  <div className="rounded-md border border-border/50">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID Pedido</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Pago</TableHead>
                          <TableHead className="text-right">Items</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead>Fecha</TableHead>
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
