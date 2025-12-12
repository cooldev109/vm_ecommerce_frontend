import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  XCircle,
  Loader2,
  Home,
  ShoppingBag,
  Package,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { SEO } from '@/components/SEO';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { language } = useLanguage();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed' | 'error'>('loading');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(10);
  const [showConfetti, setShowConfetti] = useState(false);
  const hasRedirected = useRef(false);

  const lang = language === 'es' ? 'es' : 'en';

  const translations = {
    es: {
      processing: 'Procesando resultado del pago...',
      successTitle: '¡Pago Exitoso!',
      successSubtitle: 'Gracias por tu compra',
      successMessage: 'Tu pedido ha sido confirmado y está siendo procesado.',
      orderNumber: 'Número de Pedido',
      emailConfirmation: 'Recibirás un correo electrónico con los detalles de tu pedido y la información de seguimiento.',
      redirecting: 'Redirigiendo a la página principal en',
      seconds: 'segundos',
      viewOrders: 'Ver Mis Pedidos',
      continueShopping: 'Seguir Comprando',
      goHome: 'Ir al Inicio',
      failedTitle: 'Pago Fallido',
      failedSubtitle: 'No pudimos procesar tu pago',
      failedMessage: 'Tu pedido ha sido creado pero el pago fue rechazado. Por favor intenta de nuevo o usa otro método de pago.',
      returnToCart: 'Volver al Carrito',
      tryAgain: 'Intentar de Nuevo',
      errorTitle: 'Algo Salió Mal',
      errorSubtitle: 'Error inesperado',
      errorMessage: 'Encontramos un error procesando tu pago. Por favor contacta a soporte si se realizó algún cargo.',
      contactSupport: 'Contactar Soporte',
      seoTitle: 'Resultado del Pago',
      seoDescription: 'Resultado de tu transacción de pago',
    },
    en: {
      processing: 'Processing payment result...',
      successTitle: 'Payment Successful!',
      successSubtitle: 'Thank you for your purchase',
      successMessage: 'Your order has been confirmed and is being processed.',
      orderNumber: 'Order Number',
      emailConfirmation: 'You will receive an email confirmation with your order details and tracking information.',
      redirecting: 'Redirecting to home page in',
      seconds: 'seconds',
      viewOrders: 'View My Orders',
      continueShopping: 'Continue Shopping',
      goHome: 'Go Home',
      failedTitle: 'Payment Failed',
      failedSubtitle: 'We could not process your payment',
      failedMessage: 'Your order has been created but the payment was declined. Please try again or use a different payment method.',
      returnToCart: 'Return to Cart',
      tryAgain: 'Try Again',
      errorTitle: 'Something Went Wrong',
      errorSubtitle: 'Unexpected error',
      errorMessage: 'We encountered an error processing your payment. Please contact support if you were charged.',
      contactSupport: 'Contact Support',
      seoTitle: 'Payment Result',
      seoDescription: 'Result of your payment transaction',
    },
  };

  const t = translations[lang];

  useEffect(() => {
    const statusParam = searchParams.get('status');
    const orderIdParam = searchParams.get('orderId');

    setOrderId(orderIdParam);

    if (statusParam === 'success') {
      setStatus('success');
      setShowConfetti(true);
      clearCart();
      // Hide confetti after animation
      setTimeout(() => setShowConfetti(false), 3000);
    } else if (statusParam === 'failed') {
      setStatus('failed');
    } else if (statusParam === 'error') {
      setStatus('error');
    } else if (!hasRedirected.current) {
      hasRedirected.current = true;
      const timer = setTimeout(() => {
        navigate('/');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, clearCart, navigate]);

  // Auto-redirect countdown for success
  useEffect(() => {
    if (status === 'success' && !hasRedirected.current) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            if (!hasRedirected.current) {
              hasRedirected.current = true;
              navigate('/');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [status, navigate]);

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
            <div className="absolute inset-0 h-16 w-16 mx-auto rounded-full bg-primary/20 animate-ping" />
          </div>
          <p className="text-lg text-muted-foreground mt-6">{t.processing}</p>
        </div>
      </div>
    );
  }

  // Success state
  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-background dark:from-green-950/20 dark:to-background p-4">
        <SEO title={t.seoTitle} description={t.seoDescription} noIndex={true} />

        {/* Confetti Effect */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              >
                <Sparkles
                  className="h-4 w-4"
                  style={{
                    color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#A855F7', '#F59E0B'][
                      Math.floor(Math.random() * 5)
                    ],
                  }}
                />
              </div>
            ))}
          </div>
        )}

        <Card className="max-w-lg w-full shadow-2xl border-0 overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-8 text-white text-center">
            <div className="relative inline-block">
              <CheckCircle className="h-20 w-20 mx-auto animate-bounce-slow" />
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mt-4">{t.successTitle}</h1>
            <p className="text-green-100 mt-2">{t.successSubtitle}</p>
          </div>

          <CardContent className="p-8">
            {/* Order ID */}
            {orderId && (
              <div className="bg-muted/50 rounded-xl p-4 mb-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">{t.orderNumber}</p>
                <Badge variant="secondary" className="text-lg font-mono px-4 py-2">
                  {orderId}
                </Badge>
              </div>
            )}

            <p className="text-center text-muted-foreground mb-6">
              {t.successMessage}
            </p>

            <p className="text-center text-sm text-muted-foreground mb-6">
              {t.emailConfirmation}
            </p>

            {/* Countdown */}
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6 text-center">
              <p className="text-sm text-green-700 dark:text-green-300">
                {t.redirecting}{' '}
                <span className="inline-flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full font-bold text-lg mx-1">
                  {countdown}
                </span>{' '}
                {t.seconds}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/account?tab=orders')}
                className="w-full bg-primary hover:bg-primary/90 h-12 text-base"
              >
                <Package className="mr-2 h-5 w-5" />
                {t.viewOrders}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => navigate('/shop')}
                  variant="outline"
                  className="h-12"
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  {t.continueShopping}
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="h-12"
                >
                  <Home className="mr-2 h-4 w-4" />
                  {t.goHome}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Failed state
  if (status === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-background dark:from-red-950/20 dark:to-background p-4">
        <SEO title={t.seoTitle} description={t.seoDescription} noIndex={true} />

        <Card className="max-w-lg w-full shadow-2xl border-0 overflow-hidden">
          {/* Failed Header */}
          <div className="bg-gradient-to-r from-red-500 to-rose-500 p-8 text-white text-center">
            <XCircle className="h-20 w-20 mx-auto" />
            <h1 className="text-3xl font-bold mt-4">{t.failedTitle}</h1>
            <p className="text-red-100 mt-2">{t.failedSubtitle}</p>
          </div>

          <CardContent className="p-8">
            {/* Order ID */}
            {orderId && (
              <div className="bg-muted/50 rounded-xl p-4 mb-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">{t.orderNumber}</p>
                <Badge variant="secondary" className="text-lg font-mono px-4 py-2">
                  {orderId}
                </Badge>
              </div>
            )}

            <p className="text-center text-muted-foreground mb-8">
              {t.failedMessage}
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/checkout')}
                className="w-full bg-primary hover:bg-primary/90 h-12 text-base"
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                {t.tryAgain}
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => navigate('/cart')}
                  variant="outline"
                  className="h-12"
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  {t.returnToCart}
                </Button>
                <Button
                  onClick={() => navigate('/shop')}
                  variant="outline"
                  className="h-12"
                >
                  <Home className="mr-2 h-4 w-4" />
                  {t.continueShopping}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-background dark:from-amber-950/20 dark:to-background p-4">
      <SEO title={t.seoTitle} description={t.seoDescription} noIndex={true} />

      <Card className="max-w-lg w-full shadow-2xl border-0 overflow-hidden">
        {/* Error Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 text-white text-center">
          <AlertTriangle className="h-20 w-20 mx-auto" />
          <h1 className="text-3xl font-bold mt-4">{t.errorTitle}</h1>
          <p className="text-amber-100 mt-2">{t.errorSubtitle}</p>
        </div>

        <CardContent className="p-8">
          <p className="text-center text-muted-foreground mb-8">
            {t.errorMessage}
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => window.location.href = 'mailto:vymcandlexperience@gmail.com'}
              className="w-full bg-primary hover:bg-primary/90 h-12 text-base"
            >
              {t.contactSupport}
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => navigate('/shop')}
                variant="outline"
                className="h-12"
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                {t.continueShopping}
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="h-12"
              >
                <Home className="mr-2 h-4 w-4" />
                {t.goHome}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentResult;
