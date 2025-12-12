import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

const StarRating = ({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  className,
}: StarRatingProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const handleClick = (selectedRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(selectedRating);
    }
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;
        const isPartial = starValue - 1 < rating && rating < starValue;

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(starValue)}
            disabled={!interactive}
            className={cn(
              'relative transition-all duration-200',
              interactive && 'cursor-pointer hover:scale-110',
              !interactive && 'cursor-default'
            )}
            aria-label={`${starValue} star${starValue !== 1 ? 's' : ''}`}
          >
            {isPartial ? (
              <div className="relative">
                <Star
                  className={cn(sizeClasses[size], 'text-gray-300')}
                  fill="currentColor"
                />
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${(rating - (starValue - 1)) * 100}%` }}
                >
                  <Star
                    className={cn(sizeClasses[size], 'text-yellow-500')}
                    fill="currentColor"
                  />
                </div>
              </div>
            ) : (
              <Star
                className={cn(
                  sizeClasses[size],
                  isFilled ? 'text-yellow-500' : 'text-gray-300',
                  interactive && 'hover:text-yellow-400'
                )}
                fill={isFilled ? 'currentColor' : 'none'}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
