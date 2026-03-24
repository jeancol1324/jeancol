import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ShoppingCart, 
  Share2, 
  Star, 
  ShieldCheck, 
  Truck, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Heart,
  Zap,
  Info,
  Ruler,
  Clock,
  CheckCircle,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { cn } from '../lib/utils';

interface QuickViewProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickView = ({ product, onClose }: QuickViewProps) => {
  const { addItem } = useCart();
  const { showToast } = useToast();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || 'M');
      setActiveImage(0);
    }
  }, [product]);

  if (!product) return null;

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleAddToCart = () => {
    if (!product || !selectedSize) {
      showToast('Por favor selecciona una talla', 'error');
      return;
    }
    addItem(product, selectedSize);
    showToast(`${product.name} (${selectedSize}) añadido al carrito`, 'success');
    onClose();
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } else {
        throw new Error('Share not supported');
      }
    } catch (err) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Enlace copiado al portapapeles', 'success');
    }
  };

  const sizes = product.sizes && product.sizes.length > 0 
    ? product.sizes 
    : ['S', 'M', 'L', 'XL'];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 40 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-white dark:bg-zinc-950 w-full max-w-6xl rounded-[3rem] lg:rounded-[4rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row border border-white/10"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 z-50 w-12 h-12 rounded-full bg-white/10 dark:bg-zinc-800/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-zinc-900 dark:text-white hover:bg-primary hover:text-white transition-all shadow-2xl hover:rotate-90"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image Section */}
          <div className="lg:w-1/2 relative bg-zinc-50 dark:bg-zinc-900/50 flex flex-col">
            <div 
              className="relative flex-1 overflow-hidden cursor-zoom-in group"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  src={images[activeImage]} 
                  alt={product.name}
                  className={cn(
                    "w-full h-full object-cover transition-transform duration-300 ease-out",
                    isZoomed ? "scale-[2.5]" : "scale-100"
                  )}
                  style={isZoomed ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}}
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute top-10 left-10 flex flex-col gap-3">
                <motion.span 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="bg-primary text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 flex items-center gap-2"
                >
                  <Zap className="w-3 h-3 fill-current" />
                  Nuevo Drop
                </motion.span>
                {product.discount && (
                  <motion.span 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-zinc-900 text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.2em] shadow-2xl flex items-center gap-2"
                  >
                    {product.discount} OFF
                  </motion.span>
                )}
                {product.stock && product.stock <= 10 && (
                  <motion.span 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-red-500 text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.2em] shadow-2xl flex items-center gap-2 animate-pulse"
                  >
                    <Clock className="w-3 h-3" />
                    Solo {product.stock} disponibles
                  </motion.span>
                )}
              </div>

              {/* Image Navigation */}
              {images.length > 1 && (
                <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setActiveImage(prev => (prev === 0 ? images.length - 1 : prev - 1)); }}
                    className="pointer-events-auto w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-primary transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setActiveImage(prev => (prev === images.length - 1 ? 0 : prev + 1)); }}
                    className="pointer-events-auto w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-primary transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="p-6 flex gap-4 overflow-x-auto no-scrollbar bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800">
                {images.map((img, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      "w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0",
                      activeImage === i ? "border-primary scale-105 shadow-xl shadow-primary/20" : "border-transparent opacity-40 hover:opacity-100"
                    )}
                  >
                    <img src={img} alt={`Thumb ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="lg:w-1/2 p-10 lg:p-20 overflow-y-auto max-h-[70vh] lg:max-h-none custom-scrollbar bg-white dark:bg-zinc-950">
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">{product.category}</span>
                    <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    <div className="flex text-amber-500 gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={cn("w-3 h-3", i < 4 ? "fill-current" : "opacity-30")} />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <Eye className="w-3 h-3" />
                    24 Viendo ahora
                  </div>
                </div>

                <h2 className="text-4xl lg:text-6xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter leading-[0.9] italic">
                  {product.name}
                </h2>

                <div className="flex items-baseline gap-6">
                  <span className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">${product.price.toLocaleString('es-CO')}</span>
                  {product.oldPrice && (
                    <span className="text-2xl text-zinc-400 line-through font-bold opacity-50 tracking-tighter">${product.oldPrice.toLocaleString('es-CO')}</span>
                  )}
                </div>

                <p className="text-zinc-500 dark:text-zinc-400 text-xl font-medium leading-relaxed max-w-md">
                  {product.description || "Una obra maestra de diseño y funcionalidad. Creada para aquellos que no aceptan compromisos entre estilo y comodidad."}
                </p>
              </div>

              {/* Size Selection */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Seleccionar Talla</span>
                  <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-2">
                    <Ruler className="w-3 h-3" /> Guía de tallas
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "w-14 h-14 rounded-2xl border-2 font-black text-xs transition-all flex items-center justify-center relative overflow-hidden group",
                        selectedSize === size 
                          ? "bg-primary border-primary text-white shadow-2xl shadow-primary/30 scale-110" 
                          : "bg-transparent border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:border-zinc-900 dark:hover:border-white"
                      )}
                    >
                      <span className="relative z-10">{size}</span>
                      {selectedSize !== size && (
                        <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Truck, title: 'Envío Gratis', sub: '24-48h garantizado' },
                  { icon: ShieldCheck, title: 'Pago Seguro', sub: 'SSL 256-bit' },
                  { icon: RotateCcw, title: '30 Días', sub: 'Devolución gratis' },
                  { icon: CheckCircle, title: 'Garantía', sub: '12 meses' }
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center gap-3 group hover:border-emerald-500 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-105 transition-transform">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wide text-zinc-900 dark:text-white">{item.title}</p>
                      <p className="text-[8px] font-medium text-zinc-400">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 h-20 bg-primary text-white rounded-[2rem] flex items-center justify-center gap-4 font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12" />
                  <ShoppingCart className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  Añadir al Carrito
                </button>
                <button 
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={cn(
                    "w-20 h-20 rounded-[2rem] border-2 flex items-center justify-center transition-all active:scale-95 group",
                    isFavorite 
                      ? "bg-primary/10 border-primary text-primary" 
                      : "border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:border-primary hover:text-primary"
                  )}
                >
                  <Heart className={cn("w-7 h-7 transition-transform group-hover:scale-110", isFavorite && "fill-current")} />
                </button>
                <button 
                  onClick={handleShare}
                  className="w-20 h-20 rounded-[2rem] border-2 border-zinc-100 dark:border-zinc-800 text-zinc-400 flex items-center justify-center hover:border-primary hover:text-primary transition-all active:scale-95 group"
                >
                  <Share2 className="w-7 h-7 transition-transform group-hover:scale-110" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                <Info className="w-3 h-3" />
                <span>Pago 100% seguro con encriptación SSL</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

