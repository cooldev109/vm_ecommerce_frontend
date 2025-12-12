import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition = ({ children, className }: PageTransitionProps) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    // Fade out
    setIsVisible(false);

    // Update children and fade in
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsVisible(true);
    }, 150);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Initial mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={cn(
        'transition-all duration-300 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
        className
      )}
    >
      {displayChildren}
    </div>
  );
};

// Simple fade transition wrapper
export const FadeIn = ({
  children,
  delay = 0,
  duration = 500,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        'transition-opacity ease-out',
        isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
};

// Slide up animation wrapper
export const SlideUp = ({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        'transition-all duration-500 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
        className
      )}
    >
      {children}
    </div>
  );
};

// Staggered children animation
export const StaggeredList = ({
  children,
  staggerDelay = 100,
  className,
}: {
  children: React.ReactNode[];
  staggerDelay?: number;
  className?: string;
}) => {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <SlideUp key={index} delay={index * staggerDelay}>
          {child}
        </SlideUp>
      ))}
    </div>
  );
};
