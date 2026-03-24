import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  CreditCard,
  ChevronLeft,
  ArrowRight,
  Lock,
  Package,
  Check,
  Tag,
  X,
  CheckCircle2,
  Smartphone,
  Building,
  Wallet,
  Banknote
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import { useStore } from '../context/StoreContext';
import { formatPriceCOP } from '../lib/utils';
import { COLOMBIAN_DEPARTMENTS, getCitiesByDepartment } from '../data/colombiaData';

interface PaymentMethodOption {
  id: string;
  name: string;
  desc: string;
  icon: 'cod' | 'nequi' | 'daviplata' | 'bancolombia' | 'breb';
  type: 'cod' | 'transfer';
}

const getPaymentIcon = (iconType: string) => {
  switch (iconType) {
    case 'nequi': return Smartphone;
    case 'daviplata': return Smartphone;
    case 'bancolombia': return Building;
    case 'breb': return Wallet;
    case 'cod': return Banknote;
    default: return CreditCard;
  }
};

const defaultPaymentMethods: PaymentMethodOption[] = [
  { id: 'cod', name: 'Contra Entrega', desc: 'Paga en efectivo al recibir tu pedido', icon: 'cod', type: 'cod' },
  { id: 'nequi', name: 'Nequi', desc: 'Paga desde la app Nequi', icon: 'nequi', type: 'transfer' },
  { id: 'daviplata', name: 'Daviplata', desc: 'Paga desde DaviPlata', icon: 'daviplata', type: 'transfer' },
  { id: 'bancolombia', name: 'Bancolombia', desc: 'Transferencia a Bancolombia', icon: 'bancolombia', type: 'transfer' },
  { id: 'breb', name: 'Bre-B', desc: 'Pago instantáneo con Bre-B', icon: 'breb', type: 'transfer' },
];

