import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, Copy, Check, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

interface SideCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SideCart: React.FC<SideCartProps> = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeItem, freeShippingProgress, remainingForFreeShipping, appliedCoupon, setAppliedCoupon, discount, finalTotal } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [couponInput, setCouponInput] = useState('');
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [savedForLater, setSavedForLater] = useState<any[]>([]);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const applyCoupon = () => {
    const coupon = COUPONS.find(c => c.code.toUpperCase() === couponInput.toUpperCase());
    
    if (!coupon) {
      setCouponError('Código de cupón inválido');
      return;
    }
    
    if (total < coupon.minPurchase) {
      setCouponError(`Compra mínima $${coupon.minPurchase} para este cupón`);
      return;
    }
    
    setAppliedCoupon(coupon);
    setCouponError('');
    setShowCouponInput(false);
    showToast(`Cupón ${coupon.code} aplicado`, 'success');
    setCouponInput('');
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Cupón eliminado', 'success');
  };

  const saveForLater = (item: any) => {
    setSavedForLater(prev => [...prev, item]);
    removeItem(item.id);
    showToast('Guardado para después', 'success');
  };

  const moveToCart = (item: any) => {
    const { id, ...rest } = item;
    items.forEach(i => {
      if (i.id === item.savedId) {
        useCart;
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md md:max-w-lg bg-white dark:bg-zinc-950 z-[201] flex flex-col shadow-2xl"
          >
            {/* Free shipping progress */}
            {itemCount > 0 && (
              <div className="px-4 md:px-6 py-3 bg-primary/10 border-b border-primary/20">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-medium text-primary">
                    {freeShippingProgress >= 100 ? 'Envío gratis logrado!' : `Faltan $${remainingForFreeShipping.toFixed(2)} para envío gratis`}
                  </span>
                  <span className="font-black text-primary">{Math.round(freeShippingProgress)}%</span>
                </div>
                <div className="h-1.5 bg-primary/20 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(freeShippingProgress, 100)}%` }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            )}

            {/* Header */}
            <div className="p-4 md:p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-zinc-900 dark:text-white" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                  Tu Bolsa ({itemCount})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
              >
                <X className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-6"
                >
                  <ShoppingBag className="w-10 h-10 text-zinc-300 dark:text-zinc-700" />
                </motion.div>
                <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-3">
                  Tu bolsa está vacía
                </h3>
                <p className="text-zinc-500 mb-6 text-sm">
                  Descubre nuestra colección y añade tus favoritos.
                </p>
                <button
                  onClick={onClose}
                  className="bg-primary text-white px-6 py-3 rounded-xl font-black uppercase tracking-wider text-xs hover:bg-zinc-900 transition-all"
                >
                  Continuar Comprando
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex gap-3 md:gap-4 bg-zinc-50 dark:bg-zinc-900/50 p-3 md:p-4 rounded-2xl"
                      >
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-white dark:bg-zinc-800 shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="text-primary text-[8px] md:text-[9px] font-black uppercase tracking-widest">
                                {item.category}
                              </p>
                              <h4 className="text-xs md:text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight truncate">
                                {item.name}
                              </h4>
                              <p className="text-[10px] md:text-xs text-zinc-400 mt-0.5">
                                Talla: {item.selectedSize}
                              </p>
                            </div>
                            <button
                              onClick={() => saveForLater(item)}
                              className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-primary transition-colors"
                              title="Guardar para después"
                            >
                              <Bookmark className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <div className="flex items-center gap-1.5 md:gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:border-primary transition-colors"
                              >
                                <Minus className="w-2.5 h-2.5 md:w-3 md:h-3" />
                              </button>
                              <span className="w-6 md:w-8 text-center font-black text-xs md:text-sm">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:border-primary transition-colors"
                              >
                                <Plus className="w-2.5 h-2.5 md:w-3 md:h-3" />
                              </button>
                            </div>
                            <span className="text-sm md:text-base font-black text-zinc-900 dark:text-white">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Saved for later */}
                  {savedForLater.length > 0 && (
                    <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                      <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">
                        Guardados para después ({savedForLater.length})
                      </h4>
                      <div className="space-y-2">
                        {savedForLater.map((item, index) => (
                          <div key={index} className="flex gap-3 bg-zinc-100 dark:bg-zinc-900/50 p-3 rounded-xl">
                            <div className="w-14 h-14 rounded-lg overflow-hidden bg-white dark:bg-zinc-800 shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-xs font-black text-zinc-900 dark:text-white truncate">{item.name}</h5>
                              <p className="text-xs text-zinc-500">${item.price.toFixed(2)}</p>
                            </div>
                            <button 
                              onClick={() => {
                                const newItems = [...savedForLater];
                                newItems.splice(index, 1);
                                setSavedForLater(newItems);
                                showToast('Movido al carrito', 'success');
                              }}
                              className="text-primary text-[10px] font-bold uppercase"
                            >
                              Mover al carrito
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Coupon Section */}
                <div className="px-4 md:px-6 py-4 border-t border-zinc-100 dark:border-zinc-800">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-600 uppercase">
                          {appliedCoupon.code}
                        </span>
                        <span className="text-[10px] text-emerald-600/70">
                          -{appliedCoupon.discount || 'Envío'}%
                        </span>
                      </div>
                      <button onClick={removeCoupon} className="text-emerald-600 hover:text-red-500">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : showCouponInput ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          placeholder="Código de cupón"
                          className="flex-1 bg-zinc-100 dark:bg-zinc-900 border-0 rounded-lg px-3 py-2 text-xs font-bold uppercase"
                        />
                        <button
                          onClick={applyCoupon}
                          className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold"
                        >
                          Aplicar
                        </button>
                      </div>
                      {couponError && (
                        <p className="text-[10px] text-red-500">{couponError}</p>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowCouponInput(true)}
                      className="flex items-center gap-2 text-primary text-xs font-bold uppercase"
                    >
                      <Tag className="w-4 h-4" />
                      ¿Tienes un cupón?
                    </button>
                  )}
                </div>

                {/* Summary */}
                <div className="p-4 md:p-6 border-t border-zinc-100 dark:border-zinc-800 space-y-3 bg-white dark:bg-zinc-950">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Subtotal</span>
                    <span className="font-medium">${total.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm text-emerald-600">
                      <span>Descuento ({appliedCoupon.code})</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Envío</span>
                    <span className="text-emerald-600 font-medium">Calculado en checkout</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
                    <span className="text-base font-black text-zinc-900 dark:text-white">Total</span>
                    <span className="text-lg font-black text-primary">${finalTotal.toFixed(2)}</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    className="w-full bg-primary text-white py-4 rounded-xl font-black uppercase tracking-wider text-xs shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all flex items-center justify-center gap-2"
                  >
                    Finalizar Compra
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>

                  <button
                    onClick={onClose}
                    className="w-full py-2.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    Continuar Comprando
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
