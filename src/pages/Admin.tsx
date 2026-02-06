import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  ArrowLeft,
  Loader2,
  FileText,
  Crown,
  Music,
  Sparkles,
  BarChart3,
  CreditCard,
  Truck,
  Tag,
  Trash2
} from 'lucide-react';
import { AdminProducts } from '@/components/admin/AdminProducts';
import { AdminOrders } from '@/components/admin/AdminOrders';
import { AdminUsers } from '@/components/admin/AdminUsers';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AdminInvoices } from '@/components/admin/AdminInvoices';
import AdminSubscriptions from '@/components/admin/AdminSubscriptions';
import { AdminAudioContent } from '@/components/admin/AdminAudioContent';
import { AdminAnalytics } from '@/components/admin/AdminAnalytics';
import { AdminPlans } from '@/components/admin/AdminPlans';
import { getTestModeStatus, enableTestModePrices, disableTestModePrices, resetAllProducts } from '@/services/productService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'dashboard');
  const { toast } = useToast();

  // Test mode states
  const [testModeShipping, setTestModeShipping] = useState(() => {
    return localStorage.getItem('testMode_freeShipping') === 'true';
  });
  const [testModePrices, setTestModePrices] = useState(false);
  const [testModePricesLoading, setTestModePricesLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Load test mode status on mount
  useEffect(() => {
    const loadTestModeStatus = async () => {
      try {
        const response = await getTestModeStatus();
        if (response.success) {
          setTestModePrices(response.data.testModeEnabled);
        }
      } catch (error) {
        console.error('Error loading test mode status:', error);
      }
    };
    loadTestModeStatus();
  }, []);

  const handleTestModeShippingToggle = () => {
    const newValue = !testModeShipping;
    setTestModeShipping(newValue);
    localStorage.setItem('testMode_freeShipping', String(newValue));
    toast({
      title: newValue ? 'Envío Gratis Activado' : 'Envío Gratis Desactivado',
      description: newValue
        ? 'Envío gratis para todas las compras'
        : 'Envío con costo normal restaurado',
    });
  };

  const handleTestModePricesToggle = async () => {
    setTestModePricesLoading(true);
    try {
      if (!testModePrices) {
        const response = await enableTestModePrices();
        if (response.success) {
          setTestModePrices(true);
          toast({
            title: 'Precios $0 Activado',
            description: `${response.data.productsUpdated} productos actualizados`,
          });
        }
      } else {
        const response = await disableTestModePrices();
        if (response.success) {
          setTestModePrices(false);
          toast({
            title: 'Precios $0 Desactivado',
            description: `${response.data.productsRestored} productos restaurados`,
          });
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al cambiar modo de prueba',
        variant: 'destructive',
      });
    } finally {
      setTestModePricesLoading(false);
    }
  };

  const handleResetAllProducts = async () => {
    setResetLoading(true);
    try {
      const response = await resetAllProducts();
      if (response.success) {
        toast({
          title: 'Datos Reseteados',
          description: `${response.data.deletedProducts} productos eliminados`,
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al resetear datos',
        variant: 'destructive',
      });
    } finally {
      setResetLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-oriental pattern-silk flex items-center justify-center">
        <div className="text-center animate-bloom">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4 text-accent" />
            <div className="absolute inset-0 animate-glow-pulse rounded-full" />
          </div>
          <p className="text-luxury text-lg">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  // Check if user is admin
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-oriental pattern-silk flex items-center justify-center">
        <Card className="card-feminine max-w-md mx-4 animate-bloom">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
              <Users className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-serif font-bold mb-3 text-foreground">Acceso Denegado</h1>
            <p className="text-muted-foreground mb-6">No tienes permiso para acceder a esta página.</p>
            <Button onClick={() => navigate('/')} className="btn-gradient-gold">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Ir al Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-oriental pattern-silk">
      <div className="section-padding">
        <div className="max-w-7xl mx-auto">
          {/* Header with Oriental Styling */}
          <div className="mb-8 animate-bloom">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-rose-gold flex items-center justify-center animate-gentle-pulse">
                  <Sparkles className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h1 className="font-serif text-4xl font-bold text-foreground">
                    Panel de Administración
                  </h1>
                  <p className="text-muted-foreground">Gestiona tu tienda V&M Candle</p>
                </div>
              </div>

              {/* Test Mode Controls - Warning Style */}
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  {/* Free Shipping Toggle */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleTestModeShippingToggle}
                        className={testModeShipping
                          ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500'
                          : 'border-amber-400 text-amber-600 hover:bg-amber-50 hover:text-amber-700'}
                      >
                        <Truck className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Envío Gratis {testModeShipping ? '(Activo)' : '(Inactivo)'}</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Zero Prices Toggle */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleTestModePricesToggle}
                        disabled={testModePricesLoading}
                        className={testModePrices
                          ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500'
                          : 'border-amber-400 text-amber-600 hover:bg-amber-50 hover:text-amber-700'}
                      >
                        {testModePricesLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Tag className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Precios $0 {testModePrices ? '(Activo)' : '(Inactivo)'}</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Reset All Products */}
                  <AlertDialog>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={resetLoading}
                            className="border-red-300 hover:bg-red-50 text-red-600 hover:text-red-700"
                          >
                            {resetLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Resetear Todos los Productos</p>
                      </TooltipContent>
                    </Tooltip>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción eliminará TODOS los productos, traducciones, reseñas, audio, items del carrito y wishlist.
                          Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleResetAllProducts}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Sí, eliminar todo
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TooltipProvider>

                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="border-gold-accent hover-glow transition-silk"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver a Tienda
                </Button>
              </div>
            </div>
            {/* Decorative Line */}
            <div className="line-rose-gold w-full" />
          </div>

          {/* Tabs with Enhanced Styling */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-9 lg:w-auto lg:inline-grid bg-silk-cream/50 backdrop-blur-sm border border-border/50 p-1 rounded-lg">
              <TabsTrigger
                value="dashboard"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft transition-elegant"
              >
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Panel</span>
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft transition-elegant"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Analíticas</span>
              </TabsTrigger>
              <TabsTrigger
                value="products"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft transition-elegant"
              >
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Productos</span>
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft transition-elegant"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Pedidos</span>
              </TabsTrigger>
              <TabsTrigger
                value="invoices"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft transition-elegant"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Facturas</span>
              </TabsTrigger>
              <TabsTrigger
                value="subscriptions"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft transition-elegant"
              >
                <Crown className="h-4 w-4" />
                <span className="hidden sm:inline">Suscripciones</span>
              </TabsTrigger>
              <TabsTrigger
                value="plans"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft transition-elegant"
              >
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Planes</span>
              </TabsTrigger>
              <TabsTrigger
                value="audio"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft transition-elegant"
              >
                <Music className="h-4 w-4" />
                <span className="hidden sm:inline">Audio</span>
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft transition-elegant"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Usuarios</span>
              </TabsTrigger>
            </TabsList>

            <div className="animate-fade-in">
              <TabsContent value="dashboard">
                <AdminDashboard />
              </TabsContent>

              <TabsContent value="analytics">
                <AdminAnalytics />
              </TabsContent>

              <TabsContent value="products">
                <AdminProducts />
              </TabsContent>

              <TabsContent value="orders">
                <AdminOrders />
              </TabsContent>

              <TabsContent value="invoices">
                <AdminInvoices />
              </TabsContent>

              <TabsContent value="subscriptions">
                <AdminSubscriptions />
              </TabsContent>

              <TabsContent value="plans">
                <AdminPlans />
              </TabsContent>

              <TabsContent value="audio">
                <AdminAudioContent />
              </TabsContent>

              <TabsContent value="users">
                <AdminUsers />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
