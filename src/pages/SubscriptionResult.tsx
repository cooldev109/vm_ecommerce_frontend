import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, AlertCircle, Crown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getSubscriptionPaymentStatus } from '@/services/subscriptionService';

const PLAN_NAMES: Record<string, string> = {
  MONTHLY: 'Monthly Premium',
  QUARTERLY: 'Quarterly Premium',
  ANNUAL: 'Annual Premium',
};

export default function SubscriptionResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);

  const status = searchParams.get('status');
  const subscriptionId = searchParams.get('subscriptionId');
  const errorMessage = searchParams.get('message');

  useEffect(() => {
    if (subscriptionId && status === 'success') {
      loadSubscriptionStatus();
    } else {
      setLoading(false);
    }
  }, [subscriptionId, status]);

  const loadSubscriptionStatus = async () => {
    try {
      const data = await getSubscriptionPaymentStatus(subscriptionId!);
      setSubscriptionData(data);
    } catch (error) {
      console.error('Failed to load subscription status:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Processing your subscription...</p>
        </div>
      </div>
    );
  }

  // Success state
  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
            <CardDescription>
              Your premium subscription has been activated
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Crown className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">
                    {subscriptionData?.planId ? PLAN_NAMES[subscriptionData.planId] : 'Premium Subscription'}
                  </p>
                  <p className="text-sm text-muted-foreground">Active subscription</p>
                </div>
              </div>

              {subscriptionData && (
                <>
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Amount paid:</span>
                      <span className="font-medium">{formatPrice(subscriptionData.amount || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Valid from:</span>
                      <span>{formatDate(subscriptionData.startedAt)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Valid until:</span>
                      <span>{formatDate(subscriptionData.expiresAt)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>You now have access to all premium audio experiences and exclusive content.</p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button className="w-full" onClick={() => navigate('/audio')}>
              Explore Audio Experiences
            </Button>
            <Button variant="outline" className="w-full" onClick={() => navigate('/account?tab=subscription')}>
              Manage Subscription
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Failed state
  if (status === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-600">Payment Failed</CardTitle>
            <CardDescription>
              We couldn't process your payment
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground text-center">
                Your payment was declined or cancelled. No charges were made to your account.
                Please try again or use a different payment method.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button className="w-full" onClick={() => navigate('/subscriptions')}>
              Try Again
            </Button>
            <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-amber-600" />
          </div>
          <CardTitle className="text-2xl text-amber-600">Something Went Wrong</CardTitle>
          <CardDescription>
            We encountered an issue processing your subscription
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground text-center">
              {errorMessage === 'missing_token'
                ? 'The payment session expired or was invalid. Please try again.'
                : errorMessage === 'subscription_not_found'
                ? 'We could not find your subscription. Please contact support.'
                : 'An unexpected error occurred. Please try again or contact support if the problem persists.'}
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full" onClick={() => navigate('/subscriptions')}>
            Try Again
          </Button>
          <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
