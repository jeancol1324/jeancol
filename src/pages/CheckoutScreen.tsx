import React, { useState } from 'react';
import { 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  ChevronLeft, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Lock, 
  ShoppingBag,
  Zap,
  Sparkles,
  Flame,
  Star,
  User,
  Mail,
  Phone,
  Package,
  RotateCcw,
  Tag,
  X,
  Check,
  Clock,
  PackageCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart, AVAILABLE_COUPONS } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { cn } from '../lib/utils';

const CreditCardIcon = CreditCard;

const SHIPPING_OPTIONS = [
  { id: 'standard', name: 'Estándar', days: '5-7 días', price: 0, badge: 'Gratis', icon: Truck },
  { id: 'express', name: 'Exprés', days: '2-3 días', price: 15, badge: 'Popular', icon: Zap },
  { id: 'priority', name: 'Prioritario', days: '24 horas', price: 25, badge: 'Más Rápido', icon: Clock },
];

const steps = [
  { id: 1, name: 'Envío', icon: MapPin },
  { id: 2, name: 'Pago', icon: CreditCard },
  { id: 3, name: 'Confirmación', icon: CheckCircle2 }
];

export const CheckoutScreen = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart, freeShippingThreshold, updateQuantity, removeItem, appliedCoupon, setAppliedCoupon, discount, finalTotal } = useCart();
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGuestMode, setIsGuestMode] = useState(true);
  const [saveForLater, setSaveForLater] = useState<typeof items>([]);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState(SHIPPING_OPTIONS[0]);
  const [couponInput, setCouponInput] = useState('');
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponError, setCouponError] = useState('');

  const subtotal = totalPrice;
  const shippingCost = subtotal >= freeShippingThreshold || appliedCoupon?.type === 'shipping' ? 0 : selectedShipping.price;
  const total = subtotal - discount + shippingCost;

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.email) errors.email = 'Email es requerido';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email inválido';
      if (!formData.firstName) errors.firstName = 'Nombre es requerido';
      if (!formData.address) errors.address = 'Dirección es requerida';
      if (!formData.city) errors.city = 'Ciudad es requerida';
      if (!formData.phone) errors.phone = 'Teléfono es requerido';
    }
    
    if (step === 2) {
      if (!formData.cardNumber) errors.cardNumber = 'Número de tarjeta requerido';
      else if (formData.cardNumber.replace(/\s/g, '').length < 16) errors.cardNumber = 'Número de tarjeta inválido';
      if (!formData.expiry) errors.expiry = 'Fecha de expiración requerida';
      if (!formData.cvc) errors.cvc = 'CVC es requerido';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      showToast('Por favor completa todos los campos requeridos', 'error');
      return;
    }
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleCompleteOrder();
    }
  };

  const handleSaveForLater = (item: typeof items[0]) => {
    removeItem(item.id);
    setSaveForLater(prev => [...prev, item]);
    showToast(`${item.name} guardado para más tarde`, 'success');
  };

  const handleRestoreItem = (item: typeof saveForLater[0]) => {
    setSaveForLater(prev => prev.filter(i => i.id !== item.id));
    showToast(`${item.name} restaurado al carrito`, 'success');
  };

  const applyCoupon = () => {
    const coupon = AVAILABLE_COUPONS.find(c => c.code.toUpperCase() === couponInput.toUpperCase());
    
    if (!coupon) {
      setCouponError('Código de cupón inválido');
      return;
    }
    
    if (subtotal < coupon.minPurchase) {
      setCouponError(`Compra mínima $${coupon.minPurchase} para este cupón`);
      return;
    }
    
    setAppliedCoupon(coupon);
    setCouponError('');
    setShowCouponInput(false);
    showToast(`Cupón ${coupon.code} aplicado (-${coupon.discount}%)`, 'success');
    setCouponInput('');
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Cupón eliminado', 'success');
  };

  const handleCompleteOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      showToast('¡Pedido realizado con éxito!', 'success');
      clearCart();
      navigate('/');
    }, 2000);
  };

  if (items.length === 0 && !isProcessing) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col items-center justify-center p-8 text-center transition-colors duration-500">
        <div className="w-40 h-40 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-12 relative">
          <ShoppingBag className="w-20 h-20 text-zinc-200 dark:text-zinc-800" />
        </div>
        <h2 className="text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic mb-6">No hay nada <br /> <span className="text-primary">que pagar</span></h2>
        <button 
          onClick={() => navigate('/')}
          className="bg-primary text-white px-16 py-6 rounded-2xl font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group"
        >
          Ir de Compras
          <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-500 pb-40">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-20 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => navigate(-1)} 
                className="w-14 h-14 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-900 dark:text-white hover:bg-primary hover:text-white transition-all shadow-xl shadow-black/5"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h1 className="text-5xl lg:text-8xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic leading-none">Finalizar <br /> <span className="text-primary">Compra</span></h1>
            </div>
            <p className="text-zinc-400 font-black uppercase tracking-[0.3em] text-[10px] ml-20">Proceso de pago seguro y encriptado</p>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-4 lg:gap-8 bg-zinc-50 dark:bg-zinc-900 p-6 lg:p-10 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-xl">
            {steps.map((step, i) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center gap-3">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-2",
                    currentStep >= step.id 
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/30" 
                      : "bg-white dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 text-zinc-300"
                  )}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span className={cn(
                    "text-[9px] font-black uppercase tracking-widest",
                    currentStep >= step.id ? "text-primary" : "text-zinc-400"
                  )}>{step.name}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={cn(
                    "w-12 lg:w-20 h-0.5 rounded-full transition-all duration-500 mb-6",
                    currentStep > step.id ? "bg-primary" : "bg-zinc-200 dark:bg-zinc-800"
                  )} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-12">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-10"
                >
                  <div className="bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-10 lg:p-16 border border-zinc-100 dark:border-zinc-800 shadow-xl">
                    <h3 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic mb-8 md:mb-12 flex items-center gap-4">
                      <User className="w-6 md:w-8 h-6 md:h-8 text-primary" />
                      {isGuestMode ? 'Comprar como Invitado' : 'Crear Cuenta'}
                    </h3>
                    
                    <div className="flex gap-3 mb-8">
                      <button
                        onClick={() => setIsGuestMode(true)}
                        className={cn(
                          "px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                          isGuestMode 
                            ? "bg-primary text-white shadow-lg" 
                            : "bg-white dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900"
                        )}
                      >
                        <User className="w-4 h-4 inline mr-2" />
                        Invitado
                      </button>
                      <button
                        onClick={() => setIsGuestMode(false)}
                        className={cn(
                          "px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                          !isGuestMode 
                            ? "bg-primary text-white shadow-lg" 
                            : "bg-white dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900"
                        )}
                      >
                        <Sparkles className="w-4 h-4 inline mr-2" />
                        Crear Cuenta
                      </button>
                    </div>

                    <p className="text-zinc-500 text-sm mb-8">
                      {isGuestMode 
                        ? "Compra sin registrarte. Podrás rastrear tu pedido con el email que proporciones."
                        : "Crea una cuenta para acceder a ofertas exclusivas y trackear todos tus pedidos."}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Email *</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                          <input 
                            type="email" 
                            placeholder="tu@email.com" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className={cn(
                              "w-full bg-white dark:bg-zinc-800 border-2 rounded-xl md:rounded-2xl px-12 py-4 md:px-8 md:py-5 text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-700 font-medium text-sm outline-none transition-all",
                              formErrors.email ? "border-red-500 focus:border-red-500" : "border-transparent focus:border-primary"
                            )}
                          />
                        </div>
                        {formErrors.email && <p className="text-red-500 text-xs ml-2">{formErrors.email}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Teléfono *</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                          <input 
                            type="tel" 
                            placeholder="300 123 4567" 
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className={cn(
                              "w-full bg-white dark:bg-zinc-800 border-2 rounded-xl md:rounded-2xl px-12 py-4 md:px-8 md:py-5 text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-700 font-medium text-sm outline-none transition-all",
                              formErrors.phone ? "border-red-500 focus:border-red-500" : "border-transparent focus:border-primary"
                            )}
                          />
                        </div>
                        {formErrors.phone && <p className="text-red-500 text-xs ml-2">{formErrors.phone}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Nombre *</label>
                        <input 
                          type="text" 
                          placeholder="Tu nombre" 
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          className={cn(
                            "w-full bg-white dark:bg-zinc-800 border-2 rounded-xl md:rounded-2xl px-6 md:px-8 py-4 md:py-5 text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-700 font-medium text-sm outline-none transition-all",
                            formErrors.firstName ? "border-red-500 focus:border-red-500" : "border-transparent focus:border-primary"
                          )}
                        />
                        {formErrors.firstName && <p className="text-red-500 text-xs ml-2">{formErrors.firstName}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Apellido</label>
                        <input 
                          type="text" 
                          placeholder="Tu apellido" 
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          className="w-full bg-white dark:bg-zinc-800 border-2 border-transparent focus:border-primary rounded-xl md:rounded-2xl px-6 md:px-8 py-4 md:py-5 text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-700 font-medium text-sm outline-none transition-all"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Dirección *</label>
                        <input 
                          type="text" 
                          placeholder="Calle, Número, Apartamento" 
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          className={cn(
                            "w-full bg-white dark:bg-zinc-800 border-2 rounded-xl md:rounded-2xl px-6 md:px-8 py-4 md:py-5 text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-700 font-medium text-sm outline-none transition-all",
                            formErrors.address ? "border-red-500 focus:border-red-500" : "border-transparent focus:border-primary"
                          )}
                        />
                        {formErrors.address && <p className="text-red-500 text-xs ml-2">{formErrors.address}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Ciudad *</label>
                        <input 
                          type="text" 
                          placeholder="Ciudad" 
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          className={cn(
                            "w-full bg-white dark:bg-zinc-800 border-2 rounded-xl md:rounded-2xl px-6 md:px-8 py-4 md:py-5 text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-700 font-medium text-sm outline-none transition-all",
                            formErrors.city ? "border-red-500 focus:border-red-500" : "border-transparent focus:border-primary"
                          )}
                        />
                        {formErrors.city && <p className="text-red-500 text-xs ml-2">{formErrors.city}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Código Postal</label>
                        <input 
                          type="text" 
                          placeholder="11001" 
                          value={formData.zipCode}
                          onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                          className="w-full bg-white dark:bg-zinc-800 border-2 border-transparent focus:border-primary rounded-xl md:rounded-2xl px-6 md:px-8 py-4 md:py-5 text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-700 font-medium text-sm outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Shipping Options */}
                    <div className="pt-8 mt-8 border-t border-zinc-200 dark:border-zinc-800">
                    <h4 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight italic mb-6 flex items-center gap-3">
                      <Truck className="w-5 h-5 text-primary" />
                      Opciones de Envío
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {SHIPPING_OPTIONS.map((option) => {
                        const Icon = option.icon;
                        const isSelected = selectedShipping.id === option.id;
                        const finalPrice = subtotal >= freeShippingThreshold || appliedCoupon?.type === 'shipping' ? 0 : option.price;
                        return (
                          <button
                            key={option.id}
                            onClick={() => setSelectedShipping(option)}
                            className={cn(
                              "relative p-5 rounded-2xl border-2 transition-all text-left",
                              isSelected
                                ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                                : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                            )}
                          >
                            {option.badge && (
                              <span className={cn(
                                "absolute -top-2 -right-2 px-2 py-1 text-[8px] font-black uppercase tracking-wider rounded-full",
                                isSelected ? "bg-primary text-white" : "bg-amber-500 text-white"
                              )}>
                                {option.badge}
                              </span>
                            )}
                            <div className="flex items-center gap-3 mb-3">
                              <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center",
                                isSelected ? "bg-primary text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                              )}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-sm font-black text-zinc-900 dark:text-white">{option.name}</p>
                                <p className="text-[10px] text-zinc-400">{option.days}</p>
                              </div>
                            </div>
                            <p className={cn(
                              "text-lg font-black italic",
                              isSelected ? "text-primary" : "text-zinc-900 dark:text-white"
                            )}>
                              {finalPrice === 0 ? 'GRATIS' : `$${finalPrice.toFixed(2)}`}
                            </p>
                            {isSelected && (
                              <div className="absolute top-4 left-4 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </button>
                        );
}
                      })}
                    </div>
                  </div>
                </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-10"
                >
                  <div className="bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-10 lg:p-16 border border-zinc-100 dark:border-zinc-800 shadow-xl">
                    <h3 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic mb-8 md:mb-12 flex items-center gap-4">
                      <CreditCardIcon className="w-6 md:w-8 h-6 md:h-8 text-primary" />
                      Método de Pago
                    </h3>

                    <div className="grid grid-cols-3 gap-3 mb-8">
                      {['Visa', 'Mastercard', 'PayPal'].map((card) => (
                        <button key={card} className="p-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-primary transition-all text-center">
                          <span className="text-xs font-black uppercase tracking-wider">{card}</span>
                        </button>
                      ))}
                    </div>

                    <div className="space-y-6">
                      <div className="bg-zinc-900 dark:bg-zinc-800 rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 text-white relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-primary/20 blur-3xl rounded-full -mr-16 md:-mr-32 -mt-16 md:-mt-32" />
                        <div className="relative z-10 flex justify-between items-start mb-8 md:mb-16">
                          <div className="w-12 md:w-16 h-10 md:h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center">
                            <CreditCardIcon className="w-6 md:w-8 h-6 md:h-8 text-primary" />
                          </div>
                          <Lock className="w-5 md:w-6 h-5 md:h-6 text-white/40" />
                        </div>
                        <div className="space-y-4 md:space-y-8">
                          <div className="space-y-2">
                            <label className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-white/40">Número de Tarjeta *</label>
                            <input 
                              type="text" 
                              placeholder="0000 0000 0000 0000" 
                              maxLength={19}
                              value={formData.cardNumber}
                              onChange={(e) => {
                                let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                                value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                                setFormData({...formData, cardNumber: value});
                              }}
                              className={cn(
                                "w-full bg-transparent border-none text-xl md:text-3xl font-black tracking-[0.2em] placeholder:text-white/10 outline-none",
                                formErrors.cardNumber && "text-red-400"
                              )}
                            />
                            {formErrors.cardNumber && <p className="text-red-400 text-xs">{formErrors.cardNumber}</p>}
                          </div>
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-8">
                            <div className="space-y-2 w-full md:w-auto">
                              <label className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-white/40">Nombre del Titular</label>
                              <input 
                                type="text" 
                                placeholder="NOMBRE COMPLETO" 
                                className="w-full md:w-64 bg-transparent border-none text-xs md:text-sm font-black uppercase tracking-widest placeholder:text-white/10 outline-none"
                              />
                            </div>
                            <div className="flex gap-4 md:gap-8">
                              <div className="space-y-2">
                                <label className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-white/40">Exp</label>
                                <input 
                                  type="text" 
                                  placeholder="MM/YY" 
                                  maxLength={5}
                                  value={formData.expiry}
                                  onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                                  className={cn(
                                    "w-16 md:w-20 bg-transparent border-none text-xs md:text-sm font-black uppercase tracking-widest placeholder:text-white/10 outline-none",
                                    formErrors.expiry && "text-red-400"
                                  )}
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-white/40">CVC</label>
                                <input 
                                  type="text" 
                                  placeholder="000" 
                                  maxLength={3}
                                  value={formData.cvc}
                                  onChange={(e) => setFormData({...formData, cvc: e.target.value})}
                                  className={cn(
                                    "w-12 md:w-16 bg-transparent border-none text-xs md:text-sm font-black uppercase tracking-widest placeholder:text-white/10 outline-none",
                                    formErrors.cvc && "text-red-400"
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        <span className="text-xs font-medium text-emerald-800 dark:text-emerald-400">
                          Tus datos están protegidos con encriptación SSL de 256 bits
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-10"
                >
                  <div className="bg-zinc-50 dark:bg-zinc-900 rounded-[3.5rem] p-16 lg:p-24 border border-zinc-100 dark:border-zinc-800 shadow-xl text-center space-y-10">
                    <div className="flex justify-center">
                      <div className="w-32 h-32 rounded-[3rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 relative">
                        <CheckCircle2 className="w-16 h-16" />
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 border-4 border-emerald-500 rounded-[3rem]"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic leading-none">Todo listo <br /> <span className="text-primary">para el envío</span></h3>
                      <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg max-w-md mx-auto">Revisa tu información por última vez antes de confirmar tu pedido exclusivo.</p>
                    </div>
                    <div className="bg-white dark:bg-zinc-800 rounded-3xl p-8 border border-zinc-100 dark:border-zinc-700 text-left space-y-4 shadow-inner">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Destino</span>
                        <span className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-tighter">{formData.address || 'Calle Principal 123'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Pago</span>
                        <span className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-tighter">Visa terminada en 4242</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between items-center pt-10">
              <button 
                onClick={() => currentStep > 1 && setCurrentStep(prev => prev - 1)}
                className={cn(
                  "px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-3",
                  currentStep === 1 ? "opacity-0 pointer-events-none" : "bg-zinc-50 dark:bg-zinc-900 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                )}
              >
                <ChevronLeft className="w-4 h-4" />
                Atrás
              </button>
              <button 
                onClick={handleNext}
                disabled={isProcessing}
                className="bg-primary text-white px-16 py-6 rounded-2xl font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-4 group"
              >
                {isProcessing ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {currentStep === 3 ? 'Confirmar Pedido' : 'Siguiente Paso'}
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8 space-y-6">
              <div className="bg-zinc-900 dark:bg-zinc-900 text-white rounded-2xl md:rounded-[3.5rem] p-6 md:p-10 lg:p-14 shadow-2xl relative overflow-hidden border border-white/5">
                <div className="absolute top-0 right-0 w-32 md:w-40 h-32 md:h-40 bg-primary/10 blur-3xl rounded-full -mr-16 md:-mr-20 -mt-16 md:-mt-20" />
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic mb-8 md:mb-12 relative z-10">Tu Pedido</h2>
                
                {/* Mobile Expand Toggle */}
                <button 
                  onClick={() => {
                    const summary = document.getElementById('order-summary');
                    summary?.classList.toggle('hidden');
                  }}
                  className="lg:hidden w-full flex items-center justify-between mb-4"
                >
                  <span className="text-xs font-bold text-zinc-400">Ver productos ({items.length})</span>
                  <ArrowRight className="w-4 h-4 text-zinc-400" />
                </button>
                
                <div id="order-summary" className="hidden lg:block space-y-4 md:space-y-8 relative z-10 mb-8 md:mb-12 max-h-64 md:max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {items.map(item => (
                    <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 md:gap-6 items-center group">
                      <div className="w-16 md:w-20 h-16 md:h-20 rounded-xl md:rounded-2xl overflow-hidden bg-white/5 shrink-0 border border-white/10 relative">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center">{item.quantity}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-black uppercase tracking-tighter italic truncate">{item.name}</h4>
                        <p className="text-[8px] md:text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Talla: {item.selectedSize}</p>
                      </div>
                      <span className="text-base md:text-lg font-black tracking-tighter italic">${(item.price * item.quantity).toFixed(2)}</span>
                      <button 
                        onClick={() => handleSaveForLater(item)}
                        className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-amber-500 hover:text-white"
                        title="Guardar para después"
                      >
                        <Package className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {saveForLater.length > 0 && (
                  <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-3">Guardados para más tarde</p>
                    {saveForLater.map(item => (
                      <div key={item.id} className="flex items-center justify-between text-xs mb-2">
                        <span className="truncate flex-1 mr-2">{item.name}</span>
                        <button onClick={() => handleRestoreItem(item)} className="text-primary font-black hover:underline">Restaurar</button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Coupon Section */}
                <div className="pt-6 md:pt-10 border-t border-white/10">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-emerald-500/20 p-3 rounded-xl mb-4">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-400 uppercase">{appliedCoupon.code}</span>
                        <span className="text-[10px] text-emerald-400/70">-{appliedCoupon.discount}%</span>
                      </div>
                      <button onClick={removeCoupon} className="text-emerald-400 hover:text-red-400">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : showCouponInput ? (
                    <div className="mb-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                          placeholder="Código de cupón"
                          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs font-bold uppercase text-white placeholder:text-white/40"
                        />
                        <button
                          onClick={applyCoupon}
                          className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold"
                        >
                          Aplicar
                        </button>
                      </div>
                      {couponError && <p className="text-red-400 text-[10px] mt-1">{couponError}</p>}
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowCouponInput(true)}
                      className="flex items-center gap-2 text-primary text-xs font-bold uppercase mb-4 hover:text-primary/80 transition-colors"
                    >
                      <Tag className="w-4 h-4" />
                      ¿Tienes un cupón?
                    </button>
                  )}

                  {/* Shipping Selection */}
                  <div className="flex items-center justify-between py-3 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-zinc-400" />
                      <span className="text-xs font-medium text-zinc-400">{selectedShipping.name}</span>
                    </div>
                    <span className={cn(
                      "text-sm font-black",
                      shippingCost === 0 ? "text-emerald-400" : "text-white"
                    )}>
                      {shippingCost === 0 ? 'GRATIS' : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="space-y-4 md:space-y-6 pt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px]">Subtotal</span>
                      <span className="text-lg md:text-xl font-black tracking-tighter">${subtotal.toFixed(2)}</span>
                    </div>
                    {appliedCoupon && discount > 0 && (
                      <div className="flex justify-between items-center text-emerald-400">
                        <span className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px]">Descuento</span>
                        <span className="text-lg md:text-xl font-black tracking-tighter">-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px]">Envío</span>
                      <span className={cn(
                        "text-lg md:text-xl font-black tracking-tighter",
                        shippingCost === 0 ? "text-emerald-400" : "text-white"
                      )}>
                        {shippingCost === 0 ? 'GRATIS' : `$${shippingCost.toFixed(2)}`}
                      </span>
                    </div>
                    {shippingCost > 0 && subtotal < freeShippingThreshold && (
                      <div className="text-xs text-amber-400 bg-amber-500/10 p-3 rounded-lg">
                        ¡Añade ${(freeShippingThreshold - subtotal).toFixed(2)} más para obtener envío gratis!
                      </div>
                    )}
                    <div className="pt-4 md:pt-8 flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px] mb-1">Total Final</span>
                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">IVA Incluido</span>
                      </div>
                      <span className="text-4xl md:text-5xl lg:text-6xl font-black text-primary tracking-tighter italic leading-none">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

            {/* Security Badges */}
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 border border-zinc-100 dark:border-zinc-800 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest">Pago 100% Seguro</h5>
                  <p className="text-[10px] font-medium text-zinc-400">Encriptación SSL de grado militar</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest">Envío Express</h5>
                  <p className="text-[10px] font-medium text-zinc-400">24-48h garantizado</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest">30 Días Devolución</h5>
                  <p className="text-[10px] font-medium text-zinc-400">Sin preguntas</p>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-8 space-y-6">
            <div className="bg-zinc-900 dark:bg-zinc-900 text-white rounded-2xl md:rounded-[3.5rem] p-6 md:p-10 lg:p-14 shadow-2xl relative overflow-hidden border border-white/5">
              <div className="absolute top-0 right-0 w-32 md:w-40 h-32 md:h-40 bg-primary/10 blur-3xl rounded-full -mr-16 md:-mr-20 -mt-16 md:-mt-20" />
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic mb-8 md:mb-12 relative z-10">Tu Pedido</h2>
              
              <button 
                onClick={() => {
                  const summary = document.getElementById('order-summary');
                  summary?.classList.toggle('hidden');
                }}
                className="lg:hidden w-full flex items-center justify-between mb-4"
              >
                <span className="text-xs font-bold text-zinc-400">Ver productos ({items.length})</span>
                <ArrowRight className="w-4 h-4 text-zinc-400" />
              </button>
              
              <div id="order-summary" className="hidden lg:block space-y-4 md:space-y-8 relative z-10 mb-8 md:mb-12 max-h-64 md:max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {items.map(item => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 md:gap-6 items-center group">
                    <div className="w-16 md:w-20 h-16 md:h-20 rounded-xl md:rounded-2xl overflow-hidden bg-white/5 shrink-0 border border-white/10 relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center">{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs md:text-sm font-black uppercase tracking-tighter italic truncate">{item.name}</h4>
                      <p className="text-[8px] md:text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Talla: {item.selectedSize}</p>
                    </div>
                    <span className="text-base md:text-lg font-black tracking-tighter italic">${(item.price * item.quantity).toFixed(2)}</span>
                    <button 
                      onClick={() => handleSaveForLater(item)}
                      className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-amber-500 hover:text-white"
                      title="Guardar para después"
                    >
                      <Package className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {saveForLater.length > 0 && (
                <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-3">Guardados para más tarde</p>
                  {saveForLater.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-xs mb-2">
                      <span className="truncate flex-1 mr-2">{item.name}</span>
                      <button onClick={() => handleRestoreItem(item)} className="text-primary font-black hover:underline">Restaurar</button>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-6 md:pt-10 border-t border-white/10">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-500/20 p-3 rounded-xl mb-4">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-400 uppercase">{appliedCoupon.code}</span>
                      <span className="text-[10px] text-emerald-400/70">-{appliedCoupon.discount}%</span>
                    </div>
                    <button onClick={removeCoupon} className="text-emerald-400 hover:text-red-400">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : showCouponInput ? (
                  <div className="mb-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                        placeholder="Código de cupón"
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs font-bold uppercase text-white placeholder:text-white/40"
                      />
                      <button
                        onClick={applyCoupon}
                        className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold"
                      >
                        Aplicar
                      </button>
                    </div>
                    {couponError && <p className="text-red-400 text-[10px] mt-1">{couponError}</p>}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowCouponInput(true)}
                    className="flex items-center gap-2 text-primary text-xs font-bold uppercase mb-4 hover:text-primary/80 transition-colors"
                  >
                    <Tag className="w-4 h-4" />
                    ¿Tienes un cupón?
                  </button>
                )}

                <div className="flex items-center justify-between py-3 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-zinc-400" />
                    <span className="text-xs font-medium text-zinc-400">{selectedShipping.name}</span>
                  </div>
                  <span className={cn(
                    "text-sm font-black",
                    shippingCost === 0 ? "text-emerald-400" : "text-white"
                  )}>
                    {shippingCost === 0 ? 'GRATIS' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>

                <div className="space-y-4 md:space-y-6 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px]">Subtotal</span>
                    <span className="text-lg md:text-xl font-black tracking-tighter">${subtotal.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && discount > 0 && (
                    <div className="flex justify-between items-center text-emerald-400">
                      <span className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px]">Descuento</span>
                      <span className="text-lg md:text-xl font-black tracking-tighter">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px]">Envío</span>
                    <span className={cn(
                      "text-lg md:text-xl font-black tracking-tighter",
                      shippingCost === 0 ? "text-emerald-400" : "text-white"
                    )}>
                      {shippingCost === 0 ? 'GRATIS' : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  {shippingCost > 0 && subtotal < freeShippingThreshold && (
                    <div className="text-xs text-amber-400 bg-amber-500/10 p-3 rounded-lg">
                      ¡Añade ${(freeShippingThreshold - subtotal).toFixed(2)} más para obtener envío gratis!
                    </div>
                  )}
                  <div className="pt-4 md:pt-8 flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px] mb-1">Total Final</span>
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">IVA Incluido</span>
                    </div>
                    <span className="text-4xl md:text-5xl lg:text-6xl font-black text-primary tracking-tighter italic leading-none">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 border border-zinc-100 dark:border-zinc-800 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest">Pago 100% Seguro</h5>
                  <p className="text-[10px] font-medium text-zinc-400">Encriptación SSL de grado militar</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest">Envío Express</h5>
                  <p className="text-[10px] font-medium text-zinc-400">24-48h garantizado</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest">30 Días Devolución</h5>
                  <p className="text-[10px] font-medium text-zinc-400">Sin preguntas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 p-4 shadow-2xl z-50">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Total</p>
          <p className="text-2xl font-black text-primary italic tracking-tighter">${total.toFixed(2)}</p>
        </div>
        <button 
          onClick={handleNext}
          disabled={isProcessing}
          className="bg-primary text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-primary/30 flex items-center gap-2"
        >
          {isProcessing ? (
            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              {currentStep === 3 ? 'Confirmar' : 'Siguiente'}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
};
};
