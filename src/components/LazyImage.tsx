import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  aspectRatio?: string;
  onClick?: () => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  placeholderClassName = 'bg-zinc-200 dark:bg-zinc-800',
  aspectRatio = 'aspect-[3/4]',
  onClick
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={imgRef}
      onClick={onClick}
      className={cn(
        'relative overflow-hidden',
        aspectRatio,
        onClick && 'cursor-pointer',
        className
      )}
    >
      {isInView && !error ? (
        <>
          <img
            src={src}
            alt={alt}
            className={cn(
              'w-full h-full object-cover transition-all duration-700',
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            )}
            onLoad={() => setIsLoaded(true)}
            onError={() => setError(true)}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
          {!isLoaded && (
            <div className={cn(
              'absolute inset-0 flex items-center justify-center',
              placeholderClassName
            )}>
              <div className="w-8 h-8 border-2 border-zinc-300 border-t-primary rounded-full animate-spin" />
            </div>
          )}
        </>
      ) : (
        <div className={cn(
          'absolute inset-0 flex items-center justify-center animate-pulse',
          placeholderClassName
        )}>
          {error ? (
            <div className="text-zinc-400 text-sm">Error al cargar imagen</div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-1/2 h-1 bg-zinc-300 rounded-full animate-shimmer" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface BlurImageProps {
  src: string;
  lowSrc?: string;
  alt: string;
  className?: string;
}

export const BlurImage: React.FC<BlurImageProps> = ({
  src,
  lowSrc,
  alt,
  className
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {lowSrc && !isLoaded && (
        <img
          src={lowSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 transition-opacity duration-500"
        />
      )}
      {!error && (
        <img
          src={src}
          alt={alt}
          className={cn(
            'w-full h-full object-cover transition-all duration-700',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
      )}
    </div>
  );
};
