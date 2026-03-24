import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Star, ShoppingBag, ShoppingCart, Zap, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { cn } from '../lib/utils';
import { CountdownBadge } from './CountdownTimer';

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  ShoppingCart,
  ShoppingBag,
};

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    offerPrice?: number;
    offerEndDate?: string;
    image: string;
    category: string;
    rating: number;
    reviews?: number;
    reviewsCount?: number;
    isNew?: boolean;
    isTrending?: boolean;
    stock?: number;
  };
  index?: number;
  showCountdown?: boolean;
  className?: string;
}

/* ─── Sale Badge (Diagonal Corner Ribbon) ─────────────────────────── */
const SaleBadge: React.FC<{ discount: number }> = ({ discount }) => (
  <motion.div
    initial={{ x: 20, y: -20, opacity: 0 }}
    animate={{ x: 0, y: 0, opacity: 1 }}
    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    className="absolute top-0 right-0 z-30 pointer-events-none"
  >
    <div className="relative overflow-hidden w-24 h-24">
      {/* Ribbon base - DORADO con brillo interno */}
      <div 
        className="absolute top-0 right-0 w-[140%] h-8 flex items-center justify-center text-[13px] font-black uppercase tracking-widest text-amber-900"
        style={{
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
          transform: 'rotate(45deg) translate(25%, -60%)',
          transformOrigin: 'center',
          boxShadow: '0 3px 10px rgba(255, 165, 0, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.3)',
        }}
      >
        {/* Brillo interno animado */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
          }}
          animate={{
            x: ['-150%', '150%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 1,
            ease: 'easeInOut',
          }}
        />
        <span className="relative z-10 font-bold" style={{ textShadow: '0 1px 2px rgba(255,255,255,0.5)' }}>OFERTA</span>
      </div>
    </div>
  </motion.div>
);

/* ─── Animated Price Bar ────────────────────────────────────────────────────── */
const PriceBar: React.FC<{
  price: number;
  offerPrice?: number;
  savings: number;
}> = ({ price, offerPrice, savings }) => {
  const displayPrice = offerPrice ?? price;

  return (
    <div className="mt-auto pt-1">
      <motion.div
        className="w-full relative overflow-hidden rounded-xl py-3 px-4 flex items-center cursor-pointer select-none"
        style={{
          background:
            'linear-gradient(105deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-primary) 75%, black) 100%)',
        }}
        whileHover="hovered"
        initial="idle"
      >
        {/* Base shimmer — always running, subtle */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)',
            backgroundSize: '200% 100%',
          }}
          animate={{ backgroundPositionX: ['200%', '-200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />

        {/* Hover: bright flash sweep */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.38) 50%, transparent 80%)',
          }}
          variants={{
            idle: { x: '-100%', opacity: 0 },
            hovered: { x: '160%', opacity: 1, transition: { duration: 0.55, ease: 'easeInOut' } },
          }}
        />

        {/* Hover: subtle glow border */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          variants={{
            idle: { boxShadow: '0 0 0px 0px rgba(255,255,255,0)' },
            hovered: {
              boxShadow: '0 0 18px 3px color-mix(in srgb, var(--color-primary) 60%, white)',
              transition: { duration: 0.3 },
            },
          }}
        />

        {/* Price text */}
        <motion.span
          className="text-base font-black tracking-wide relative z-10"
          style={{ color: 'white', textShadow: '0 1px 4px rgba(0,0,0,0.25)' }}
          variants={{
            idle: { scale: 1 },
            hovered: { scale: 1.05, transition: { type: 'spring', stiffness: 400, damping: 15 } },
          }}
        >
          ${displayPrice.toLocaleString('es-CO')}
        </motion.span>

        {offerPrice && (
          <span
            className="ml-auto text-[11px] line-through font-medium relative z-10"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            ${price.toLocaleString('es-CO')}
          </span>
        )}
      </motion.div>
    </div>
  );
};

