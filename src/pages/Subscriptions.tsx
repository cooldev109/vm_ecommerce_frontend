import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, Loader2, Crown, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { getSubscriptionPlans, createSubscription, getUserSubscription, initSubscriptionPayment, type SubscriptionPlan } from '@/services/subscriptionService';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { SEO } from '@/components/SEO';

export default function Subscriptions() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Check if both legal documents are accepted
  const canSubscribe = termsAccepted && privacyAccepted;

  useEffect(() => {
    loadPlans();
    if (user) {
      loadCurrentSubscription();
    }
  }, [user]);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const data = await getSubscriptionPlans();
      setPlans(data.plans);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load subscription plans',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentSubscription = async () => {
    try {
      const data = await getUserSubscription();
      setCurrentSubscription(data.subscription);
    } catch (error) {
      // User doesn't have a subscription yet, that's okay
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to subscribe',
      });
      navigate('/login');
      return;
    }

    if (currentSubscription && currentSubscription.status === 'ACTIVE') {
      toast({
        title: 'Already Subscribed',
        description: 'You already have an active subscription. Manage it from your account page.',
      });
      navigate('/account');
      return;
    }

    try {
      setPurchasing(planId);

      // Step 1: Create subscription (pending payment)
      const { subscription, requiresPayment } = await createSubscription(planId as 'MONTHLY' | 'QUARTERLY' | 'ANNUAL');

      if (requiresPayment) {
        // Step 2: Initialize payment
        const paymentData = await initSubscriptionPayment(subscription.id);

        // Step 3: Redirect to Webpay
        // Create a form and submit it to Webpay
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = paymentData.url;

        const tokenInput = document.createElement('input');
        tokenInput.type = 'hidden';
        tokenInput.name = 'token_ws';
        tokenInput.value = paymentData.token;
        form.appendChild(tokenInput);

        document.body.appendChild(form);
        form.submit();
      } else {
        // Subscription activated without payment (shouldn't happen normally)
        toast({
          title: 'Success!',
          description: 'Your subscription has been activated',
        });
        navigate('/account?tab=subscription');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create subscription',
        variant: 'destructive',
      });
      setPurchasing(null);
    }
    // Don't reset purchasing state here - we're redirecting to Webpay
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const subscriptionSeoContent = {
    es: {
      title: 'Suscripciones Premium',
      description: 'Desbloquea acceso ilimitado a nuestra biblioteca de audio exclusiva con meditaciones guiadas, paisajes sonoros ambientales y experiencias de relajación.',
      keywords: 'suscripción, audio premium, meditaciones, relajación, bienestar, V&M Candle',
    },
    en: {
      title: 'Premium Subscriptions',
      description: 'Unlock unlimited access to our exclusive audio library with guided meditations, ambient soundscapes, and relaxation experiences.',
      keywords: 'subscription, premium audio, meditations, relaxation, wellness, V&M Candle',
    },
  };

  const lang = t('subscribeNow').includes('Suscribirse') ? 'es' : 'en';
  const seoContent = subscriptionSeoContent[lang];

  return (
    <div className="container mx-auto px-4 py-16">
      <SEO
        title={seoContent.title}
        description={seoContent.description}
        keywords={seoContent.keywords}
        url="/subscriptions"
      />
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Premium Audio Experience</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Unlock unlimited access to our exclusive audio library with guided meditations,
          ambient soundscapes, and relaxation experiences.
        </p>
      </div>

      {/* Current Subscription Alert */}
      {currentSubscription && currentSubscription.status === 'ACTIVE' && (
        <div className="max-w-4xl mx-auto mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-green-600" />
            <p className="text-green-800">
              You have an active {currentSubscription.planId} subscription.{' '}
              <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/account')}>
                Manage subscription
              </Button>
            </p>
          </div>
        </div>
      )}

      {/* Legal Acceptance Section */}
      <div className="max-w-2xl mx-auto mb-12 p-6 bg-card border rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          {t('beforeSubscribe')}
        </h3>

        <div className="space-y-4">
          {/* Terms of Use Checkbox */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked === true)}
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
              {t('acceptTerms')}{' '}
              <Link
                to="/terms"
                target="_blank"
                className="text-primary font-medium hover:underline"
              >
                {t('termsOfUse')}
              </Link>
              {' '}{t('acceptTermsSuffix')}
            </label>
          </div>

          {/* Privacy Policy Checkbox */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="privacy"
              checked={privacyAccepted}
              onCheckedChange={(checked) => setPrivacyAccepted(checked === true)}
              className="mt-1"
            />
            <label htmlFor="privacy" className="text-sm leading-relaxed cursor-pointer">
              {t('acceptPrivacy')}{' '}
              <Link
                to="/privacy"
                target="_blank"
                className="text-primary font-medium hover:underline"
              >
                {t('privacyPolicy')}
              </Link>
              {' '}{t('acceptPrivacySuffix')}
            </label>
          </div>
        </div>

        {!canSubscribe && (
          <p className="mt-4 text-sm text-muted-foreground">
            {t('mustAcceptBoth')}
          </p>
        )}

        {canSubscribe && (
          <p className="mt-4 text-sm text-green-600 flex items-center gap-2">
            <Check className="h-4 w-4" />
            {t('canProceed')}
          </p>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${
              plan.popular || plan.bestValue
                ? 'border-primary shadow-lg scale-105'
                : ''
            }`}
          >
            {/* Badge */}
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            {plan.bestValue && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-amber-500 text-white">
                  <Crown className="h-3 w-3 mr-1" />
                  Best Value
                </Badge>
              </div>
            )}

            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription className="text-sm">{plan.nameEs}</CardDescription>
              <div className="mt-4">
                <div className="text-4xl font-bold">{formatPrice(plan.price)}</div>
                <div className="text-sm text-muted-foreground">
                  per {plan.billingPeriod}
                </div>
                {plan.savings && (
                  <div className="mt-2 text-sm font-medium text-green-600">
                    Save {formatPrice(plan.savings)}
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="flex-col gap-2">
              <Button
                className="w-full"
                size="lg"
                variant={plan.popular || plan.bestValue ? 'default' : 'outline'}
                onClick={() => handleSubscribe(plan.id)}
                disabled={
                  purchasing !== null ||
                  (currentSubscription && currentSubscription.status === 'ACTIVE') ||
                  !canSubscribe
                }
              >
                {purchasing === plan.id ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('processingPayment')}
                  </>
                ) : currentSubscription && currentSubscription.status === 'ACTIVE' ? (
                  t('alreadySubscribed')
                ) : !canSubscribe ? (
                  t('acceptTermsButton')
                ) : (
                  t('subscribeNow')
                )}
              </Button>
              {!canSubscribe && (
                <p className="text-xs text-muted-foreground text-center">
                  {t('mustAcceptConditions')}
                </p>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
            <p className="text-muted-foreground">
              Yes! You can cancel your subscription at any time from your account settings.
              You'll continue to have access until the end of your current billing period.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Can I change my plan?</h3>
            <p className="text-muted-foreground">
              Absolutely. You can upgrade or downgrade your plan at any time from your account settings.
              Changes will take effect at your next billing cycle.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
            <p className="text-muted-foreground">
              We accept all major credit and debit cards through Transbank WebPay Plus,
              Chile's most trusted payment platform.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Is there a free trial?</h3>
            <p className="text-muted-foreground">
              Currently, we don't offer a free trial, but you can preview selected audio experiences
              on our product pages before subscribing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
