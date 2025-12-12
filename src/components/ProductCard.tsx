import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
      <div className="group card-luxury overflow-hidden">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-6">
          <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
            {name}
          </h3>
          {description && (
            <p className="text-sm text-luxury mb-4 line-clamp-2">{description}</p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold text-accent">
              ${price.toFixed(2)}
            </span>
            <Button
              onClick={handleAddToCart}
              size="sm"
              className="btn-gold group-hover:shadow-gold hover-scale"
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
