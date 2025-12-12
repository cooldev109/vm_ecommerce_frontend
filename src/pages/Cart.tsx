import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Trash2, ShoppingBag } from 'lucide-react';
import { resolveProductImage } from '@/lib/imageHelper';

const Cart = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { items, removeItem, updateQuantity, total } = useCart();

  const shippingCost = total > 100 ? 0 : 10;
  const finalTotal = total + shippingCost;

  return (
    <div className="min-h-screen section-padding">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-12 text-center">
          {t('yourCart')}
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <ShoppingBag className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
            <p className="text-xl text-luxury mb-8">{t('emptyCart')}</p>
            <Button onClick={() => navigate('/shop')} className="btn-luxury">
              {t('continueShopping')}
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Cart Items */}
            {items.map((item, index) => (
              <div
                key={item.id || `cart-item-${index}`}
                className="card-luxury p-6 flex flex-col md:flex-row gap-6 animate-fade-in"
              >
                <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={resolveProductImage(item.image)}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                    {item.name}
                  </h3>
                  <p className="text-lg font-semibold text-accent mb-4">
                    ${item.price.toFixed(2)}
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-border rounded-md">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-muted transition-colors"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 border-x border-border">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-muted transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="text-right md:text-left">
                  <p className="text-lg font-semibold text-foreground">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}

            {/* Order Summary */}
            <div className="card-luxury p-8">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
                {t('orderSummary')}
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-lg">
                  <span className="text-luxury">{t('subtotal')}</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-luxury">{t('shipping')}</span>
                  <span className="font-semibold">
                    {shippingCost === 0 ? t('free') : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                {total > 100 && (
                  <p className="text-sm text-accent">
                    {t('freeShippingOver100')}
                  </p>
                )}
                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between text-xl font-semibold">
                    <span>{t('total')}</span>
                    <span className="text-accent">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/checkout')}
                  className="btn-luxury w-full"
                >
                  {t('checkout')}
                </Button>
                <Button
                  onClick={() => navigate('/shop')}
                  variant="outline"
                  className="w-full"
                >
                  {t('continueShopping')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
