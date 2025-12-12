import { format } from 'date-fns';
import StarRating from '@/components/StarRating';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Review } from '@/types';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewListProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  className?: string;
}

const ReviewList = ({
  reviews,
  averageRating,
  totalReviews,
  currentPage,
  totalPages,
  hasMore,
  onPageChange,
  isLoading = false,
  className,
}: ReviewListProps) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent border-r-transparent"></div>
        <p className="mt-4 text-muted-foreground">{t('loading') || 'Loading reviews...'}</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Summary */}
      {totalReviews > 0 && (
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center gap-4 mb-2">
            <div className="text-4xl font-bold text-foreground">
              {averageRating.toFixed(1)}
            </div>
            <div>
              <StarRating rating={averageRating} size="lg" />
              <p className="text-sm text-muted-foreground mt-1">
                {t('basedOn') || 'Based on'} {totalReviews} {totalReviews === 1 ? (t('review') || 'review') : (t('reviews') || 'reviews')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <p className="text-lg text-muted-foreground">
            {t('noReviewsYet') || 'No reviews yet'}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {t('beTheFirstToReview') || 'Be the first to review this product'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-card p-6 rounded-lg border border-border hover:shadow-soft transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-semibold text-foreground">{review.user.name}</p>
                    {review.verified && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        {t('verifiedPurchase') || 'Verified Purchase'}
                      </Badge>
                    )}
                  </div>
                  <StarRating rating={review.rating} size="sm" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(review.createdAt), 'MMM d, yyyy')}
                </p>
              </div>

              {review.comment && (
                <p className="text-base text-luxury leading-relaxed">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t('previous') || 'Previous'}
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(pageNumber)}
                  disabled={isLoading}
                  className={cn(
                    'min-w-[2.5rem]',
                    currentPage === pageNumber && 'bg-accent hover:bg-accent/90'
                  )}
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasMore || isLoading}
          >
            {t('next') || 'Next'}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
