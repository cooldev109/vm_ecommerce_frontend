import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { CreditCard, Loader2, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import * as addressService from '@/services/authService';
import * as orderService from '@/services/orderService';
import * as paymentService from '@/services/paymentService';
import type { Address } from '@/types';
import { resolveProductImage } from '@/lib/imageHelper';

const Checkout = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { items, total } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedShippingId, setSelectedShippingId] = useState<string>('');
  const [selectedBillingId, setSelectedBillingId] = useState<string>('');
  const [sameAsShipping, setSameAsShipping] = useState(true);

  const shippingCost = total >= 50 ? 0 : 5; // Free shipping over $50
  const finalTotal = total + shippingCost;

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to checkout');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items.length, navigate]);

  // Load user addresses
  useEffect(() => {
    if (isAuthenticated) {
      loadAddresses();
    }
  }, [isAuthenticated]);

  const loadAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const response = await addressService.getAddresses();
      if (response.success && response.data) {
        setAddresses(response.data.addresses);

        // Auto-select default addresses
        const defaultShipping = response.data.addresses.find(
          (addr: Address) => addr.type === 'SHIPPING' && addr.isDefault
        );
        const defaultBilling = response.data.addresses.find(
          (addr: Address) => addr.type === 'BILLING' && addr.isDefault
        );

        if (defaultShipping) setSelectedShippingId(defaultShipping.id);
        if (defaultBilling) setSelectedBillingId(defaultBilling.id);
      }
    } catch (error) {
      toast.error('Failed to load addresses');
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedShippingId) {
      toast.error('Please select a shipping address');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create order
      console.log('Creating order with addresses:', {
        shippingAddressId: selectedShippingId,
        billingAddressId: sameAsShipping ? selectedShippingId : selectedBillingId || selectedShippingId,
      });

      const checkoutResponse = await orderService.checkout({
        shippingAddressId: selectedShippingId,
        billingAddressId: sameAsShipping ? selectedShippingId : selectedBillingId || selectedShippingId,
      });

      console.log('Checkout response:', checkoutResponse);

      if (!checkoutResponse.success || !checkoutResponse.data) {
        const errorMsg = checkoutResponse.error?.message || 'Checkout failed';
        console.error('Checkout error:', checkoutResponse.error);
        throw new Error(errorMsg);
      }

      const orderId = checkoutResponse.data.order.id;

      // Step 2: Initialize WebPay payment
      const paymentResponse = await paymentService.initWebpayPayment({ orderId });

      if (!paymentResponse.success || !paymentResponse.data) {
        throw new Error(paymentResponse.error?.message || 'Payment initialization failed');
      }

      // Step 3: Redirect to WebPay
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = paymentResponse.data.url;

      const tokenInput = document.createElement('input');
      tokenInput.type = 'hidden';
      tokenInput.name = 'token_ws';
      tokenInput.value = paymentResponse.data.token;

      form.appendChild(tokenInput);
      document.body.appendChild(form);
      form.submit();

    } catch (error: any) {
      toast.error(error.message || 'Checkout failed');
      setLoading(false);
    }
  };

  const shippingAddresses = addresses.filter(addr => addr.type === 'SHIPPING');
  const billingAddresses = addresses.filter(addr => addr.type === 'BILLING');

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen section-padding">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-12 text-center">
          {t('checkout')}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div className="animate-slide-up">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Address */}
              <div className="card-luxury p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-2xl font-semibold text-foreground">
                    {t('shippingAddress')}
                  </h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/account?tab=addresses')}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Manage Addresses
                  </Button>
                </div>

                {loadingAddresses ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-accent" />
                  </div>
                ) : shippingAddresses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-luxury mb-4">No shipping addresses found</p>
                    <Button
                      type="button"
                      onClick={() => navigate('/account?tab=addresses')}
                    >
                      Add Address
                    </Button>
                  </div>
                ) : (
                  <RadioGroup value={selectedShippingId} onValueChange={setSelectedShippingId}>
                    <div className="space-y-3">
                      {shippingAddresses.map((addr, index) => (
                        <div
                          key={addr.id || `shipping-addr-${index}`}
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            selectedShippingId === addr.id
                              ? 'border-accent bg-accent/5'
                              : 'border-border hover:border-accent/50'
                          }`}
                          onClick={() => setSelectedShippingId(addr.id)}
                        >
                          <div className="flex items-start gap-3">
                            <RadioGroupItem value={addr.id} id={addr.id} className="mt-1" />
                            <div className="flex-1">
                              <Label htmlFor={addr.id} className="cursor-pointer">
                                <div className="font-semibold text-foreground">
                                  {addr.street}
                                </div>
                                <div className="text-sm text-luxury">
                                  {addr.city}, {addr.region} {addr.postalCode}
                                </div>
                                <div className="text-sm text-luxury">
                                  {addr.country}
                                </div>
                                {addr.isDefault && (
                                  <span className="inline-block mt-2 text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                                    Default
                                  </span>
                                )}
                              </Label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}
              </div>

              {/* Billing Address */}
              {!sameAsShipping && (
                <div className="card-luxury p-6">
                  <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
                    {t('billingAddress')}
                  </h2>

                  {loadingAddresses ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-accent" />
                    </div>
                  ) : billingAddresses.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-luxury mb-4">No billing addresses found</p>
                      <Button
                        type="button"
                        onClick={() => navigate('/account?tab=addresses')}
                      >
                        Add Address
                      </Button>
                    </div>
                  ) : (
                    <RadioGroup value={selectedBillingId} onValueChange={setSelectedBillingId}>
                      <div className="space-y-3">
                        {billingAddresses.map((addr, index) => (
                          <div
                            key={addr.id || `billing-addr-${index}`}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                              selectedBillingId === addr.id
                                ? 'border-accent bg-accent/5'
                                : 'border-border hover:border-accent/50'
                            }`}
                            onClick={() => setSelectedBillingId(addr.id)}
                          >
                            <div className="flex items-start gap-3">
                              <RadioGroupItem value={addr.id} id={`billing-${addr.id}`} className="mt-1" />
                              <div className="flex-1">
                                <Label htmlFor={`billing-${addr.id}`} className="cursor-pointer">
                                  <div className="font-semibold text-foreground">
                                    {addr.street}
                                  </div>
                                  <div className="text-sm text-luxury">
                                    {addr.city}, {addr.region} {addr.postalCode}
                                  </div>
                                  <div className="text-sm text-luxury">
                                    {addr.country}
                                  </div>
                                  {addr.isDefault && (
                                    <span className="inline-block mt-2 text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                                      Default
                                    </span>
                                  )}
                                </Label>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  )}
                </div>
              )}

              {/* Payment Method */}
              <div className="card-luxury p-6">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
                  {t('paymentMethod')}
                </h2>
                <div className="flex items-center justify-center p-8 bg-muted rounded-lg">
                  <div className="text-center">
                    <CreditCard className="h-12 w-12 text-accent mx-auto mb-4" />
                    <p className="text-lg font-semibold text-foreground mb-2">
                      Webpay Plus
                    </p>
                    <p className="text-sm text-luxury">
                      You will be redirected to Webpay to complete your payment securely
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="btn-luxury w-full"
                disabled={loading || loadingAddresses || !selectedShippingId}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  t('continueToPayment')
                )}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="animate-fade-in">
            <div className="card-luxury p-8 sticky top-24">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
                {t('orderSummary')}
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item, index) => (
                  <div key={item.id || `checkout-item-${index}`} className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={resolveProductImage(item.image)}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{item.name}</p>
                      <p className="text-sm text-luxury">{t('quantityLabel')}: {item.quantity}</p>
                      <p className="text-sm font-semibold text-accent">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-border">
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
                <div className="pt-3 border-t border-border">
                  <div className="flex justify-between text-xl font-semibold">
                    <span>{t('total')}</span>
                    <span className="text-accent">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
