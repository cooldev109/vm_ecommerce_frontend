import { Check, Clock, Package, Truck, CheckCircle2, XCircle } from 'lucide-react';
import type { Order } from '@/types';

interface OrderTimelineProps {
  order: Order;
}

const OrderTimeline = ({ order }: OrderTimelineProps) => {
  const getStatusSteps = () => {
    const baseSteps = [
      {
        status: 'PENDING',
        label: 'Order Placed',
        icon: Clock,
        date: order.createdAt,
      },
      {
        status: 'PROCESSING',
        label: 'Processing',
        icon: Package,
        date: order.status === 'PROCESSING' || order.status === 'SHIPPED' || order.status === 'DELIVERED' ? order.updatedAt : null,
      },
      {
        status: 'SHIPPED',
        label: 'Shipped',
        icon: Truck,
        date: order.shippedAt,
      },
      {
        status: 'DELIVERED',
        label: 'Delivered',
        icon: CheckCircle2,
        date: order.deliveredAt,
      },
    ];

    // If order is cancelled, show only cancelled status
    if (order.status === 'CANCELLED') {
      return [
        {
          status: 'PENDING',
          label: 'Order Placed',
          icon: Clock,
          date: order.createdAt,
        },
        {
          status: 'CANCELLED',
          label: 'Cancelled',
          icon: XCircle,
          date: order.updatedAt,
        },
      ];
    }

    return baseSteps;
  };

  const steps = getStatusSteps();
  const currentStatusIndex = steps.findIndex((step) => step.status === order.status);

  const getStepStatus = (index: number) => {
    if (order.status === 'CANCELLED' && index === 1) {
      return 'cancelled';
    }
    if (index < currentStatusIndex) {
      return 'completed';
    }
    if (index === currentStatusIndex) {
      return 'current';
    }
    return 'upcoming';
  };

  return (
    <div className="py-6">
      <div className="relative">
        {steps.map((step, index) => {
          const stepStatus = getStepStatus(index);
          const Icon = step.icon;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.status} className="relative pb-8 last:pb-0">
              {!isLast && (
                <div
                  className={`absolute left-5 top-10 h-full w-0.5 ${
                    stepStatus === 'completed'
                      ? 'bg-accent'
                      : stepStatus === 'cancelled'
                      ? 'bg-red-300'
                      : 'bg-muted'
                  }`}
                />
              )}

              <div className="flex items-start gap-4">
                <div
                  className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    stepStatus === 'completed'
                      ? 'border-accent bg-accent text-white'
                      : stepStatus === 'current'
                      ? 'border-accent bg-white text-accent'
                      : stepStatus === 'cancelled'
                      ? 'border-red-500 bg-red-500 text-white'
                      : 'border-muted bg-muted text-luxury'
                  }`}
                >
                  {stepStatus === 'completed' ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>

                <div className="flex-1 pt-1">
                  <p
                    className={`font-semibold ${
                      stepStatus === 'completed' || stepStatus === 'current'
                        ? 'text-foreground'
                        : stepStatus === 'cancelled'
                        ? 'text-red-600'
                        : 'text-luxury'
                    }`}
                  >
                    {step.label}
                  </p>
                  {step.date && (
                    <p className="text-sm text-luxury">
                      {new Date(step.date).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
