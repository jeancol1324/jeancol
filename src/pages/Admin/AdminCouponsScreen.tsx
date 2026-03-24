import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, X, Pencil, Trash2, Ticket, Save, ToggleLeft, ToggleRight, Copy, Percent, DollarSign, ArrowLeft, Calendar, Sparkles, AlertCircle } from 'lucide-react';
import { useCoupons } from '../../context/CouponContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { Coupon } from '../../types';

export const AdminCouponsScreen = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, toggleCouponStatus } = useCoupons();
  const { theme } = useTheme();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [previewDiscount, setPreviewDiscount] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 10,
    minPurchase: 0,
    maxDiscount: 0,
    maxUses: 0,
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: true,
    description: ''
  });

  const filteredCoupons = coupons.filter(c => {
    const matchesSearch = c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' ||
      (filter === 'active' && c.isActive && !isExpired(c)) ||
      (filter === 'inactive' && (!c.isActive || isExpired(c)));
    return matchesSearch && matchesFilter;
  });

  const generateDiscountPreview = (value: number, type: 'percentage' | 'fixed', maxDisc?: number) => {
    const testAmount = 100000;
    let discount = type === 'percentage' ? (testAmount * value) / 100 : value;
    if (maxDisc && type === 'percentage') discount = Math.min(discount, maxDisc);
    setPreviewDiscount(discount);
  };

  const openModal = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        minPurchase: coupon.minPurchase || 0,
        maxDiscount: coupon.maxDiscount || 0,
        maxUses: coupon.maxUses || 0,
        validFrom: coupon.validFrom,
        validUntil: coupon.validUntil,
        isActive: coupon.isActive,
        description: coupon.description || ''
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        type: 'percentage',
        value: 10,
        minPurchase: 0,
        maxDiscount: 0,
        maxUses: 0,
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isActive: true,
        description: ''
      });
    }
    setPreviewDiscount(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCoupon(null);
    setPreviewDiscount(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code) {
      showToast('El código es requerido', 'error');
      return;
    }

    if (formData.type === 'percentage' && formData.value > 100) {
      showToast('El porcentaje no puede ser mayor a 100%', 'error');
      return;
    }

    if (new Date(formData.validFrom) > new Date(formData.validUntil)) {
      showToast('La fecha de inicio debe ser anterior a la fecha fin', 'error');
      return;
    }

    const existingCoupon = coupons.find(c => c.code.toUpperCase() === formData.code.toUpperCase() && c.id !== editingCoupon?.id);
    if (existingCoupon) {
      showToast('Este código ya existe', 'error');
      return;
    }

    const couponData = {
      ...formData,
      minPurchase: formData.minPurchase || undefined,
      maxDiscount: formData.maxDiscount || undefined,
      maxUses: formData.maxUses || undefined,
    };

    if (editingCoupon) {
      updateCoupon(editingCoupon.id, couponData);
    } else {
      addCoupon(couponData);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este cupón?')) {
      deleteCoupon(id);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast('Código copiado', 'success');
  };

  const formatValue = (coupon: Coupon) => {
    if (coupon.type === 'percentage') {
      return `${coupon.value}%`;
    }
    return `$${coupon.value.toLocaleString('es-CO')}`;
  };

  const isExpired = (coupon: Coupon) => {
    return new Date(coupon.validUntil) < new Date();
  };

  const getDaysRemaining = (validUntil: string) => {
    const now = new Date();
    const end = new Date(validUntil);
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const getStatusBadge = (coupon: Coupon) => {
    const expired = isExpired(coupon);
    const daysLeft = getDaysRemaining(coupon.validUntil);

    if (expired) {
      return { text: 'Expirado', class: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' };
    }
    if (!coupon.isActive) {
      return { text: 'Inactivo', class: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400' };
    }
    if (daysLeft <= 3) {
      return { text: `Expira en ${daysLeft} día${daysLeft !== 1 ? 's' : ''}`, class: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' };
    }
    if (daysLeft <= 7) {
      return { text: `${daysLeft} días restantes`, class: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' };
    }
    return { text: 'Activo', class: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' };
  };

  const activeCount = coupons.filter(c => c.isActive && !isExpired(c)).length;
  const expiredCount = coupons.filter(c => !c.isActive || isExpired(c)).length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 h-16 lg:h-20 px-4 lg:px-8 flex items-center">
        <div className="w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.history.back()}
              className="p-2 -ml-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
            </button>
            <div>
              <h1 className="text-lg lg:text-2xl font-black text-zinc-900 dark:text-white">Cupones</h1>
              <p className="text-xs lg:text-sm text-zinc-500 dark:text-zinc-400">
                {activeCount} activos • {expiredCount} inactivos
              </p>
            </div>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-primary text-white px-4 lg:px-5 py-2.5 lg:py-3 rounded-xl text-xs lg:text-sm font-bold shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
            <span className="hidden sm:inline">Nuevo Cupón</span>
          </button>
        </div>
      </header>

      <div className="p-4 lg:p-6 xl:p-8 pb-28 lg:pb-12">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl lg:rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm lg:shadow-xl overflow-hidden">
          <div className="p-4 lg:p-6 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Buscar cupones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                />
              </div>
              <div className="flex gap-2">
                {(['all', 'active', 'inactive'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors ${
                      filter === f
                        ? 'bg-primary text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {f === 'all' ? 'Todos' : f === 'active' ? 'Activos' : 'Inactivos'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredCoupons.length === 0 ? (
            <div className="p-12 lg:p-16 text-center">
              <div className="w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <Ticket className="w-10 h-10 lg:w-12 lg:h-12 text-zinc-300 dark:text-zinc-600" />
              </div>
              <p className="text-lg lg:text-xl font-bold text-zinc-900 dark:text-white mb-1">Sin cupones</p>
              <p className="text-sm lg:text-base text-zinc-500 dark:text-zinc-400">Crea tu primer cupón</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4 lg:p-6">
              {filteredCoupons.map((coupon) => {
                const status = getStatusBadge(coupon);
                const usagePercent = coupon.maxUses ? (coupon.usedCount / coupon.maxUses) * 100 : 0;
                
                return (
                  <motion.div
                    key={coupon.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative p-5 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-primary/50 dark:hover:border-primary/50 transition-all bg-zinc-50 dark:bg-zinc-800/30 group"
                  >
                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openModal(coupon)}
                        className="p-2 rounded-lg bg-white dark:bg-zinc-700 text-zinc-500 hover:bg-primary hover:text-white transition-colors shadow-sm"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="p-2 rounded-lg bg-white dark:bg-zinc-700 text-zinc-500 hover:bg-red-500 hover:text-white transition-colors shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
                        <Ticket className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-black text-lg text-zinc-900 dark:text-white">{coupon.code}</span>
                          <button
                            onClick={() => copyCode(coupon.code)}
                            className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                          >
                            <Copy className="w-4 h-4 text-zinc-400" />
                          </button>
                        </div>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${status.class}`}>
                          {status.text}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-1 text-2xl font-black text-zinc-900 dark:text-white">
                          {coupon.type === 'percentage' ? (
                            <Percent className="w-5 h-5" />
                          ) : (
                            <DollarSign className="w-5 h-5" />
                          )}
                          {coupon.type === 'percentage' ? coupon.value : coupon.value.toLocaleString('es-CO')}
                          {coupon.type === 'percentage' && <span className="text-base">%</span>}
                          {coupon.type === 'fixed' && <span className="text-sm text-zinc-500">COP</span>}
                        </div>
                        {coupon.minPurchase && (
                          <p className="text-xs text-zinc-500 mt-0.5">Mín. ${coupon.minPurchase.toLocaleString('es-CO')}</p>
                        )}
                      </div>
                      {coupon.maxDiscount && coupon.type === 'percentage' && (
                        <div className="text-right">
                          <p className="text-xs text-zinc-500">Max</p>
                          <p className="font-bold text-sm text-zinc-700 dark:text-zinc-300">${coupon.maxDiscount.toLocaleString('es-CO')}</p>
                        </div>
                      )}
                    </div>

                    {coupon.description && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">{coupon.description}</p>
                    )}

                    <div className="space-y-2 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-zinc-500">
                          <Calendar className="w-3.5 h-3.5" />
                          Válido hasta
                        </span>
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                          {new Date(coupon.validUntil).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      
                      {coupon.maxUses ? (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-500">Usos</span>
                            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                              {coupon.usedCount} / {coupon.maxUses}
                            </span>
                          </div>
                          <div className="h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                usagePercent >= 90 ? 'bg-red-500' : usagePercent >= 70 ? 'bg-amber-500' : 'bg-primary'
                              }`}
                              style={{ width: `${Math.min(usagePercent, 100)}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-500">Usos</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            Ilimitados
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => toggleCouponStatus(coupon.id)}
                      className={`absolute bottom-4 right-4 p-2 rounded-lg transition-colors ${
                        coupon.isActive && !isExpired(coupon)
                          ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200'
                          : 'bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-600'
                      }`}
                    >
                      {coupon.isActive && !isExpired(coupon) ? (
                        <ToggleRight className="w-5 h-5" />
                      ) : (
                        <ToggleLeft className="w-5 h-5" />
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-4 lg:p-6 border-b border-zinc-100 dark:border-zinc-800 flex-shrink-0">
                <h2 className="text-lg lg:text-xl font-black text-zinc-900 dark:text-white">
                  {editingCoupon ? 'Editar Cupón' : 'Nuevo Cupón'}
                </h2>
                <button onClick={closeModal} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                  <X className="w-5 h-5 text-zinc-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-4 lg:space-y-5 overflow-y-auto flex-1">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Tipo de descuento</label>
                    <select
                      value={formData.type}
                      onChange={(e) => {
                        const type = e.target.value as 'percentage' | 'fixed';
                        setFormData({ ...formData, type });
                        generateDiscountPreview(formData.value, type, formData.maxDiscount || undefined);
                      }}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 text-zinc-900 dark:text-zinc-100"
                    >
                      <option value="percentage">Porcentaje (%)</option>
                      <option value="fixed">Monto fijo ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Valor {formData.type === 'percentage' ? '(%)' : '($ COP)'}
                    </label>
                    <input
                      type="number"
                      value={formData.value}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setFormData({ ...formData, value });
                        generateDiscountPreview(value, formData.type, formData.maxDiscount || undefined);
                      }}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 text-zinc-900 dark:text-zinc-100"
                      min="1"
                      max={formData.type === 'percentage' ? 100 : undefined}
                      required
                    />
                  </div>
                </div>

                {formData.type === 'percentage' && (
                  <div className="p-4 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Vista previa</span>
                      {previewDiscount !== null && (
                        <span className="text-xs font-bold text-primary">
                          -${previewDiscount.toLocaleString('es-CO')} COP
                        </span>
                      )}
                    </div>
                    <div className="h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${Math.min((formData.value / 100) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-zinc-500 mt-2">Ejemplo: $100,000 COP</p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Código del cupón *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 text-zinc-900 dark:text-zinc-100 font-mono font-bold tracking-wider"
                    placeholder="EJEMPLO20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Descripción (opcional)</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 text-zinc-900 dark:text-zinc-100"
                    placeholder="Ej: 20% de descuento en toda la tienda"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Compra mínima ($ COP)</label>
                    <input
                      type="number"
                      value={formData.minPurchase}
                      onChange={(e) => setFormData({ ...formData, minPurchase: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 text-zinc-900 dark:text-zinc-100"
                      min="0"
                      placeholder="0 = sin mínimo"
                    />
                  </div>
                  {formData.type === 'percentage' && (
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Descuento máximo ($ COP)</label>
                      <input
                        type="number"
                        value={formData.maxDiscount}
                        onChange={(e) => {
                          const maxDisc = Number(e.target.value);
                          setFormData({ ...formData, maxDiscount: maxDisc });
                          generateDiscountPreview(formData.value, formData.type, maxDisc || undefined);
                        }}
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 text-zinc-900 dark:text-zinc-100"
                        min="0"
                        placeholder="Solo para %"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Límite de usos</label>
                  <input
                    type="number"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({ ...formData, maxUses: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 text-zinc-900 dark:text-zinc-100"
                    min="0"
                    placeholder="0 = ilimitado"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Fecha inicio</label>
                    <input
                      type="date"
                      value={formData.validFrom}
                      onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 text-zinc-900 dark:text-zinc-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Fecha fin</label>
                    <input
                      type="date"
                      value={formData.validUntil}
                      onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 text-zinc-900 dark:text-zinc-100"
                      required
                    />
                  </div>
                </div>

                {new Date(formData.validFrom) > new Date(formData.validUntil) && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-xs text-red-600 dark:text-red-400">La fecha de inicio debe ser anterior a la fecha fin</p>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 font-bold text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {editingCoupon ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCouponsScreen;
