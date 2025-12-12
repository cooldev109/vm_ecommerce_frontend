import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ShoppingCart,
  Package,
  Music,
  Heart,
  Search,
  Headphones,
  Sparkles,
  ShoppingBag,
  FileText,
  Users,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

const EmptyStateBase = ({
  title,
  description,
  icon,
  action,
  secondaryAction,
}: EmptyStateProps) => (
  <Card className="border-dashed">
    <CardContent className="py-16 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">{description}</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {action && (
          action.href ? (
            <Link to={action.href}>
              <Button className="gap-2">
                {action.label}
              </Button>
            </Link>
          ) : (
            <Button onClick={action.onClick} className="gap-2">
              {action.label}
            </Button>
          )
        )}
        {secondaryAction && (
          secondaryAction.href ? (
            <Link to={secondaryAction.href}>
              <Button variant="outline" className="gap-2">
                {secondaryAction.label}
              </Button>
            </Link>
          ) : (
            <Button variant="outline" onClick={secondaryAction.onClick} className="gap-2">
              {secondaryAction.label}
            </Button>
          )
        )}
      </div>
    </CardContent>
  </Card>
);

// Empty Cart
export const EmptyCart = () => {
  const { language } = useLanguage();
  const isEs = language === 'es';

  return (
    <EmptyStateBase
      icon={<ShoppingCart className="h-10 w-10 text-muted-foreground" />}
      title={isEs ? 'Tu carrito está vacío' : 'Your cart is empty'}
      description={
        isEs
          ? 'Parece que aún no has agregado ningún producto a tu carrito. Explora nuestra colección de velas artesanales.'
          : "Looks like you haven't added any products to your cart yet. Explore our collection of artisanal candles."
      }
      action={{
        label: isEs ? 'Explorar Tienda' : 'Explore Shop',
        href: '/shop',
      }}
      secondaryAction={{
        label: isEs ? 'Ver Suscripciones' : 'View Subscriptions',
        href: '/subscriptions',
      }}
    />
  );
};

// Empty Orders
export const EmptyOrders = () => {
  const { language } = useLanguage();
  const isEs = language === 'es';

  return (
    <EmptyStateBase
      icon={<Package className="h-10 w-10 text-muted-foreground" />}
      title={isEs ? 'Sin pedidos aún' : 'No orders yet'}
      description={
        isEs
          ? 'Tu historial de pedidos aparecerá aquí una vez que realices tu primera compra.'
          : 'Your order history will appear here once you make your first purchase.'
      }
      action={{
        label: isEs ? 'Comenzar a Comprar' : 'Start Shopping',
        href: '/shop',
      }}
    />
  );
};

// Empty Audio Library
export const EmptyAudioLibrary = () => {
  const { language } = useLanguage();
  const isEs = language === 'es';

  return (
    <EmptyStateBase
      icon={<Headphones className="h-10 w-10 text-muted-foreground" />}
      title={isEs ? 'Sin acceso al audio' : 'No audio access'}
      description={
        isEs
          ? 'Suscríbete para desbloquear nuestra biblioteca exclusiva de experiencias de audio, meditaciones guiadas y paisajes sonoros.'
          : 'Subscribe to unlock our exclusive library of audio experiences, guided meditations, and ambient soundscapes.'
      }
      action={{
        label: isEs ? 'Ver Planes' : 'View Plans',
        href: '/subscriptions',
      }}
      secondaryAction={{
        label: isEs ? 'Usar Código' : 'Use Access Code',
        href: '/audio',
      }}
    />
  );
};

