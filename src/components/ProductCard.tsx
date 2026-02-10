import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
}

export const ProductCard = ({ id, name, price, image, description }: ProductCardProps) => {
  const { t } = useLanguage();
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ id, name, price, image });
    toast.success(t('addToCart'), {
      description: name,
    });
  };

  return (
    <Link to={`/product/${id}`}>
      <div className="group card-luxury overflow-hidden h-full flex flex-col">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-serif text-lg font-semibold text-foreground mb-1 line-clamp-1">
            {name}
          </h3>
          {description && (
            <p className="text-sm text-luxury mb-3 line-clamp-2">{description}</p>
          )}
          <div className="mt-auto pt-3 border-t border-border/50">
            <span className="block text-2xl font-bold text-accent mb-3">
              {formatCurrency(price)}
            </span>
            <Button
              onClick={handleAddToCart}
              size="sm"
              className="w-full bg-accent text-accent-foreground rounded font-medium tracking-wide uppercase text-xs py-2.5 transition-all duration-300 hover:opacity-90 hover:shadow-md"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {t('addToCart')}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};
