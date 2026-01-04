import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Store,
  Mail,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  Truck,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Settings2,
  Database
} from 'lucide-react';
import { toast } from 'sonner';

export const AdminSettings = () => {
  const [saving, setSaving] = useState(false);

  // Store Settings
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'V&M Candles',
    storeEmail: 'contact@vmcandles.com',
    storePhone: '+56 9 1234 5678',
    storeAddress: 'Santiago, Chile',
    currency: 'CLP',
    taxRate: '19',
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    orderConfirmation: true,
    orderShipped: true,
    newUserRegistration: true,
    lowStockAlert: true,
    subscriptionRenewal: true,
    paymentFailed: true,
  });

  // Shipping Settings (in CLP)
  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: '50000',
    standardShippingRate: '5000',
    expressShippingRate: '10000',
    internationalShipping: false,
  });

  // Feature Flags
  const [features, setFeatures] = useState({
    subscriptionsEnabled: true,
    audioExperienceEnabled: true,
    guestCheckout: false,
    reviewsEnabled: true,
    wishlistEnabled: true,
  });

  const handleSaveSettings = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    toast.success('Configuración guardada exitosamente');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground">Configuración de Tienda</h2>
          <p className="text-muted-foreground">Configura las preferencias de tu tienda V&M Candle</p>
        </div>
        <Button
          onClick={handleSaveSettings}
          disabled={saving}
          className="btn-gradient-gold"
        >
          {saving ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar Configuración
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Information */}
        <Card className="card-feminine">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-rose-gold flex items-center justify-center">
                <Store className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle>Información de Tienda</CardTitle>
                <CardDescription>Detalles básicos y contacto de la tienda</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Nombre de Tienda</Label>
              <Input
                id="storeName"
                value={storeSettings.storeName}
                onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeEmail">Email de Contacto</Label>
              <Input
                id="storeEmail"
                type="email"
                value={storeSettings.storeEmail}
                onChange={(e) => setStoreSettings({ ...storeSettings, storeEmail: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storePhone">Número de Teléfono</Label>
              <Input
                id="storePhone"
                value={storeSettings.storePhone}
                onChange={(e) => setStoreSettings({ ...storeSettings, storePhone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeAddress">Dirección</Label>
              <Textarea
                id="storeAddress"
                value={storeSettings.storeAddress}
                onChange={(e) => setStoreSettings({ ...storeSettings, storeAddress: e.target.value })}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Moneda</Label>
                <Input
                  id="currency"
                  value={storeSettings.currency}
                  onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxRate">Tasa de Impuesto (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={storeSettings.taxRate}
                  onChange={(e) => setStoreSettings({ ...storeSettings, taxRate: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="card-feminine">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-rose-gold flex items-center justify-center">
                <Bell className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle>Notificaciones por Email</CardTitle>
                <CardDescription>Configura las preferencias de notificaciones por email</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries({
              orderConfirmation: 'Confirmación de Pedido',
              orderShipped: 'Pedido Enviado',
              newUserRegistration: 'Nuevo Registro de Usuario',
              lowStockAlert: 'Alerta de Bajo Stock',
              subscriptionRenewal: 'Renovación de Suscripción',
              paymentFailed: 'Alerta de Pago Fallido',
            }).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor={key}>{label}</Label>
                  <p className="text-xs text-muted-foreground">
                    Enviar email cuando ocurra {label.toLowerCase()}
                  </p>
                </div>
                <Switch
                  id={key}
                  checked={notifications[key as keyof typeof notifications]}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, [key]: checked })
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Shipping Settings */}
        <Card className="card-feminine">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-rose-gold flex items-center justify-center">
                <Truck className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle>Configuración de Envío</CardTitle>
                <CardDescription>Configura tarifas y opciones de envío</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="freeShippingThreshold">Mínimo para Envío Gratis ($)</Label>
              <Input
                id="freeShippingThreshold"
                type="number"
                value={shippingSettings.freeShippingThreshold}
                onChange={(e) =>
                  setShippingSettings({ ...shippingSettings, freeShippingThreshold: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Pedidos sobre este monto califican para envío gratis
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="standardShippingRate">Envío Estándar ($)</Label>
                <Input
                  id="standardShippingRate"
                  type="number"
                  value={shippingSettings.standardShippingRate}
                  onChange={(e) =>
                    setShippingSettings({ ...shippingSettings, standardShippingRate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expressShippingRate">Envío Express ($)</Label>
                <Input
                  id="expressShippingRate"
                  type="number"
                  value={shippingSettings.expressShippingRate}
                  onChange={(e) =>
                    setShippingSettings({ ...shippingSettings, expressShippingRate: e.target.value })
                  }
                />
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Envío Internacional</Label>
                <p className="text-xs text-muted-foreground">
                  Habilitar envío a direcciones internacionales
                </p>
              </div>
              <Switch
                checked={shippingSettings.internationalShipping}
                onCheckedChange={(checked) =>
                  setShippingSettings({ ...shippingSettings, internationalShipping: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Feature Flags */}
        <Card className="card-feminine">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-rose-gold flex items-center justify-center">
                <Settings2 className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle>Características</CardTitle>
                <CardDescription>Habilita o deshabilita funciones de la tienda</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries({
              subscriptionsEnabled: { label: 'Suscripciones', desc: 'Permitir a clientes suscribirse a planes' },
              audioExperienceEnabled: { label: 'Experiencia de Audio', desc: 'Habilitar contenido de audio para suscriptores' },
              guestCheckout: { label: 'Compra como Invitado', desc: 'Permitir compras sin cuenta' },
              reviewsEnabled: { label: 'Reseñas de Productos', desc: 'Permitir a clientes dejar reseñas' },
              wishlistEnabled: { label: 'Lista de Deseos', desc: 'Habilitar funcionalidad de lista de deseos' },
            }).map(([key, { label, desc }]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={key}>{label}</Label>
                    {features[key as keyof typeof features] ? (
                      <Badge variant="default" className="bg-green-600 text-xs">Activo</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">Deshabilitado</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                <Switch
                  id={key}
                  checked={features[key as keyof typeof features]}
                  onCheckedChange={(checked) =>
                    setFeatures({ ...features, [key]: checked })
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="card-feminine">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-rose-gold flex items-center justify-center">
              <Database className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle>Estado del Sistema</CardTitle>
              <CardDescription>Estado de salud del sistema e integraciones</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Base de Datos', status: 'healthy', icon: Database },
              { label: 'Pagos (Webpay)', status: 'healthy', icon: CreditCard },
              { label: 'Servicio de Email', status: 'healthy', icon: Mail },
              { label: 'Certificado SSL', status: 'healthy', icon: Shield },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border/50"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  item.status === 'healthy' ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  {item.status === 'healthy' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className={`text-xs capitalize ${
                    item.status === 'healthy' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {item.status === 'healthy' ? 'Saludable' : 'Advertencia'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="card-feminine">
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>Tareas administrativas comunes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="border-gold-accent hover-glow">
              <RefreshCw className="mr-2 h-4 w-4" />
              Limpiar Caché
            </Button>
            <Button variant="outline" className="border-gold-accent hover-glow">
              <Database className="mr-2 h-4 w-4" />
              Exportar Datos
            </Button>
            <Button variant="outline" className="border-gold-accent hover-glow">
              <Mail className="mr-2 h-4 w-4" />
              Probar Email
            </Button>
            <Button variant="outline" className="border-gold-accent hover-glow">
              <Globe className="mr-2 h-4 w-4" />
              Ver Sitio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
