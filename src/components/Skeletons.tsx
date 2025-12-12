import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// Product Card Skeleton
export const ProductCardSkeleton = () => (
  <div className="card-luxury overflow-hidden">
    <Skeleton className="aspect-square w-full" />
    <div className="p-6 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>
    </div>
  </div>
);

// Product Grid Skeleton
export const ProductGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

// Shop Page Skeleton
export const ShopPageSkeleton = () => (
  <div className="min-h-screen section-padding">
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <Skeleton className="h-12 w-48 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>
      {/* Filters */}
      <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
      {/* Products */}
      <ProductGridSkeleton count={6} />
    </div>
  </div>
);

// Product Detail Skeleton
export const ProductDetailSkeleton = () => (
  <div className="min-h-screen section-padding">
    <div className="max-w-7xl mx-auto">
      <Skeleton className="h-10 w-32 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="aspect-square rounded-lg" />
            <Skeleton className="aspect-square rounded-lg" />
          </div>
        </div>
        {/* Details */}
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-8 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
          </div>
          <div className="grid grid-cols-2 gap-4 p-6 bg-card rounded-lg">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
          <Skeleton className="h-12 w-full rounded-md" />
          <Skeleton className="h-12 w-full rounded-md" />
        </div>
      </div>
    </div>
  </div>
);

// Subscription Card Skeleton
export const SubscriptionCardSkeleton = () => (
  <div className="border rounded-lg p-6 space-y-4">
    <div className="text-center space-y-2">
      <Skeleton className="h-6 w-32 mx-auto" />
      <Skeleton className="h-4 w-24 mx-auto" />
      <Skeleton className="h-10 w-28 mx-auto mt-4" />
      <Skeleton className="h-4 w-20 mx-auto" />
    </div>
    <div className="space-y-3 pt-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </div>
    <Skeleton className="h-12 w-full rounded-md mt-4" />
  </div>
);

// Subscription Plans Skeleton
export const SubscriptionPlansSkeleton = () => (
  <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
    {Array.from({ length: 3 }).map((_, i) => (
      <SubscriptionCardSkeleton key={i} />
    ))}
  </div>
);

// Order Card Skeleton
export const OrderCardSkeleton = () => (
  <div className="card-luxury p-6 space-y-4">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex flex-col gap-2 items-end">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
    <div className="space-y-3">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="w-16 h-16 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-5 w-16" />
        </div>
      ))}
    </div>
    <div className="pt-4 border-t flex justify-between">
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-4 w-40" />
    </div>
  </div>
);

// Orders List Skeleton
export const OrdersListSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-6">
    {Array.from({ length: count }).map((_, i) => (
      <OrderCardSkeleton key={i} />
    ))}
  </div>
);

// Audio Card Skeleton
export const AudioCardSkeleton = () => (
  <div className="p-4 rounded-xl border bg-card space-y-3">
    <div className="flex items-center gap-4">
      <Skeleton className="w-16 h-16 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="w-10 h-10 rounded-full" />
    </div>
  </div>
);

// Audio Library Skeleton
export const AudioLibrarySkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <AudioCardSkeleton key={i} />
    ))}
  </div>
);

// Table Row Skeleton
export const TableRowSkeleton = ({ columns = 5 }: { columns?: number }) => (
  <tr>
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="p-4">
        <Skeleton className="h-5 w-full" />
      </td>
    ))}
  </tr>
);

// Table Skeleton
export const TableSkeleton = ({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) => (
  <div className="border rounded-lg overflow-hidden">
    <table className="w-full">
      <thead>
        <tr className="bg-muted">
          {Array.from({ length: columns }).map((_, i) => (
            <th key={i} className="p-4">
              <Skeleton className="h-4 w-20" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRowSkeleton key={i} columns={columns} />
        ))}
      </tbody>
    </table>
  </div>
);

// Generic Page Loading
export const PageLoadingSkeleton = ({ title = true }: { title?: boolean }) => (
  <div className="min-h-screen section-padding">
    <div className="max-w-7xl mx-auto">
      {title && (
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-5 w-96 mx-auto" />
        </div>
      )}
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  </div>
);
