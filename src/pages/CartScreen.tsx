import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ChevronLeft, 
  Tag, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Sparkles,
  Zap,
  CheckCircle2,
  Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';

export const CartScreen = () => {
  const navigate = useNavigate();
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    totalPrice, 
    totalItems,
    freeShippingThreshold,
    freeShippingProgress,
    remainingForFreeShipping
  } = useCart();
  const [coupon, setCoupon] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);

  const subtotal = totalPrice;
  const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 15;
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;

  const handleApplyCoupon = () => {
    if (!coupon) return;
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setCouponApplied(true);
    }, 1000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col items-center justify-center p-8 text-center transition-colors duration-500">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-40 h-40 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-12 relative"
        >
          <ShoppingBag className="w-20 h-20 text-zinc-200 dark:text-zinc-800" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-full"
          />
        </motion.div>
        <h2 className="text-5xl lg:text-7xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic mb-6">Tu carrito <br /> <span className="text-primary">está vacío</span></h2>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-12 max-w-sm leading-relaxed text-lg">Parece que aún no has añadido ninguna pieza de nuestra colección exclusiva.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-primary text-white px-16 py-6 rounded-2xl font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group"
        >
          Explorar Colección
          <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-500 pb-40">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => navigate(-1)} 
                className="w-14 h-14 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-900 dark:text-white hover:bg-primary hover:text-white transition-all shadow-xl shadow-black/5"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h1 className="text-5xl lg:text-8xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic leading-none">Tu <span className="text-primary">Bolsa</span></h1>
            </div>
            <p className="text-zinc-400 font-black uppercase tracking-[0.3em] text-[10px] ml-20">Tienes {totalItems} artículos seleccionados</p>
          </div>

          {/* Free Shipping Progress in Header */}
          <div className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 flex-1 max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary" />
                {freeShippingProgress >= 100 ? '¡Envío Gratis Activado!' : 'Envío Gratis'}
              </span>
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                {freeShippingProgress >= 100 ? '100%' : `$${remainingForFreeShipping.toFixed(2)} restantes`}
              </span>
            </div>
            <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${freeShippingProgress}%` }}
                className={cn(
                  "h-full transition-all duration-1000",
                  freeShippingProgress >= 100 ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" : "bg-primary shadow-[0_0_15px_rgba(255,99,33,0.5)]"
                )}
              />
            </div>
            <p className="mt-4 text-[9px] font-bold text-zinc-400 uppercase tracking-widest text-center">
              {freeShippingProgress >= 100 
                ? 'Tu pedido califica para envío express gratuito' 
                : `Añade $${remainingForFreeShipping.toFixed(2)} más para no pagar envío`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
          {/* Left: Items List */}
          <div className="lg:col-span-2 space-y-10">
            <AnimatePresence mode="popLayout">
              {items.map(item => (
                <motion.div 
                  key={`${item.id}-${item.selectedSize}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group relative bg-white dark:bg-zinc-900 rounded-[3rem] p-8 lg:p-10 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col sm:flex-row gap-10 items-center"
                >
                  <div className="w-full sm:w-56 aspect-square rounded-[2rem] overflow-hidden bg-zinc-50 dark:bg-zinc-800 shrink-0 relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <div className="flex-1 w-full space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">{item.category}</span>
                          {item.discount && (
                            <span className="bg-primary/10 text-primary text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                              {item.discount} OFF
                            </span>
                          )}
                        </div>
                        <h3 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic group-hover:text-primary transition-colors">{item.name}</h3>
                        <div className="flex items-center gap-4">
                          <span className="px-4 py-1.5 bg-zinc-50 dark:bg-zinc-900 rounded-full text-[10px] font-black text-zinc-500 uppercase tracking-widest border border-zinc-100 dark:border-zinc-700">
                            Talla: {item.selectedSize}
                          </span>
                          <span className="text-emerald-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> En Stock
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id, item.selectedSize)}
                        className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-all group/trash"
                      >
                        <Trash2 className="w-6 h-6 group-hover/trash:scale-110 transition-transform" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-8 border-t border-zinc-50 dark:border-zinc-800/50">
                      <div className="flex items-center bg-zinc-50 dark:bg-zinc-800/80 rounded-2xl px-4 py-2 border border-zinc-100 dark:border-zinc-800 shadow-inner">
                        <button 
                          onClick={() => updateQuantity(item.id, item.selectedSize, -1)} 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-primary hover:bg-white dark:hover:bg-zinc-700 transition-all"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-black text-zinc-900 dark:text-white text-lg tracking-tighter">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.selectedSize, 1)} 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-primary hover:bg-white dark:hover:bg-zinc-700 transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter italic">${(item.price * item.quantity).toFixed(2)}</span>
                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">${item.price.toFixed(2)} / unidad</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Premium Upsell */}
            <div className="bg-zinc-900 dark:bg-zinc-900 text-white rounded-[3rem] p-10 lg:p-12 flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden group shadow-2xl border border-white/5">
              <div className="absolute inset-0 opacity-20 pointer-events-none group-hover:scale-105 transition-transform duration-1000">
                <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover" alt="bg" />
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 to-transparent" />
              </div>
              
              <div className="relative z-10 flex items-center gap-8">
                <div className="w-20 h-20 rounded-[2rem] bg-primary/20 backdrop-blur-xl border border-primary/30 flex items-center justify-center shrink-0">
                  <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                </div>
                <div>
                  <h4 className="text-2xl font-black uppercase tracking-tighter italic leading-none mb-2">Empaque de <br /> <span className="text-primary">Regalo Premium</span></h4>
                  <p className="text-zinc-400 text-sm font-medium">Añade un toque de exclusividad a tu pedido.</p>
                </div>
              </div>
              
              <button className="relative z-10 px-10 py-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary hover:border-primary transition-all flex items-center gap-3">
                Añadir (+ $5.00)
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="space-y-10">
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-[3.5rem] p-10 lg:p-14 border border-zinc-100 dark:border-zinc-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 blur-3xl rounded-full -mr-20 -mt-20" />
              <h2 className="text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic mb-12 relative z-10">Resumen</h2>
              
              <div className="space-y-8 relative z-10">
                <div className="flex justify-between items-center group">
                  <span className="text-zinc-400 font-black uppercase tracking-[0.2em] text-[10px] group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">Subtotal</span>
                  <span className="text-xl font-black text-zinc-900 dark:text-white tracking-tighter">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center group">
                  <div className="flex flex-col">
                    <span className="text-zinc-400 font-black uppercase tracking-[0.2em] text-[10px] group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">Envío</span>
                    {shipping === 0 && <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Promo Activada</span>}
                  </div>
                  <span className={cn(
                    "text-xl font-black tracking-tighter",
                    shipping === 0 ? "text-emerald-500" : "text-zinc-900 dark:text-white"
                  )}>
                    {shipping === 0 ? 'GRATIS' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between items-center group animate-in slide-in-from-right-4 duration-500">
                    <span className="text-emerald-500 font-black uppercase tracking-[0.2em] text-[10px]">Descuento (10%)</span>
                    <span className="text-xl font-black text-emerald-500 tracking-tighter">- ${discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="pt-10 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-zinc-400 font-black uppercase tracking-[0.2em] text-[10px] mb-1">Total Final</span>
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">IVA Incluido</span>
                  </div>
                  <span className="text-6xl font-black text-zinc-900 dark:text-white tracking-tighter italic leading-none">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-16 space-y-6 relative z-10">
                <div className="flex gap-3">
                  <div className="flex-1 relative group">
                    <Tag className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="text" 
                      placeholder="CÓDIGO" 
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                      className="w-full bg-white dark:bg-zinc-800 border-2 border-transparent focus:border-primary rounded-2xl pl-12 pr-6 py-5 text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-700 font-black text-xs outline-none transition-all shadow-inner"
                    />
                  </div>
                  <button 
                    onClick={handleApplyCoupon}
                    disabled={isApplying || couponApplied}
                    className={cn(
                      "px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl",
                      couponApplied 
                        ? "bg-emerald-500 text-white" 
                        : "bg-zinc-900 dark:bg-zinc-800 text-white hover:bg-primary"
                    )}
                  >
                    {isApplying ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : couponApplied ? 'Listo' : 'Aplicar'}
                  </button>
                </div>
                
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-primary text-white py-7 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group"
                >
                  Continuar al Pago
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>

            {/* Trust Info */}
            <div className="grid grid-cols-1 gap-6 px-6">
              {[
                { icon: ShieldCheck, title: 'Pago Seguro', desc: 'SSL Encriptado 256-bit' },
                { icon: Truck, title: 'Envío Express', desc: 'Seguimiento en tiempo real' },
                { icon: RotateCcw, title: 'Devolución', desc: '30 días de garantía' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-primary group-hover:scale-110 transition-transform border border-zinc-100 dark:border-zinc-800">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="text-zinc-900 dark:text-white font-black uppercase tracking-[0.1em] text-[10px]">{item.title}</h5>
                    <p className="text-zinc-400 text-[9px] font-bold uppercase tracking-widest">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
