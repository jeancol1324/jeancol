import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, Users, TrendingUp, Flame, Sparkles, ShieldCheck, Eye } from 'lucide-react';
import { cn } from '../lib/utils';

interface LiveViewersProps {
  count: number;
  productId?: string;
  className?: string;
}

export const LiveViewers: React.FC<LiveViewersProps> = ({ count, className }) => {
  const [displayCount, setDisplayCount] = useState(count);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayCount(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20',
        className
      )}
    >
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-emerald-500"
        />
        <span className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
      </div>
      <Users className="w-4 h-4 text-white" />
      <span className="text-white text-xs font-black">
        {displayCount}+ viendo ahora
      </span>
    </motion.div>
  );
};

interface UrgencyBadgeProps {
  type: 'low-stock' | 'flash-sale' | 'limited';
  stock?: number;
  endsIn?: Date;
  className?: string;
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({
  type,
  stock,
  endsIn,
  className
}) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!endsIn) return;
    
    const updateTime = () => {
      const diff = endsIn.getTime() - new Date().getTime();
      if (diff <= 0) return;
      
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [endsIn]);

  const badges = {
    'low-stock': {
      icon: Flame,
      text: stock !== undefined ? `¡Solo ${stock} left!` : '¡Últimas unidades!',
      color: 'bg-red-500'
    },
    'flash-sale': {
      icon: Zap,
      text: endsIn
        ? `${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`
        : '¡Flash Sale!',
      color: 'bg-primary'
    },
    'limited': {
      icon: Clock,
      text: 'Edición Limitada',
      color: 'bg-purple-500'
    }
  };

  const badge = badges[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-xs font-black uppercase tracking-widest shadow-lg',
        badge.color,
        className
      )}
    >
      <badge.icon className="w-4 h-4" />
      <span>{badge.text}</span>
    </motion.div>
  );
};

interface SocialProofProps {
  type: 'purchases' | 'views' | 'rating' | 'trending';
  count?: number;
  rating?: number;
  className?: string;
}

export const SocialProof: React.FC<SocialProofProps> = ({
  type,
  count,
  rating,
  className
}) => {
  const proofs = {
    purchases: {
      icon: TrendingUp,
      text: `${count || 0}+ compras este mes`,
      color: 'text-emerald-500'
    },
    views: {
      icon: Eye,
      text: `${count || 0} vistas hoy`,
      color: 'text-blue-500'
    },
    rating: {
      icon: Sparkles,
      text: `${rating || 0} rating promedio`,
      color: 'text-amber-500'
    },
    trending: {
      icon: Flame,
      text: '🔥 Trending ahora',
      color: 'text-primary'
    }
  };

  const proof = proofs[type];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('flex items-center gap-2', className)}
    >
      <proof.icon className={cn('w-4 h-4', proof.color)} />
      <span className={cn('text-xs font-medium', proof.color)}>{proof.text}</span>
    </motion.div>
  );
};

interface TrustBadgeProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  icon,
  title,
  description,
  className
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn(
        'flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-lg transition-shadow',
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div>
        <h4 className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white">
          {title}
        </h4>
        <p className="text-[10px] text-zinc-500">{description}</p>
      </div>
    </motion.div>
  );
};

interface UpsellCardProps {
  product: {
    name: string;
    price: number;
    image: string;
  };
  addPrice?: number;
  onAdd: () => void;
  className?: string;
}

export const UpsellCard: React.FC<UpsellCardProps> = ({
  product,
  addPrice = 0,
  onAdd,
  className
}) => {
  const formatCOP = (amount: number) => amount.toLocaleString('es-CO');
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex items-center gap-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800',
        className
      )}
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-16 h-16 rounded-xl object-cover"
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-black uppercase tracking-tight text-zinc-900 dark:text-white truncate">
          {product.name}
        </p>
        <p className="text-sm font-black text-emerald-600">
          +${formatCOP(addPrice)}
        </p>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAdd}
        className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors"
      >
        Añadir
      </motion.button>
    </motion.div>
  );
};

interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  className,
  size = 'md'
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculate = () => {
      const diff = targetDate.getTime() - new Date().getTime();
      if (diff <= 0) return;

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const sizes = {
    sm: { box: 'w-12 h-12 text-sm', label: 'text-[8px]' },
    md: { box: 'w-16 h-16 text-xl', label: 'text-[10px]' },
    lg: { box: 'w-20 h-20 text-2xl', label: 'text-xs' }
  };

  const s = sizes[size];

  return (
    <div className={cn('flex gap-2 lg:gap-4', className)}>
      {[
        { value: timeLeft.days, label: 'Días' },
        { value: timeLeft.hours, label: 'Horas' },
        { value: timeLeft.minutes, label: 'Min' },
        { value: timeLeft.seconds, label: 'Seg' }
      ].map((item, i) => (
        <div key={i} className="flex flex-col items-center">
          <div
            className={cn(
              'rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-black',
              s.box
            )}
          >
            {String(item.value).padStart(2, '0')}
          </div>
          <span className={cn('mt-1 text-zinc-500 font-bold uppercase tracking-widest', s.label)}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};
