import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Crown, Calendar, CreditCard, AlertCircle, Loader2, RefreshCw, PauseCircle, PlayCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import {
  getUserSubscription,
  cancelSubscription,
  pauseSubscription,
  resumeSubscription,
  updateSubscription,
  type Subscription,
} from '@/services/subscriptionService';

const PLAN_NAMES = {
  MONTHLY: 'Monthly Premium',
  QUARTERLY: 'Quarterly Premium',
  ANNUAL: 'Annual Premium',
};

const PLAN_PRICES = {
  MONTHLY: 9990,
  QUARTERLY: 25990,
  ANNUAL: 89990,
};

export default function SubscriptionTab() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showPauseDialog, setShowPauseDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      setLoading(true);
      const data = await getUserSubscription();
      setSubscription(data.subscription);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load subscription',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAutoRenew = async (enabled: boolean) => {
    if (!subscription) return;

    try {
      setActionLoading(true);
      await updateSubscription(subscription.id, { autoRenew: enabled });
      setSubscription({ ...subscription, autoRenew: enabled });
      toast({
        title: 'Success',
        description: enabled
          ? 'Auto-renewal enabled'
          : 'Auto-renewal disabled. Your subscription will end on the expiry date.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update subscription',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!subscription) return;

    try {
      setActionLoading(true);
      const data = await cancelSubscription(subscription.id);
      setSubscription(data.subscription);
      setShowCancelDialog(false);
      toast({
        title: 'Subscription Cancelled',
        description: 'Your subscription has been cancelled. You will have access until the end of your current billing period.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to cancel subscription',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handlePause = async () => {
    if (!subscription) return;

    try {
      setActionLoading(true);
      const data = await pauseSubscription(subscription.id);
      setSubscription(data.subscription);
      setShowPauseDialog(false);
      toast({
        title: 'Subscription Paused',
        description: 'Your subscription has been paused. You can resume it anytime.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to pause subscription',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleResume = async () => {
    if (!subscription) return;

    try {
      setActionLoading(true);
      const data = await resumeSubscription(subscription.id);
      setSubscription(data.subscription);
      toast({
        title: 'Subscription Resumed',
        description: 'Your subscription has been reactivated.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to resume subscription',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive'; label: string }> = {
      ACTIVE: { variant: 'default', label: 'Active' },
      PAUSED: { variant: 'secondary', label: 'Paused' },
      CANCELLED: { variant: 'destructive', label: 'Cancelled' },
      EXPIRED: { variant: 'destructive', label: 'Expired' },
    };

    const config = variants[status] || variants.EXPIRED;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Premium Subscription
          </CardTitle>
          <CardDescription>
            You don't have an active subscription yet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Subscribe to unlock unlimited access to our exclusive audio library, early access to new releases,
            and special discounts on all products.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => navigate('/subscriptions')}>
            View Subscription Plans
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Subscription Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>{PLAN_NAMES[subscription.planId]}</CardTitle>
                <CardDescription>
                  {formatPrice(PLAN_PRICES[subscription.planId])} per {subscription.planId === 'MONTHLY' ? 'month' : subscription.planId === 'QUARTERLY' ? 'quarter' : 'year'}
                </CardDescription>
              </div>
            </div>
            {getStatusBadge(subscription.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Subscription Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Started</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(subscription.startedAt), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">
                  {subscription.status === 'ACTIVE' ? 'Renews' : 'Expires'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(subscription.nextRenewal), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
            {subscription.lastPaymentDate && (
              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Last Payment</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(subscription.lastPaymentDate), 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Auto-Renew Toggle */}
          {subscription.status === 'ACTIVE' && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="space-y-0.5">
                <Label htmlFor="auto-renew">Auto-renewal</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically renew your subscription
                </p>
              </div>
              <Switch
                id="auto-renew"
                checked={subscription.autoRenew}
                onCheckedChange={handleToggleAutoRenew}
                disabled={actionLoading}
              />
            </div>
          )}

          {/* Warnings */}
          {subscription.status === 'CANCELLED' && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your subscription has been cancelled. You will have access until{' '}
                {format(new Date(subscription.expiresAt), 'MMMM d, yyyy')}.
              </AlertDescription>
            </Alert>
          )}

          {subscription.status === 'PAUSED' && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your subscription is paused. Resume anytime to regain access.
              </AlertDescription>
            </Alert>
          )}

          {subscription.status === 'EXPIRED' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your subscription has expired. Subscribe again to regain access.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex flex-wrap gap-3">
          {subscription.status === 'ACTIVE' && (
            <>
              <Button
                variant="outline"
                onClick={() => setShowPauseDialog(true)}
                disabled={actionLoading}
              >
                <PauseCircle className="h-4 w-4 mr-2" />
                Pause Subscription
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowCancelDialog(true)}
                disabled={actionLoading}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel Subscription
              </Button>
            </>
          )}

          {subscription.status === 'PAUSED' && (
            <Button onClick={handleResume} disabled={actionLoading}>
              {actionLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <PlayCircle className="h-4 w-4 mr-2" />
              )}
              Resume Subscription
            </Button>
          )}

          {(subscription.status === 'CANCELLED' || subscription.status === 'EXPIRED') && (
            <Button onClick={() => navigate('/subscriptions')}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Resubscribe
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Change Plan Card */}
      {subscription.status === 'ACTIVE' && (
        <Card>
          <CardHeader>
            <CardTitle>Change Plan</CardTitle>
            <CardDescription>
              Upgrade or downgrade your subscription plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Want to switch to a different plan? Visit our subscription plans page to view all available options.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => navigate('/subscriptions')}>
              View Plans
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Cancel Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your subscription? You will continue to have access until{' '}
              {subscription && format(new Date(subscription.expiresAt), 'MMMM d, yyyy')}.
              You can resubscribe at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Keep Subscription</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              disabled={actionLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Cancel Subscription'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pause Dialog */}
      <AlertDialog open={showPauseDialog} onOpenChange={setShowPauseDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Pause Subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              Pausing your subscription will stop billing and you will lose access to premium features.
              You can resume your subscription at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Don't Pause</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePause}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Pausing...
                </>
              ) : (
                'Pause Subscription'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
