import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Edit, Star, Crown, Sparkles, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface PlanConfig {
  id: string;
  price: number;
  nameEn: string;
  nameEs: string;
  billingPeriodEn: string;
  billingPeriodEs: string;
  featuresEn: string[];
  featuresEs: string[];
  isPopular: boolean;
  isBestValue: boolean;
  isActive: boolean;
  sortOrder: number;
}

// Fetch admin plan configs
async function getAdminPlanConfigs() {
  return api.get<{ plans: PlanConfig[] }>('/subscriptions/admin/plans');
}

// Update plan config
async function updatePlanConfig(planId: string, data: Partial<PlanConfig>) {
  return api.put<{ plan: PlanConfig }>(`/subscriptions/admin/plans/${planId}`, data);
}

// Initialize default plan configs
async function initializePlanConfigs() {
  return api.post<{ message: string }>('/subscriptions/admin/plans/initialize');
}

export const AdminPlans = () => {
  const queryClient = useQueryClient();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanConfig | null>(null);

  // Form state
  const [price, setPrice] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameEs, setNameEs] = useState('');
  const [billingPeriodEn, setBillingPeriodEn] = useState('');
  const [billingPeriodEs, setBillingPeriodEs] = useState('');
  const [featuresEn, setFeaturesEn] = useState('');
  const [featuresEs, setFeaturesEs] = useState('');
  const [isPopular, setIsPopular] = useState(false);
  const [isBestValue, setIsBestValue] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState('');

  // Fetch plans
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-plans'],
    queryFn: getAdminPlanConfigs,
  });

  const plans = data?.data?.plans || [];

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ planId, data }: { planId: string; data: Partial<PlanConfig> }) =>
      updatePlanConfig(planId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
      toast.success('Plan actualizado exitosamente');
      setEditDialogOpen(false);
      setEditingPlan(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Error al actualizar plan');
    },
  });

  // Initialize mutation
  const initMutation = useMutation({
    mutationFn: initializePlanConfigs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
      toast.success('Planes inicializados exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Error al inicializar planes');
    },
  });

  // Load plan data into form
  useEffect(() => {
    if (editingPlan) {
      setPrice(editingPlan.price.toString());
      setNameEn(editingPlan.nameEn);
      setNameEs(editingPlan.nameEs);
      setBillingPeriodEn(editingPlan.billingPeriodEn);
      setBillingPeriodEs(editingPlan.billingPeriodEs);
      setFeaturesEn(editingPlan.featuresEn.join('\n'));
      setFeaturesEs(editingPlan.featuresEs.join('\n'));
      setIsPopular(editingPlan.isPopular);
      setIsBestValue(editingPlan.isBestValue);
      setIsActive(editingPlan.isActive);
      setSortOrder(editingPlan.sortOrder.toString());
    }
  }, [editingPlan]);

  const handleEditPlan = (plan: PlanConfig) => {
    setEditingPlan(plan);
    setEditDialogOpen(true);
  };

  const handleSavePlan = () => {
    if (!editingPlan) return;

    updateMutation.mutate({
      planId: editingPlan.id,
      data: {
        price: parseInt(price),
        nameEn,
        nameEs,
        billingPeriodEn,
        billingPeriodEs,
        featuresEn: featuresEn.split('\n').filter(f => f.trim()),
        featuresEs: featuresEs.split('\n').filter(f => f.trim()),
        isPopular,
        isBestValue,
        isActive,
        sortOrder: parseInt(sortOrder) || 0,
      },
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'WEEKLY':
        return <Star className="h-5 w-5" />;
      case 'MONTHLY':
        return <Sparkles className="h-5 w-5" />;
      case 'QUARTERLY':
        return <Crown className="h-5 w-5" />;
      default:
        return <Star className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Planes de Suscripción</CardTitle>
              <CardDescription>Administra los precios y características de los planes</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => refetch()}
                disabled={isLoading}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
              {plans.length === 0 && (
                <Button
                  className="btn-luxury"
                  onClick={() => initMutation.mutate()}
                  disabled={initMutation.isPending}
                >
                  {initMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Inicializar Planes
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {plans.length === 0 ? (
            <div className="text-center py-12">
              <Crown className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No hay planes configurados</h3>
              <p className="text-muted-foreground mb-4">
                Haz clic en "Inicializar Planes" para crear la configuración predeterminada
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative ${!plan.isActive ? 'opacity-60' : ''} ${
                    plan.isPopular ? 'ring-2 ring-accent' : ''
                  }`}
                >
                  {plan.isPopular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent">
                      Popular
                    </Badge>
                  )}
                  {plan.isBestValue && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600">
                      Mejor Valor
                    </Badge>
                  )}

                  <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                      {getPlanIcon(plan.id)}
                    </div>
                    <CardTitle className="text-lg">{plan.nameEs}</CardTitle>
                    <CardDescription>{plan.billingPeriodEs}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <span className="text-3xl font-bold">{formatPrice(plan.price)}</span>
                      <span className="text-muted-foreground text-sm">/{plan.billingPeriodEs}</span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Características:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {plan.featuresEs.slice(0, 3).map((feature, index) => (
                          <li key={index} className="truncate">• {feature}</li>
                        ))}
                        {plan.featuresEs.length > 3 && (
                          <li className="text-accent">+ {plan.featuresEs.length - 3} más...</li>
                        )}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Estado:</span>
                      <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                        {plan.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleEditPlan(plan)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar Plan
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Plan Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Plan: {editingPlan?.nameEs}</DialogTitle>
            <DialogDescription>
              Actualiza el precio y características del plan de suscripción
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Precio (CLP) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="9990"
                />
              </div>
              <div>
                <Label htmlFor="sortOrder">Orden</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  placeholder="1"
                />
              </div>
            </div>

            {/* Names */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nameEn">Nombre (EN)</Label>
                <Input
                  id="nameEn"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="Monthly Premium"
                />
              </div>
              <div>
                <Label htmlFor="nameEs">Nombre (ES)</Label>
                <Input
                  id="nameEs"
                  value={nameEs}
                  onChange={(e) => setNameEs(e.target.value)}
                  placeholder="Premium Mensual"
                />
              </div>
            </div>

            {/* Billing Period */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="billingPeriodEn">Período de Facturación (EN)</Label>
                <Input
                  id="billingPeriodEn"
                  value={billingPeriodEn}
                  onChange={(e) => setBillingPeriodEn(e.target.value)}
                  placeholder="month"
                />
              </div>
              <div>
                <Label htmlFor="billingPeriodEs">Período de Facturación (ES)</Label>
                <Input
                  id="billingPeriodEs"
                  value={billingPeriodEs}
                  onChange={(e) => setBillingPeriodEs(e.target.value)}
                  placeholder="mes"
                />
              </div>
            </div>

            {/* Features EN */}
            <div>
              <Label htmlFor="featuresEn">Características (EN - una por línea)</Label>
              <Textarea
                id="featuresEn"
                value={featuresEn}
                onChange={(e) => setFeaturesEn(e.target.value)}
                placeholder="Unlimited access to all audio experiences&#10;Early access to new candle releases"
                rows={5}
              />
            </div>

            {/* Features ES */}
            <div>
              <Label htmlFor="featuresEs">Características (ES - una por línea)</Label>
              <Textarea
                id="featuresEs"
                value={featuresEs}
                onChange={(e) => setFeaturesEs(e.target.value)}
                placeholder="Acceso ilimitado a todas las experiencias de audio&#10;Acceso anticipado a nuevos lanzamientos"
                rows={5}
              />
            </div>

            {/* Switches */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="isActive">Activo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPopular"
                  checked={isPopular}
                  onCheckedChange={setIsPopular}
                />
                <Label htmlFor="isPopular">Popular</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isBestValue"
                  checked={isBestValue}
                  onCheckedChange={setIsBestValue}
                />
                <Label htmlFor="isBestValue">Mejor Valor</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={updateMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              className="btn-luxury"
              onClick={handleSavePlan}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
