import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import StarRating from '@/components/StarRating';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewFormProps {
  onSubmit: (rating: number, comment: string) => Promise<void>;
  isSubmitting: boolean;
  className?: string;
}

const ReviewForm = ({ onSubmit, isSubmitting, className }: ReviewFormProps) => {
  const { t } = useLanguage();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError(t('pleaseSelectRating') || 'Please select a rating');
      return;
    }

    try {
      await onSubmit(rating, comment);
      // Reset form on success
      setRating(0);
      setComment('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {t('yourRating') || 'Your Rating'} <span className="text-destructive">*</span>
        </label>
        <StarRating
          rating={rating}
          interactive
          onRatingChange={setRating}
          size="lg"
          className="mb-2"
        />
        {rating > 0 && (
          <p className="text-sm text-muted-foreground">
            {rating} {t('stars') || 'star(s)'}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-foreground mb-2">
          {t('yourReview') || 'Your Review'} ({t('optional') || 'optional'})
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t('shareYourExperience') || 'Share your experience with this product...'}
          rows={4}
          disabled={isSubmitting}
          className="resize-none"
        />
      </div>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="btn-luxury w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('submitting') || 'Submitting...'}
          </>
        ) : (
          t('submitReview') || 'Submit Review'
        )}
      </Button>
    </form>
  );
};

export default ReviewForm;
