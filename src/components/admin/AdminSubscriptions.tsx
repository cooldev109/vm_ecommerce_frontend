import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Loader2, Crown, TrendingUp, Users, DollarSign, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  getAllSubscriptions,
  getSubscriptionAnalytics,
  type Subscription,
  type SubscriptionAnalytics,
} from '@/services/subscriptionService';

const PLAN_NAMES = {
  WEEKLY: 'Semanal',
  MONTHLY: 'Mensual',
  QUARTERLY: 'Trimestral',
};

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<SubscriptionAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [page, statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [subscriptionsData, analyticsData] = await Promise.all([
        getAllSubscriptions(page, 20, statusFilter || undefined),
        getSubscriptionAnalytics(),
      ]);
      setSubscriptions(subscriptionsData.subscriptions);
      setPagination(subscriptionsData.pagination);
      setAnalytics(analyticsData);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al cargar datos de suscripciones',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    const formatted = new Intl.NumberFormat('es-CL', {
      minimumFractionDigits: 0,
    }).format(price);
    return `CLP $${formatted}`;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive'; label: string }> = {
      ACTIVE: { variant: 'default', label: 'Activa' },
      PAUSED: { variant: 'secondary', label: 'Pausada' },
      CANCELLED: { variant: 'destructive', label: 'Cancelada' },
      EXPIRED: { variant: 'destructive', label: 'Expirada' },
    };

    const config = variants[status] || variants.EXPIRED;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPlanBadge = (planId: string) => {
    const colors: Record<string, string> = {
      WEEKLY: 'bg-green-100 text-green-800',
      MONTHLY: 'bg-blue-100 text-blue-800',
      QUARTERLY: 'bg-purple-100 text-purple-800',
    };

    return (
      <Badge className={colors[planId] || 'bg-gray-100 text-gray-800'}>
        {PLAN_NAMES[planId as keyof typeof PLAN_NAMES]}
      </Badge>
    );
  };

  if (loading && !analytics) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      {analytics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suscripciones Activas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.summary.totalActive}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.summary.totalSubscriptions} en total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Mensuales Recurrentes</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(analytics.revenue.mrr)}</div>
              <p className="text-xs text-muted-foreground">MRR</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Anuales Recurrentes</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(analytics.revenue.arr)}</div>
              <p className="text-xs text-muted-foreground">ARR</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Desglose por Plan</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Semanal:</span>
                  <span className="font-medium">{analytics.planBreakdown.weekly}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Mensual:</span>
                  <span className="font-medium">{analytics.planBreakdown.monthly}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Trimestral:</span>
                  <span className="font-medium">{analytics.planBreakdown.quarterly}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Todas las Suscripciones</CardTitle>
              <CardDescription>
                Administra y monitorea las suscripciones de clientes
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === "all" ? "" : value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Estados</SelectItem>
                  <SelectItem value="ACTIVE">Activa</SelectItem>
                  <SelectItem value="PAUSED">Pausada</SelectItem>
                  <SelectItem value="CANCELLED">Cancelada</SelectItem>
                  <SelectItem value="EXPIRED">Expirada</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={loadData} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron suscripciones
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Inicio</TableHead>
                    <TableHead>Próxima Renovación</TableHead>
                    <TableHead>Auto-Renovar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell className="font-medium">
                        {subscription.user?.profile
                          ? `${subscription.user.profile.firstName} ${subscription.user.profile.lastName}`
                          : 'N/A'}
                      </TableCell>
                      <TableCell>{subscription.user?.email || 'N/A'}</TableCell>
                      <TableCell>{getPlanBadge(subscription.planId)}</TableCell>
                      <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                      <TableCell>
                        {format(new Date(subscription.startedAt), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        {format(new Date(subscription.nextRenewal), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={subscription.autoRenew ? 'default' : 'secondary'}>
                          {subscription.autoRenew ? 'Sí' : 'No'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {(pagination.page - 1) * pagination.limit + 1} a{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
                    {pagination.total} suscripciones
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1 || loading}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page === pagination.pages || loading}
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

      {/* Recent Subscriptions */}
      {analytics && analytics.recentSubscriptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Suscripciones Recientes</CardTitle>
            <CardDescription>Últimas activaciones de suscripciones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.recentSubscriptions.slice(0, 5).map((subscription) => (
                <div
                  key={subscription.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Crown className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {subscription.user.profile.firstName} {subscription.user.profile.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{subscription.user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {getPlanBadge(subscription.planId)}
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(new Date(subscription.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
