import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { cn } from '../lib/utils';

interface QuickAddButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    sizes?: string[];
    category?: string;
  };
  sizes?: string[];
  className?: string;
}

export const QuickAddButton: React.FC<QuickAddButtonProps> = ({
  product,
  sizes = ['S', 'M', 'L', 'XL'],
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();
  const { showToast } = useToast();

  const handleAdd = async () => {
    if (!selectedSize && sizes.length > 0) {
      setIsOpen(true);
      return;
    }

    setIsAdding(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    addItem({
      ...product,
      selectedSize: selectedSize || 'M',
      quantity: 1
    });
    
    showToast(`${product.name} añadido al carrito`, 'success');
    setIsAdding(false);
    setIsOpen(false);
    setSelectedSize(null);
  };

  return (
    <div className={cn('relative', className)}>
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="add"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleAdd}
            className={cn(
              'w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2',
              'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900',
              'hover:bg-primary hover:text-white',
              isAdding && 'opacity-70 pointer-events-none'
            )}
          >
            {isAdding ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              />
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                Añadir
              </>
            )}
          </motion.button>
        ) : (
          <motion.div
            key="sizes"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3 p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg"
          >
            <p className="text-[10px] font-black uppercase tracking-wider text-zinc-500 text-center">
              Selecciona talla
            </p>
            <div className="flex justify-center gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    'w-10 h-10 rounded-lg border-2 font-black text-xs transition-all',
                    selectedSize === size
                      ? 'border-primary bg-primary text-white'
                      : 'border-zinc-200 dark:border-zinc-700 hover:border-primary'
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-bold uppercase"
              >
                Cancelar
              </button>
              <button
                onClick={handleAdd}
                disabled={!selectedSize}
                className={cn(
                  'flex-1 py-2 rounded-lg font-black text-xs uppercase transition-all',
                  selectedSize
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-400 cursor-not-allowed'
                )}
              >
                Añadir
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface QuantitySelectorProps {
  quantity: number;
  onChange: (qty: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onChange,
  min = 1,
  max = 99,
  className
}) => {
  const decrease = () => {
    if (quantity > min) onChange(quantity - 1);
  };

  const increase = () => {
    if (quantity < max) onChange(quantity + 1);
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <button
        onClick={decrease}
        disabled={quantity <= min}
        className={cn(
          'w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all',
          quantity <= min
            ? 'border-zinc-200 dark:border-zinc-800 text-zinc-300 cursor-not-allowed'
            : 'border-zinc-200 dark:border-zinc-700 hover:border-primary hover:text-primary'
        )}
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-8 text-center font-black text-lg">{quantity}</span>
      <button
        onClick={increase}
        disabled={quantity >= max}
        className={cn(
          'w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all',
          quantity >= max
            ? 'border-zinc-200 dark:border-zinc-800 text-zinc-300 cursor-not-allowed'
            : 'border-zinc-200 dark:border-zinc-700 hover:border-primary hover:text-primary'
        )}
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};

interface AddToCartAnimationProps {
  trigger: boolean;
  onComplete?: () => void;
}

export const AddToCartAnimation: React.FC<AddToCartAnimationProps> = ({
  trigger,
  onComplete
}) => {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {trigger && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: [0, 1.5, 0], opacity: [1, 1, 0] }}
          transition={{ duration: 0.6 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
        >
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
            <Check className="w-8 h-8 text-white" strokeWidth={3} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