// Empty Search Results
export const EmptySearchResults = ({ query }: { query?: string }) => {
  const { language } = useLanguage();
  const isEs = language === 'es';

  return (
    <EmptyStateBase
      icon={<Search className="h-10 w-10 text-muted-foreground" />}
      title={isEs ? 'Sin resultados' : 'No results found'}
      description={
        isEs
          ? query
            ? `No encontramos productos que coincidan con "${query}". Intenta con otros términos de búsqueda.`
            : 'No encontramos productos que coincidan con tu búsqueda.'
          : query
            ? `We couldn't find any products matching "${query}". Try different search terms.`
            : "We couldn't find any products matching your search."
      }
      action={{
        label: isEs ? 'Ver Todos los Productos' : 'View All Products',
        href: '/shop',
      }}
    />
  );
};

// Empty Wishlist
export const EmptyWishlist = () => {
  const { language } = useLanguage();
  const isEs = language === 'es';

  return (
    <EmptyStateBase
      icon={<Heart className="h-10 w-10 text-muted-foreground" />}
      title={isEs ? 'Lista de deseos vacía' : 'Wishlist is empty'}
      description={
        isEs
          ? 'Guarda tus productos favoritos aquí para encontrarlos fácilmente más tarde.'
          : 'Save your favorite products here to easily find them later.'
      }
      action={{
        label: isEs ? 'Descubrir Productos' : 'Discover Products',
        href: '/shop',
      }}
    />
  );
};

// Empty Subscription
export const EmptySubscription = () => {
  const { language } = useLanguage();
  const isEs = language === 'es';

  return (
    <EmptyStateBase
      icon={<Sparkles className="h-10 w-10 text-muted-foreground" />}
      title={isEs ? 'Sin suscripción activa' : 'No active subscription'}
      description={
        isEs
          ? 'Únete a nuestra comunidad premium para acceder a contenido exclusivo, descuentos especiales y experiencias de audio únicas.'
          : 'Join our premium community to access exclusive content, special discounts, and unique audio experiences.'
      }
      action={{
        label: isEs ? 'Ver Planes Premium' : 'View Premium Plans',
        href: '/subscriptions',
      }}
    />
  );
};

// Empty Invoices
export const EmptyInvoices = () => {
  const { language } = useLanguage();
  const isEs = language === 'es';

  return (
    <EmptyStateBase
      icon={<FileText className="h-10 w-10 text-muted-foreground" />}
      title={isEs ? 'Sin facturas' : 'No invoices'}
      description={
        isEs
          ? 'Tus facturas aparecerán aquí después de completar un pedido.'
          : 'Your invoices will appear here after completing an order.'
      }
      action={{
        label: isEs ? 'Ver Tienda' : 'Browse Shop',
        href: '/shop',
      }}
    />
  );
};

// Empty Products (Admin)
export const EmptyProducts = () => {
  const { language } = useLanguage();
  const isEs = language === 'es';

  return (
    <EmptyStateBase
      icon={<ShoppingBag className="h-10 w-10 text-muted-foreground" />}
      title={isEs ? 'Sin productos' : 'No products'}
      description={
        isEs
          ? 'Aún no hay productos en el catálogo. Agrega tu primer producto para comenzar.'
          : 'No products in the catalog yet. Add your first product to get started.'
      }
      action={{
        label: isEs ? 'Agregar Producto' : 'Add Product',
        href: '/admin?tab=products',
      }}
    />
  );
};

// Empty Users (Admin)
export const EmptyUsers = () => {
  const { language } = useLanguage();
  const isEs = language === 'es';

  return (
    <EmptyStateBase
      icon={<Users className="h-10 w-10 text-muted-foreground" />}
      title={isEs ? 'Sin usuarios' : 'No users'}
      description={
        isEs
          ? 'Los usuarios registrados aparecerán aquí.'
          : 'Registered users will appear here.'
      }
    />
  );
};

// Generic Empty State
export const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}) => (
  <EmptyStateBase
    icon={icon || <Package className="h-10 w-10 text-muted-foreground" />}
    title={title}
    description={description}
    action={
      actionLabel
        ? {
            label: actionLabel,
            href: actionHref,
            onClick: onAction,
          }
        : undefined
    }
  />
);
