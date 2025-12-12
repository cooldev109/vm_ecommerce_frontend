import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  placeholder?: 'blur' | 'skeleton' | 'none';
  blurDataUrl?: string;
  onLoad?: () => void;
  onError?: () => void;
}

// Generate a simple blur placeholder color based on image src
const generatePlaceholderColor = (src: string): string => {
  // Simple hash function to generate consistent colors
  let hash = 0;
  for (let i = 0; i < src.length; i++) {
    hash = src.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 20%, 90%)`;
};

export const OptimizedImage = ({
  src,
  alt,
  className,
  containerClassName,
  aspectRatio = 'auto',
  objectFit = 'cover',
  placeholder = 'blur',
  blurDataUrl,
  onLoad,
  onError,
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '100px', // Start loading 100px before entering viewport
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    auto: '',
  };

  const objectFitClasses = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
  };

  const placeholderBg = blurDataUrl || generatePlaceholderColor(src);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden',
        aspectRatioClasses[aspectRatio],
        containerClassName
      )}
    >
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        <>
          {placeholder === 'skeleton' ? (
            <Skeleton className="absolute inset-0 w-full h-full" />
          ) : placeholder === 'blur' ? (
            <div
              className="absolute inset-0 w-full h-full animate-pulse"
              style={{
                backgroundColor: placeholderBg,
                backgroundImage: blurDataUrl ? `url(${blurDataUrl})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(20px)',
                transform: 'scale(1.1)',
              }}
            />
          ) : null}
        </>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center text-muted-foreground">
            <svg
              className="w-10 h-10 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs">Image unavailable</span>
          </div>
        </div>
      )}

      {/* Actual Image */}
      {isInView && !hasError && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'transition-opacity duration-500 ease-out',
            objectFitClasses[objectFit],
            isLoaded ? 'opacity-100' : 'opacity-0',
            aspectRatio !== 'auto' && 'absolute inset-0 w-full h-full',
            className
          )}
        />
      )}
    </div>
  );
};

// Product Image with hover zoom
export const ProductImage = ({
  src,
  alt,
  className,
  enableZoom = true,
}: {
  src: string;
  alt: string;
  className?: string;
  enableZoom?: boolean;
}) => (
  <div className={cn('group overflow-hidden', className)}>
    <OptimizedImage
      src={src}
      alt={alt}
      aspectRatio="square"
      containerClassName="bg-muted"
      className={cn(
        enableZoom && 'group-hover:scale-105 transition-transform duration-500'
      )}
    />
  </div>
);

// Avatar/Profile Image
export const AvatarImage = ({
  src,
  alt,
  size = 'md',
  className,
}: {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div className={cn('rounded-full overflow-hidden', sizeClasses[size], className)}>
      <OptimizedImage
        src={src}
        alt={alt}
        aspectRatio="square"
        placeholder="skeleton"
      />
    </div>
  );
};

// Gallery Image with lightbox trigger
export const GalleryImage = ({
  src,
  alt,
  onClick,
  className,
}: {
  src: string;
  alt: string;
  onClick?: () => void;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={cn(
      'group relative overflow-hidden rounded-lg cursor-pointer',
      'hover:shadow-lg transition-shadow duration-300',
      className
    )}
  >
    <OptimizedImage
      src={src}
      alt={alt}
      aspectRatio="square"
      className="group-hover:scale-105 transition-transform duration-500"
    />
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
  </button>
);