/* ─── Main ProductCard ──────────────────────────────────────────────────────── */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index = 0,
  showCountdown = false,
  className,
}) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { showToast } = useToast();
  
  const [headerIcons, setHeaderIcons] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('headerIcons');
    return saved ? JSON.parse(saved) : {
      cartIcon: 'ShoppingCart',
      searchIcon: 'Search',
      themeIcon: 'Moon',
    };
  });

  const [customIcons, setCustomIcons] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('customIcons');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('headerIcons');
      if (saved) {
        setHeaderIcons(JSON.parse(saved));
      }
      const customSaved = localStorage.getItem('customIcons');
      if (customSaved) {
        setCustomIcons(JSON.parse(customSaved));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('headerIconsUpdated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('headerIconsUpdated', handleStorageChange);
    };
  }, []);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const price = product.offerPrice || product.price;
    addItem({
      id: product.id,
      name: product.name,
      price,
      image: product.image,
      category: product.category,
      selectedSize: 'M',
      quantity: 1,
    });
    showToast(`${product.name} añadido al carrito`, 'success');
  };

  const discount = product.offerPrice
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
    : 0;

  const savings = product.offerPrice ? product.price - product.offerPrice : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn('group cursor-pointer', className)}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div
        className="relative rounded-2xl overflow-hidden flex flex-col transition-all duration-500"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1.5px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow =
            'var(--shadow-primary), 0 0 0 1.5px var(--color-primary)';
          e.currentTarget.style.borderColor = 'var(--color-primary)';
          e.currentTarget.style.transform = 'translateY(-3px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          e.currentTarget.style.borderColor = 'var(--color-border)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {/* ── IMAGE SECTION ── */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            referrerPolicy="no-referrer"
            loading="lazy"
          />

          {/* Gradient overlay */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
            style={{
              background:
                'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
            }}
          />

          {/* TOP LEFT — Status Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
            {product.isNew && (
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.06 + 0.2 }}
                className="text-white px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1 backdrop-blur-sm"
                style={{ backgroundColor: 'var(--color-badge-new, #7c3aed)' }}
              >
                <Zap className="w-2.5 h-2.5" />
                Nuevo
              </motion.span>
            )}
            {product.isTrending && !product.isNew && (
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.06 + 0.2 }}
                className="text-white px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1 backdrop-blur-sm shadow-lg"
                style={{ backgroundColor: '#7C3AED' }}
              >
                <TrendingUp className="w-2.5 h-2.5" />
                Top
              </motion.span>
            )}
          </div>

          {/* TOP RIGHT — Animated Sale Ribbon */}
          {product.offerPrice && <SaleBadge discount={discount} />}

          {/* BOTTOM LEFT — Countdown (clear of the cart button) */}
          {product.offerEndDate && (
            <div className="absolute bottom-3 left-3 z-10" style={{ right: '60px' }}>
              <CountdownBadge endDate={product.offerEndDate} />
            </div>
          )}
        </div>

        {/* ── ADD TO CART BUTTON — anchored above info section ── */}
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.88 }}
          onClick={handleAddToCart}
          className="absolute z-40 w-11 h-11 rounded-full flex items-center justify-center shadow-xl"
          style={{
            /* Sits at the seam between image and info section */
            bottom: '130px',
            right: '12px',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-foreground)',
            border: '2px solid var(--color-border)',
            transition: 'background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary)';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.borderColor = 'var(--color-primary)';
            e.currentTarget.style.boxShadow =
              '0 0 16px 3px color-mix(in srgb, var(--color-primary) 55%, transparent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-surface)';
            e.currentTarget.style.color = 'var(--color-foreground)';
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.boxShadow = '';
          }}
        >
          {headerIcons.cartIcon?.startsWith('custom_') ? (
            <img src={customIcons.cartIcon} alt="Add to cart" className="w-5 h-5 object-contain" />
          ) : (
            React.createElement(ICON_MAP[headerIcons.cartIcon] || ShoppingBag, { className: "w-5 h-5" })
          )}
        </motion.button>

        {/* ── INFO SECTION ── */}
        <div
          className="px-3.5 pt-3 pb-3.5 flex flex-col gap-1.5"
          style={{ minHeight: '130px' }}
        >
          {/* Category */}
          <span
            className="text-[9px] font-black uppercase tracking-[0.16em]"
            style={{ color: 'var(--color-primary)' }}
          >
            {product.category}
          </span>

          {/* Name */}
          <h3
            className="text-sm font-bold leading-snug line-clamp-2 transition-colors duration-200"
            style={{ color: 'var(--color-foreground)' }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = 'var(--color-primary)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = 'var(--color-foreground)')
            }
          >
            {product.name}
          </h3>

          {/* Stars + Savings */}
          <div className="flex items-center justify-between mt-0.5">
            <div className="flex items-center gap-1">
              <Star
                className="w-3 h-3"
                style={{
                  fill: 'var(--color-primary)',
                  color: 'var(--color-primary)',
                }}
              />
              <span
                className="text-[10px] font-semibold"
                style={{ color: 'var(--color-foreground)' }}
              >
                {product.rating}
              </span>
              {product.reviewsCount && (
                <span
                  className="text-[10px]"
                  style={{ color: 'var(--color-foreground-muted)' }}
                >
                  ({product.reviewsCount})
                </span>
              )}
            </div>

            {product.offerPrice && (
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                style={{
                  color: 'var(--color-success)',
                  backgroundColor: 'var(--color-success-bg)',
                }}
              >
                Ahorras ${savings.toLocaleString('es-CO')}
              </span>
            )}
          </div>

          {/* Animated Price Bar */}
          <PriceBar
            price={product.price}
            offerPrice={product.offerPrice}
            savings={savings}
          />
        </div>
      </div>
    </motion.div>
  );
};