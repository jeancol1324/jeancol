import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Eye, Star, TrendingUp, Flame, ShoppingBag, Heart } from 'lucide-react';
import { cn } from '../lib/utils';

interface LiveViewersProps {
  productId?: string;
  initialCount?: number;
  className?: string;
  showAvatars?: boolean;
  variant?: 'badge' | 'counter' | 'full';
}

export const LiveViewers: React.FC<LiveViewersProps> = ({
  productId,
  initialCount = 50,
  className,
  showAvatars = true,
  variant = 'badge'
}) => {
  const [count, setCount] = useState(initialCount);
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(initialCount - 10, Math.min(initialCount + 20, prev + change));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [initialCount]);

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 1000);
    }, 10000);

    return () => clearInterval(pulseInterval);
  }, []);

  if (variant === 'counter') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn('flex items-center gap-2', className)}
      >
        <div className="relative">
          <Users className="w-4 h-4 text-emerald-500" />
          {showPulse && (
            <span className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-50" />
          )}
        </div>
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <span className="text-emerald-500 font-black">{count}+</span> personas viendo ahora
        </span>
      </motion.div>
    );
  }

  if (variant === 'full') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'flex items-center justify-between bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 shadow-lg',
          className
        )}
      >
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-900 overflow-hidden bg-zinc-200"
              >
                <img src={`https://i.pravatar.cc/100?u=${productId || 'generic'}${i}`} alt="" />
              </div>
            ))}
          </div>
          <div>
            <p className="text-sm font-black text-zinc-900 dark:text-white">
              {count}+ personas están viendo esto
            </p>
            <p className="text-xs text-zinc-500">Compra hace 2 minutos</p>
          </div>
        </div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center gap-2 text-emerald-500"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-bold">Live</span>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-zinc-100 dark:border-zinc-800 shadow-sm',
        className
      )}
    >
      <div className="relative">
        <Eye className="w-4 h-4 text-emerald-500" />
        {showPulse && (
          <span className="absolute inset-0 w-4 h-4 bg-emerald-500 rounded-full animate-ping opacity-50" />
        )}
      </div>
      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
        {count}+ viendo
      </span>
    </motion.div>
  );
};

interface SocialProofProps {
  type: 'purchases' | 'rating' | 'trending' | 'low-stock';
  count?: number;
  rating?: number;
  stock?: number;
  className?: string;
}

export const SocialProof: React.FC<SocialProofProps> = ({
  type,
  count = 0,
  rating = 0,
  stock,
  className
}) => {
  const config = {
    purchases: {
      icon: ShoppingBag,
      text: `${count}+ ventas`,
      color: 'text-emerald-500'
    },
    rating: {
      icon: Star,
      text: `${rating}/5 (${count}+)`,
      color: 'text-amber-500'
    },
    trending: {
      icon: TrendingUp,
      text: '🔥 Trending',
      color: 'text-primary'
    },
    'low-stock': {
      icon: Flame,
      text: stock !== undefined ? `¡Solo ${stock} left!` : '¡Últimas unidades!',
      color: 'text-red-500'
    }
  };

  const { icon: Icon, text, color } = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('inline-flex items-center gap-2', className)}
    >
      <Icon className={cn('w-4 h-4', color)} />
      <span className={cn('text-xs font-bold', color)}>{text}</span>
    </motion.div>
  );
};

interface RecentlySoldProps {
  productId: string;
  className?: string;
}

export const RecentlySold: React.FC<RecentlySoldProps> = ({ productId, className }) => {
  const [sales, setSales] = useState<Array<{ name: string; time: string; size: string }>>([
    { name: 'María G.', time: 'Hace 2 min', size: 'M' },
    { name: 'Carlos R.', time: 'Hace 5 min', size: 'L' },
    { name: 'Ana M.', time: 'Hace 8 min', size: 'S' },
    { name: 'Juan P.', time: 'Hace 12 min', size: 'XL' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const names = ['María G.', 'Carlos R.', 'Ana M.', 'Juan P.', 'Laura S.', 'Diego V.'];
      const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
      const newSale = {
        name: names[Math.floor(Math.random() * names.length)],
        time: 'Justo ahora',
        size: sizes[Math.floor(Math.random() * sizes.length)]
      };
      setSales(prev => [newSale, ...prev.slice(0, 3)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('space-y-2', className)}
    >
      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Compras recientes</p>
      <AnimatePresence mode="popLayout">
        {sales.slice(0, 2).map((sale, i) => (
          <motion.div
            key={`${sale.name}-${sale.time}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3 text-xs"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-600 dark:text-zinc-400">
              <span className="font-bold text-zinc-900 dark:text-white">{sale.name}</span> compró Talla {sale.size}
            </span>
            <span className="text-zinc-400 ml-auto">{sale.time}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

interface WishlistCounterProps {
  productId: string;
  className?: string;
}

export const WishlistCounter: React.FC<WishlistCounterProps> = ({ productId, className }) => {
  const [count, setCount] = useState(24);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('flex items-center gap-2 text-pink-500', className)}
    >
      <Heart className="w-4 h-4 fill-pink-500" />
      <span className="text-xs font-bold">{count} personas lo tienen en favoritos</span>
    </motion.div>
  );
};
