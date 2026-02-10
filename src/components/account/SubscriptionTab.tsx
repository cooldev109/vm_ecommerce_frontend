import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Crown, Calendar, CreditCard, AlertCircle, Loader2, RefreshCw, PauseCircle, PlayCircle, XCircle, ArrowUpCircle, Check } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  getUserSubscription,
  cancelSubscription,
  pauseSubscription,
  resumeSubscription,
  updateSubscription,
  initiateUpgrade,
  initUpgradePayment,
  type Subscription,
  type UpgradeResult,
} from '@/services/subscriptionService';

const PLAN_NAMES = {
  WEEKLY: 'Weekly Premium',
  MONTHLY: 'Monthly Premium',
  QUARTERLY: 'Quarterly Premium',
};

const PLAN_PRICES = {
  WEEKLY: 2990,
  MONTHLY: 9990,
  QUARTERLY: 25990,
};

const PLAN_ORDER: Record<string, number> = {
  WEEKLY: 1,
  MONTHLY: 2,
  QUARTERLY: 3,
};

export default function SubscriptionTab() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showPauseDialog, setShowPauseDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | null>(null);
  const [upgradeResult, setUpgradeResult] = useState<UpgradeResult | null>(null);
  const [showConfirmUpgrade, setShowConfirmUpgrade] = useState(false);
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

  const handleSelectPlan = async (planId: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY') => {
    if (!subscription || planId === subscription.planId) return;

    try {
      setActionLoading(true);
      setSelectedPlan(planId);
      const result = await initiateUpgrade(subscription.id, planId);
      setUpgradeResult(result);
      setShowUpgradeDialog(false);
      setShowConfirmUpgrade(true);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to initiate plan change',
        variant: 'destructive',
      });
      setSelectedPlan(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmUpgrade = async () => {
    if (!subscription || !upgradeResult || !selectedPlan) return;

    try {
      setActionLoading(true);

      if (upgradeResult.requiresPayment && upgradeResult.upgradeAmount > 0) {
        // Initiate payment for upgrade
        const paymentData = await initUpgradePayment(
          subscription.id,
          selectedPlan,
          upgradeResult.upgradeAmount
        );
        // Redirect to Webpay
        window.location.href = `${paymentData.url}?token_ws=${paymentData.token}`;
      } else {
        // Downgrade or no payment needed - already processed
        toast({
          title: 'Plan Changed',
          description: upgradeResult.message,
        });
        setShowConfirmUpgrade(false);
        setUpgradeResult(null);
        setSelectedPlan(null);
        // Reload subscription to get updated data
        await loadSubscription();
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to complete plan change',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getAvailablePlans = () => {
    if (!subscription) return [];
    const plans: Array<'WEEKLY' | 'MONTHLY' | 'QUARTERLY'> = ['WEEKLY', 'MONTHLY', 'QUARTERLY'];
    return plans.filter(plan => plan !== subscription.planId);
  };

  const isPlanUpgrade = (newPlan: string) => {
    if (!subscription) return false;
    return PLAN_ORDER[newPlan] > PLAN_ORDER[subscription.planId];
  };

  const formatPrice = (price: number) => {
    const formatted = new Intl.NumberFormat('es-CL', {
      minimumFractionDigits: 0,
    }).format(price);
    return `CLP $${formatted}`;
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
                  {formatPrice(PLAN_PRICES[subscription.planId])} per {subscription.planId === 'WEEKLY' ? 'week' : subscription.planId === 'MONTHLY' ? 'month' : 'quarter'}
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
            <CardTitle className="flex items-center gap-2">
              <ArrowUpCircle className="h-5 w-5" />
              Change Plan
            </CardTitle>
            <CardDescription>
              Upgrade or downgrade your subscription plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Switch to a different plan to better suit your needs. Upgrades are prorated and take effect immediately.
              Downgrades will take effect at your next renewal date.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setShowUpgradeDialog(true)}>
              <ArrowUpCircle className="h-4 w-4 mr-2" />
              Change Plan
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

      {/* Upgrade Plan Selection Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Your Plan</DialogTitle>
            <DialogDescription>
              Select a new plan. Your current plan is {PLAN_NAMES[subscription?.planId || 'MONTHLY']}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {getAvailablePlans().map((planId) => {
              const isUpgrade = isPlanUpgrade(planId);
              return (
                <button
                  key={planId}
                  onClick={() => handleSelectPlan(planId)}
                  disabled={actionLoading}
                  className="w-full p-4 border rounded-lg hover:border-primary hover:bg-accent/50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{PLAN_NAMES[planId]}</span>
                        <Badge variant={isUpgrade ? 'default' : 'secondary'}>
                          {isUpgrade ? 'Upgrade' : 'Downgrade'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatPrice(PLAN_PRICES[planId])} per {planId === 'WEEKLY' ? 'week' : planId === 'MONTHLY' ? 'month' : 'quarter'}
                      </p>
                    </div>
                    {actionLoading && selectedPlan === planId ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <ArrowUpCircle className={`h-5 w-5 ${isUpgrade ? 'text-primary' : 'text-muted-foreground rotate-180'}`} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upgrade Confirmation Dialog */}
      <Dialog open={showConfirmUpgrade} onOpenChange={(open) => {
        if (!open) {
          setShowConfirmUpgrade(false);
          setUpgradeResult(null);
          setSelectedPlan(null);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {upgradeResult?.isUpgrade ? 'Confirm Upgrade' : 'Confirm Downgrade'}
            </DialogTitle>
            <DialogDescription>
              {upgradeResult?.message}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Current Plan</p>
                <p className="font-medium">{PLAN_NAMES[subscription?.planId || 'MONTHLY']}</p>
              </div>
              <ArrowUpCircle className={`h-6 w-6 ${upgradeResult?.isUpgrade ? 'text-primary' : 'text-muted-foreground rotate-180'}`} />
              <div className="text-right">
                <p className="text-sm text-muted-foreground">New Plan</p>
                <p className="font-medium">{selectedPlan ? PLAN_NAMES[selectedPlan] : ''}</p>
              </div>
            </div>

            {upgradeResult?.requiresPayment && upgradeResult.upgradeAmount > 0 && (
              <div className="p-4 border border-primary/20 bg-primary/5 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Amount to pay now:</span>
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(upgradeResult.upgradeAmount)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  This is the prorated difference for the remainder of your billing period.
                </p>
              </div>
            )}

            {!upgradeResult?.requiresPayment && (
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>No payment required. Change takes effect at next renewal.</span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmUpgrade(false);
                setUpgradeResult(null);
                setSelectedPlan(null);
              }}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmUpgrade} disabled={actionLoading}>
              {actionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : upgradeResult?.requiresPayment ? (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Payment
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Confirm Change
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
