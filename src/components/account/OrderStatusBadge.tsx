import { Badge } from '@/components/ui/badge';

interface OrderStatusBadgeProps {
  status: 'PENDING' | 'PROCESSING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
}

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const statusConfig = {
    PENDING: {
      label: 'Pending',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    },
    PROCESSING: {
      label: 'Processing',
      className: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    PAID: {
      label: 'Paid',
      className: 'bg-green-100 text-green-800 border-green-200',
    },
    SHIPPED: {
      label: 'Shipped',
      className: 'bg-purple-100 text-purple-800 border-purple-200',
    },
    DELIVERED: {
      label: 'Delivered',
      className: 'bg-green-100 text-green-800 border-green-200',
    },
    CANCELLED: {
      label: 'Cancelled',
      className: 'bg-red-100 text-red-800 border-red-200',
    },
  };

  const config = statusConfig[status] || {
    label: status,
    className: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <Badge className={config.className} variant="outline">
      {config.label}
    </Badge>
  );
};

export default OrderStatusBadge;
