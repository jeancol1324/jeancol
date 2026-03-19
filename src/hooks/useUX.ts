import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
}

interface UsePredictiveSearchOptions {
  minLength?: number;
  debounceMs?: number;
  maxResults?: number;
}

export const usePredictiveSearch = (
  products: any[],
  options: UsePredictiveSearchOptions = {}
) => {
  const { minLength = 2, debounceMs = 300, maxResults = 6 } = options;
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const search = useCallback((searchQuery: string) => {
    if (searchQuery.length < minLength) {
      setResults([]);
      return;
    }

    const normalizedQuery = searchQuery.toLowerCase().trim();
    
    const scored = products.map(product => {
      let score = 0;
      const name = product.name.toLowerCase();
      const category = product.category.toLowerCase();
      const desc = (product.description || '').toLowerCase();

      if (name === normalizedQuery) score += 100;
      else if (name.startsWith(normalizedQuery)) score += 50;
      else if (name.includes(normalizedQuery)) score += 30;

      if (category.includes(normalizedQuery)) score += 20;
      if (desc.includes(normalizedQuery)) score += 10;

      const words = normalizedQuery.split(' ');
      words.forEach(word => {
        if (name.includes(word)) score += 5;
        if (category.includes(word)) score += 3;
      });

      return { ...product, score };
    });

    const sorted = scored
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);

    setResults(sorted);
  }, [products, minLength, maxResults]);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    if (query.length >= minLength) {
      setIsLoading(true);
      timeoutRef.current = setTimeout(() => {
        search(query);
        setIsLoading(false);
      }, debounceMs);
    } else {
      setResults([]);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query, minLength, debounceMs, search]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    isOpen,
    setIsOpen
  };
};

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue(prev => {
      const valueToStore = value instanceof Function ? value(prev) : value;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
      return valueToStore;
    });
  }, [key]);

  return [storedValue, setValue] as const;
};

export const useKeyboardShortcuts = (shortcuts: Record<string, () => void>) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const isMeta = e.metaKey || e.ctrlKey;
      
      if (shortcuts[key] && !isMeta && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        shortcuts[key]();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

export const useCountdown = (targetDate: Date) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};

export const useIntersectionObserver = (
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => callback(entry), options);
    observer.observe(el);

    return () => observer.disconnect();
  }, [callback, options]);

  return ref;
};

export const usePreloadImages = (urls: string[]) => {
  useEffect(() => {
    urls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }, [urls]);
};

export const useScrollLock = () => {
  const [isLocked, setIsLocked] = useState(false);

  const lock = useCallback(() => {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    setIsLocked(true);
    return scrollY;
  }, []);

  const unlock = useCallback((scrollY?: number) => {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    if (scrollY !== undefined) {
      window.scrollTo(0, scrollY);
    }
    setIsLocked(false);
  }, []);

  return { isLocked, lock, unlock };
};

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  sortBy: 'newest' | 'price-low' | 'price-high' | 'popular';
  sizes: string[];
  colors: string[];
}

export const usePersistentFilters = (storageKey: string = 'product-filters') => {
  const [filters, setFilters] = useState<FilterState>(() => {
    if (typeof window === 'undefined') {
      return {
        categories: [],
        priceRange: [0, 1000],
        sortBy: 'newest',
        sizes: [],
        colors: []
      };
    }
    
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    
    return {
      categories: [],
      priceRange: [0, 1000],
      sortBy: 'newest',
      sizes: [],
      colors: []
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(filters));
    } catch {}
  }, [filters, storageKey]);

  const resetFilters = useCallback(() => {
    setFilters({
      categories: [],
      priceRange: [0, 1000],
      sortBy: 'newest',
      sizes: [],
      colors: []
    });
  }, []);

  const hasActiveFilters = filters.categories.length > 0 || 
    filters.sizes.length > 0 || 
    filters.colors.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 1000;

  return {
    filters,
    setFilters,
    resetFilters,
    hasActiveFilters
  };
};
