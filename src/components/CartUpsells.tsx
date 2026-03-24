import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { cn } from '../lib/utils';

interface UpsellProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface UpsellItemProps {
  product: UpsellProduct;
  addPrice: number;
  onAdd: () => void;
  onDismiss: () => void;
}

const UpsellItem: React.FC<UpsellItemProps> = ({ product, addPrice, onAdd, onDismiss }) => {
  const formatCOP = (amount: number) => amount.toLocaleString('es-CO');
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-900"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-16 h-16 rounded-xl object-cover"
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400 mb-1">Añade por solo</p>
        <p className="text-sm font-black text-zinc-900 dark:text-white truncate">{product.name}</p>
        <p className="text-lg font-black text-emerald-600">+${formatCOP(addPrice)}</p>
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={onAdd}
          className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={onDismiss}
          className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

interface CartUpsellsProps {
  className?: string;
  maxItems?: number;
}

const upsellProducts: UpsellProduct[] = [
  {
    id: 'acc-1',
    name: 'Calcetines Premium',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=200&q=80',
    category: 'Accesorios'
  },
  {
    id: 'acc-2',
    name: 'Bolso Minimal',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&q=80',
    category: 'Bolsos'
  },
  {
    id: 'acc-3',
    name: 'Gafas de Sol',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&q=80',
    category: 'Accesorios'
  }
];

export const CartUpsells: React.FC<CartUpsellsProps> = ({ className, maxItems = 2 }) => {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [dismissed, setDismissed] = React.useState<string[]>([]);

  const visibleUpsells = upsellProducts
    .filter(p => !dismissed.includes(p.id))
    .slice(0, maxItems);

  const handleAddUpsell = (product: UpsellProduct) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      selectedSize: 'Única',
      quantity: 1
    });
    setDismissed(prev => [...prev, product.id]);
    showToast(`${product.name} añadido al carrito`, 'success');
  };

  if (visibleUpsells.length === 0) return null;

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-emerald-500" />
        <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wider">
          Completa tu look
        </h3>
      </div>
      <AnimatePresence mode="popLayout">
        {visibleUpsells.map(product => (
          <UpsellItem
            key={product.id}
            product={product}
            addPrice={Math.round(product.price * 0.1)}
            onAdd={() => handleAddUpsell(product)}
            onDismiss={() => setDismissed(prev => [...prev, product.id])}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface FreeShippingProgressProps {
  threshold: number;
  currentTotal: number;
  className?: string;
}

export const FreeShippingProgress: React.FC<FreeShippingProgressProps> = ({
  threshold,
  currentTotal,
  className
}) => {
  const remaining = Math.max(0, threshold - currentTotal);
  const progress = Math.min(100, (currentTotal / threshold) * 100);
  const isComplete = currentTotal >= threshold;

  return (
    <div className={cn('space-y-2', className)}>
      {!isComplete ? (
        <>
          <div className="flex justify-between text-xs">
            <span className="text-zinc-500">
              Te faltan <strong className="text-primary">${remaining.toLocaleString('es-CO')}</strong> para envío gratis
            </span>
            <span className="text-emerald-500 font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full relative"
            >
              <div className="absolute inset-0 bg-white/20 animate-shimmer" />
            </motion.div>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl">
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
            ¡Envío gratis activado!
          </span>
        </div>
      )}
    </div>
  );
};

interface DiscountBannerProps {
  code: string;
  description: string;
  onApply: () => void;
  onDismiss: () => void;
  className?: string;
}

export const DiscountBanner: React.FC<DiscountBannerProps> = ({
  code,
  description,
  onApply,
  onDismiss,
  className
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        'relative overflow-hidden bg-gradient-to-r from-primary to-amber-500 text-white p-4 rounded-2xl',
        className
      )}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
      <div className="relative flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-wider">Código especial</span>
          </div>
          <p className="text-lg font-black italic">{description}</p>
          <p className="text-xs opacity-80">Código: <span className="font-bold">{code}</span></p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onApply}
            className="px-4 py-2 bg-white text-primary rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-zinc-100 transition-colors"
          >
            Aplicar
          </button>
          <button
            onClick={() => { onDismiss(); setIsVisible(false); }}
            className="px-2 py-2 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  discount?: number;
  tax?: number;
  className?: string;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  shipping,
  discount = 0,
  tax = 0,
  className
}) => {
  const formatCOP = (amount: number) => amount.toLocaleString('es-CO');
  const total = subtotal + shipping - discount + tax;

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex justify-between text-sm">
        <span className="text-zinc-500">Subtotal</span>
        <span className="font-medium">${formatCOP(subtotal)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-zinc-500">Envío</span>
        <span className={shipping === 0 ? 'text-emerald-500 font-bold' : 'font-medium'}>
          {shipping === 0 ? 'GRATIS' : `$${formatCOP(shipping)}`}
        </span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-sm text-emerald-500">
          <span>Descuento</span>
          <span className="font-bold">-${formatCOP(discount)}</span>
        </div>
      )}
      {tax > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">IVA</span>
          <span className="font-medium">${formatCOP(tax)}</span>
        </div>
      )}
      <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-between">
        <span className="text-lg font-black text-zinc-900 dark:text-white">Total</span>
        <span className="text-2xl font-black text-primary italic">${formatCOP(total)}</span>
      </div>
    </div>
  );
};