export const CheckoutScreen = () => {
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart, appliedCoupon, setAppliedCoupon, coupons } = useCart();
  const { addOrder } = useOrders();
  const { showToast } = useToast();
  const { getStoreName, settings } = useStore();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodOption[]>([]);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    city: '',
    address: '',
    notes: '',
    paymentMethod: 'cod'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const savedMethods = localStorage.getItem('paymentMethods');
    if (savedMethods) {
      try {
        const methods = JSON.parse(savedMethods);
        const activeMethods = methods.filter((m: { active: boolean }) => m.active);
        const mappedMethods: PaymentMethodOption[] = activeMethods.map((m: { id: string; name: string; desc: string; type?: string }) => {
          const iconMap: Record<string, 'cod' | 'nequi' | 'daviplata' | 'bancolombia' | 'breb'> = {
            'cod': 'cod',
            'nequi': 'nequi',
            'daviplata': 'daviplata',
            'bancolombia': 'bancolombia',
            'breb': 'breb'
          };
          return {
            id: m.id,
            name: m.name,
            desc: m.desc,
            icon: iconMap[m.id] || 'cod',
            type: (m.type === 'cod' ? 'cod' : 'transfer') as 'cod' | 'transfer'
          };
        });
        setPaymentMethods(mappedMethods);
        if (mappedMethods.length > 0 && !mappedMethods.find(m => m.id === formData.paymentMethod)) {
          setFormData(prev => ({ ...prev, paymentMethod: mappedMethods[0].id }));
        }
      } catch {
        setPaymentMethods(defaultPaymentMethods);
      }
    } else {
      setPaymentMethods(defaultPaymentMethods);
    }
  }, []);

  const formatCOP = (amount: number) => formatPriceCOP(amount);
  
  const subtotal = totalPrice;
  const discount = appliedCoupon
    ? appliedCoupon.type === 'percent'
      ? (subtotal * appliedCoupon.discount) / 100
      : appliedCoupon.type === 'fixed'
        ? appliedCoupon.discount
        : 0
    : 0;
  const couponFreeShipping = appliedCoupon?.type === 'shipping';
  
  const shippingSettings = JSON.parse(localStorage.getItem('shippingSettings') || '{"freeShippingThreshold":150000,"fixedShippingCost":12000}');
  const freeShippingThreshold = shippingSettings.freeShippingThreshold || 150000;
  const fixedShippingCost = shippingSettings.fixedShippingCost || 12000;
  const shipping = (subtotal >= freeShippingThreshold || couponFreeShipping) ? 0 : fixedShippingCost;
  const total = subtotal + shipping - discount;

  const cities = formData.department ? getCitiesByDepartment(formData.department) : [];

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) {
      setCouponError('Ingresa un código de cupón');
      return;
    }
    
    const found = coupons.find(c => c.code.toUpperCase() === couponInput.toUpperCase() && c.active);
    if (!found) {
      setCouponError('Código de cupón inválido');
      return;
    }
    if (found.minPurchase && subtotal < found.minPurchase) {
      setCouponError(`Compra mínima de ${formatCOP(found.minPurchase)} para usar este cupón`);
      return;
    }
    
    setAppliedCoupon(found);
    setCouponInput('');
    setCouponError('');
    showToast(`¡Cupón ${found.code} aplicado!`, 'success');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    showToast('Cupón removido', 'info');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es requerido';
    if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es requerido';
    if (!formData.department) newErrors.department = 'Selecciona un departamento';
    if (!formData.city) newErrors.city = 'Selecciona una ciudad';
    if (!formData.address.trim()) newErrors.address = 'La dirección es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Por favor completa todos los campos requeridos', 'error');
      return;
    }

    if (cart.length === 0) {
      showToast('Tu carrito está vacío', 'error');
      return;
    }

    setIsProcessing(true);

    const selectedPaymentMethod = paymentMethods.find(m => m.id === formData.paymentMethod);
    const isTransferPayment = selectedPaymentMethod?.type === 'transfer';

    const orderData = {
      customer: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: '',
      address: formData.address,
      city: formData.city,
      department: formData.department,
      items: cart.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.selectedSize || 'Única',
        image: item.image,
      })),
      subtotal,
      shipping,
      discount,
      couponCode: appliedCoupon?.code,
      total,
      status: 'pending' as const,
      paymentMethod: formData.paymentMethod,
      paymentStatus: isTransferPayment ? 'pending_payment' : 'pending',
      notes: formData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      addOrder(orderData);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (isTransferPayment) {
        const orderId = `JEAN-${Date.now().toString().slice(-6)}`;
        const whatsappNumber = settings.socialMedia?.whatsapp || '573001234567';
        const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
        const message = `🏷️ *PEDIDO #${orderId}*

¡Hola! Acabo de hacer un pedido en *JEANCOL* y deseo proceder con el pago por *${selectedPaymentMethod?.name}*.

📦 *Detalles del pedido:*
• Total a pagar: *${formatCOP(total)}*
• Método de pago: ${selectedPaymentMethod?.name}

📍 *Datos de envío:*
• Nombre: ${formData.firstName} ${formData.lastName}
• Dirección: ${formData.address}
• Ciudad: ${formData.city}, ${formData.department}

Por favor indícame los datos para realizar el pago. ¡Gracias!`;

        const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
        
        showToast('¡Pedido guardado! Redirigiendo a WhatsApp...', 'success');
        setAppliedCoupon(null);
        clearCart();
        
        window.open(whatsappUrl, '_blank');
        navigate('/');
      } else {
        showToast('¡Pedido realizado con éxito! Te contactaremos pronto.', 'success');
        setAppliedCoupon(null);
        clearCart();
        navigate('/');
      }
    } catch (error) {
      showToast('Error al procesar el pedido', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0 && !isProcessing) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-8">
          <Package className="w-12 h-12 text-zinc-300 dark:text-zinc-700" />
        </div>
        <h2 className="text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-4">
          Tu carrito está vacío
        </h2>
        <p className="text-zinc-500 mb-8">Agrega productos para continuar con tu pedido</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-primary text-white px-10 py-4 rounded-full font-bold text-sm uppercase tracking-wider shadow-lg hover:scale-105 transition-transform"
        >
          Explorar Productos
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      <main className="pt-16 lg:pt-20 pb-24 lg:pb-20 px-4 lg:px-6 max-w-7xl mx-auto">
        <header className="mb-10 lg:mb-12">
          <div className="flex items-center gap-2 text-primary font-bold text-xs lg:text-sm uppercase tracking-[0.2em] mb-2">
            <Lock className="w-3 h-3" />
            Pago Seguro
          </div>
          <h1 className="text-3xl lg:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Finalice su adquisición.
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <section className="lg:col-span-7 space-y-6 lg:space-y-8">
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl lg:rounded-2xl p-6 lg:p-8">
              <h2 className="text-lg lg:text-xl font-bold mb-6 lg:mb-8 flex items-center gap-3 text-zinc-900 dark:text-white">
                <Truck className="w-5 h-5 text-primary" />
                Información de Envío
              </h2>
              <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs lg:text-sm font-semibold text-zinc-500 dark:text-zinc-400">Nombre *</label>
                    <input
                      type="text"
                      placeholder="Juan"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className={`bg-white dark:bg-zinc-800 border ${errors.firstName ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'} rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    />
                    {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs lg:text-sm font-semibold text-zinc-500 dark:text-zinc-400">Apellidos *</label>
                    <input
                      type="text"
                      placeholder="Pérez"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className={`bg-white dark:bg-zinc-800 border ${errors.lastName ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'} rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    />
                    {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs lg:text-sm font-semibold text-zinc-500 dark:text-zinc-400">Correo electrónico (opcional)</label>
                  <input
                    type="email"
                    placeholder="juan@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs lg:text-sm font-semibold text-zinc-500 dark:text-zinc-400">Departamento *</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value, city: ''})}
                      className={`bg-white dark:bg-zinc-800 border ${errors.department ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'} rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none`}
                    >
                      <option value="">Seleccionar departamento</option>
                      {COLOMBIAN_DEPARTMENTS.map((dept) => (
                        <option key={dept.id} value={dept.name}>{dept.name}</option>
                      ))}
                    </select>
                    {errors.department && <p className="text-xs text-red-500">{errors.department}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs lg:text-sm font-semibold text-zinc-500 dark:text-zinc-400">Ciudad *</label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      disabled={!formData.department}
                      className={`bg-white dark:bg-zinc-800 border ${errors.city ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'} rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none disabled:opacity-50`}
                    >
                      <option value="">Seleccionar ciudad</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs lg:text-sm font-semibold text-zinc-500 dark:text-zinc-400">Dirección exacta *</label>
                  <input
                    type="text"
                    placeholder="Nombre de calle, edificio, número de apartamento"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className={`bg-white dark:bg-zinc-800 border ${errors.address ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'} rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/50`}
                  />
                  {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs lg:text-sm font-semibold text-zinc-500 dark:text-zinc-400">Nota (opcional)</label>
                  <textarea
                    placeholder="Instrucciones especiales para la entrega..."
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>
              </form>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl lg:rounded-2xl p-6 lg:p-8">
              <h2 className="text-lg lg:text-xl font-bold mb-5 flex items-center gap-3 text-zinc-900 dark:text-white">
                <CreditCard className="w-5 h-5 text-primary" />
                Método de Pago
              </h2>
              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = getPaymentIcon(method.icon);
                  const isSelected = formData.paymentMethod === method.id;
                  return (
                    <motion.button
                      key={method.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id }))}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                        isSelected 
                          ? 'bg-primary/10 ring-2 ring-primary' 
                          : 'bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                      }`}
                    >
                      <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected 
                          ? 'border-primary bg-primary' 
                          : 'border-zinc-300 dark:border-zinc-600'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-zinc-400'}`} />
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-sm text-zinc-900 dark:text-white">{method.name}</span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">{method.desc}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </section>

          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-8 bg-zinc-50 dark:bg-zinc-900 rounded-xl lg:rounded-2xl p-6 lg:p-8 shadow-sm">
              <h2 className="text-xl lg:text-2xl font-bold mb-6 lg:mb-8 text-zinc-900 dark:text-white">Resumen del pedido</h2>
              
              <div className="space-y-4 lg:space-y-6 mb-6 lg:mb-8">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex gap-3 lg:gap-4">
                    <div className="h-16 w-16 lg:h-20 lg:w-20 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-full w-full object-cover" 
                        referrerPolicy="no-referrer" 
                      />
                    </div>
                    <div className="flex flex-col justify-center flex-grow min-w-0">
                      <h3 className="font-bold text-sm lg:text-base text-zinc-900 dark:text-white truncate">{item.name}</h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{item.selectedSize}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs lg:text-sm font-medium text-zinc-600 dark:text-zinc-300">Cant: {item.quantity}</span>
                        <span className="font-bold text-primary text-sm lg:text-base">{formatCOP(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {!appliedCoupon ? (
                <div className="mb-6">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        type="text"
                        placeholder="Código de cupón"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value.toUpperCase());
                          setCouponError('');
                        }}
                        className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-11 pr-4 py-3 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <button
                      onClick={handleApplyCoupon}
                      className="px-5 py-3 bg-zinc-900 dark:bg-zinc-800 text-white rounded-xl font-bold text-xs hover:bg-primary transition-colors"
                    >
                      Aplicar
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-xs text-red-500 mt-2 px-1">{couponError}</p>
                  )}
                </div>
              ) : (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400">{appliedCoupon.code}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{appliedCoupon.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="pt-6 space-y-3 lg:space-y-4">
                <div className="flex justify-between text-sm text-zinc-500 dark:text-zinc-400 px-1">
                  <span>Subtotal</span>
                  <span>{formatCOP(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-zinc-500 dark:text-zinc-400 px-1">
                  <span>Envío</span>
                  <span className={shipping === 0 ? 'text-emerald-500 font-medium' : ''}>
                    {shipping === 0 ? 'Gratis' : formatCOP(shipping)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-500 font-medium px-1">
                    <span>Descuento</span>
                    <span>-{formatCOP(discount)}</span>
                  </div>
                )}
                <div className="h-px bg-zinc-200 dark:bg-zinc-700 my-3"></div>
                <div className="flex justify-between items-end px-1">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Total</span>
                    <span className="text-2xl lg:text-3xl font-extrabold text-zinc-900 dark:text-white">{formatCOP(total)}</span>
                  </div>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 mb-1">COP</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="w-full mt-8 py-4 lg:py-5 rounded-full bg-gradient-to-br from-primary to-purple-600 text-white font-bold text-base lg:text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Confirmar Pedido
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs">
                <Lock className="w-3.5 h-3.5" />
                Pago seguro con cifrado SSL
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 py-10 lg:py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-4 gap-4 lg:gap-6">
          <div className="font-bold text-zinc-900 dark:text-white">{getStoreName()}</div>
          <div className="flex flex-wrap justify-center gap-4 lg:gap-8">
            <a className="text-zinc-500 hover:text-primary transition-colors text-xs lg:text-sm" href="#">Política de Privacidad</a>
            <a className="text-zinc-500 hover:text-primary transition-colors text-xs lg:text-sm" href="#">Términos de Servicio</a>
            <a className="text-zinc-500 hover:text-primary transition-colors text-xs lg:text-sm" href="#">Información de Envío</a>
            <a className="text-zinc-500 hover:text-primary transition-colors text-xs lg:text-sm" href="#">Contacto</a>
          </div>
          <div className="text-zinc-500 text-xs lg:text-sm">
            © {new Date().getFullYear()} {getStoreName()}. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CheckoutScreen;
