import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Store, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  Save,
  RotateCcw,
  Shield,
  Truck,
  Clock,
  AlertTriangle,
  Check,
  Eye,
  EyeOff,
  Bell,
  MessageCircle,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Music,
  ImagePlus,
  X,
  Plus,
  Pencil,
  Trash2,
  Banknote,
  Smartphone,
  Layout,
  ShoppingCart,
  ShoppingBag,
  Search,
  Scan,
  Moon,
  Sun
} from 'lucide-react';
import { AdminNavigation } from '../../components/AdminNavigation';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { compressImage } from '../../utils/imageUtils';
import { getUserDataParsed, setUserData, getCurrentUsername } from '../../lib/userData';

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  ShoppingCart,
  ShoppingBag,
  Search,
  Scan,
  Moon,
  Sun,
};

const HEADER_ICON_OPTIONS = [
  { key: 'cartIcon', label: 'Carrito', options: ['ShoppingCart', 'ShoppingBag'] },
  { key: 'searchIcon', label: 'Búsqueda', options: ['Search', 'Scan'] },
  { key: 'themeIcon', label: 'Modo Oscuro', options: ['Moon', 'Sun'] },
];

interface ShippingSettings {
  freeShippingThreshold: number;
  fixedShippingCost: number;
  estimatedDays: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  desc: string;
  active: boolean;
  type?: 'cod' | 'transfer';
}

interface NotificationSettings {
  emailOrders: boolean;
  emailStock: boolean;
  emailReviews: boolean;
  pushNewOrder: boolean;
  pushStock: boolean;
  pushReview: boolean;
}

export const AdminSettingsScreen = () => {
  const { settings, updateSettings, getLogo } = useStore();
  const { showToast } = useToast();
  
  const [activeSection, setActiveSection] = useState('store');
  const [formData, setFormData] = useState({
    name: settings.name,
    email: settings.email,
    phone: settings.phone,
    address: settings.address,
    currency: settings.currency,
    currencySymbol: settings.currencySymbol,
    socialMedia: settings.socialMedia || {
      instagram: '',
      facebook: '',
      whatsapp: '',
      youtube: '',
      twitter: '',
      tiktok: '',
    },
  });
  
  const [logoPreview, setLogoPreview] = useState<string | null>(getLogo());
  
  const [headerIcons, setHeaderIcons] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('headerIcons');
    return saved ? JSON.parse(saved) : {
      cartIcon: 'ShoppingCart',
      searchIcon: 'Search',
      themeIcon: 'Moon',
    };
  });

  const [headerConfig, setHeaderConfig] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('headerConfig');
    return saved ? JSON.parse(saved) : {
      showSearch: true,
      showTheme: true,
      showCart: true,
      showHome: true,
      showCategories: true,
      showOffers: true,
    };
  });

  const [customIcons, setCustomIcons] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('customIcons');
    return saved ? JSON.parse(saved) : {};
  });

  const handleCustomIconUpload = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const newCustomIcons = { ...customIcons, [key]: result };
        setCustomIcons(newCustomIcons);
        localStorage.setItem('customIcons', JSON.stringify(newCustomIcons));
        
        const newIcons = { ...headerIcons, [key]: `custom_${key}` };
        setHeaderIcons(newIcons);
        localStorage.setItem('headerIcons', JSON.stringify(newIcons));
        window.dispatchEvent(new CustomEvent('headerIconsUpdated'));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCustomIcon = (key: string) => {
    const newCustomIcons = { ...customIcons };
    delete newCustomIcons[key];
    setCustomIcons(newCustomIcons);
    localStorage.setItem('customIcons', JSON.stringify(newCustomIcons));
    
    const defaultIcons: Record<string, string> = {
      cartIcon: 'ShoppingCart',
      searchIcon: 'Search',
      themeIcon: 'Moon',
    };
    const newIcons = { ...headerIcons, [key]: defaultIcons[key] };
    setHeaderIcons(newIcons);
    localStorage.setItem('headerIcons', JSON.stringify(newIcons));
    window.dispatchEvent(new CustomEvent('headerIconsUpdated'));
  };
  
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>(() => {
    const saved = localStorage.getItem('shippingSettings');
    return saved ? JSON.parse(saved) : {
      freeShippingThreshold: 150000,
      fixedShippingCost: 12000,
      estimatedDays: '3-5 días',
    };
  });
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => {
    const saved = localStorage.getItem('paymentMethods');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.some((m: PaymentMethod) => m.id === 'pse' || m.id === 'card')) {
        localStorage.removeItem('paymentMethods');
        return [
          { id: 'cod', name: 'Contra Entrega', desc: 'Paga en efectivo al recibir tu pedido', active: true },
          { id: 'nequi', name: 'Nequi', desc: 'Paga desde la app Nequi', active: true },
          { id: 'daviplata', name: 'Daviplata', desc: 'Paga desde DaviPlata', active: true },
          { id: 'bancolombia', name: 'Bancolombia', desc: 'Transferencia a Bancolombia', active: true },
          { id: 'breb', name: 'Bre-B', desc: 'Pago instantáneo con Bre-B', active: true },
        ];
      }
      return parsed;
    }
    return [
      { id: 'cod', name: 'Contra Entrega', desc: 'Paga en efectivo al recibir tu pedido', active: true },
      { id: 'nequi', name: 'Nequi', desc: 'Paga desde la app Nequi', active: true },
      { id: 'daviplata', name: 'Daviplata', desc: 'Paga desde DaviPlata', active: true },
      { id: 'bancolombia', name: 'Bancolombia', desc: 'Transferencia a Bancolombia', active: true },
      { id: 'breb', name: 'Bre-B', desc: 'Pago instantáneo con Bre-B', active: true },
    ];
  });
  
  const [notifications, setNotifications] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('notificationSettings');
    return saved ? JSON.parse(saved) : {
      emailOrders: true,
      emailStock: true,
      emailReviews: false,
      pushNewOrder: true,
      pushStock: true,
      pushReview: false,
    };
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [newMethod, setNewMethod] = useState({
    name: '',
    desc: '',
    type: 'cod' as 'cod' | 'transfer',
    active: true
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value,
      },
    }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showToast('Comprimiendo imagen...', 'info');
      const base64 = await compressImage(file);
      setLogoPreview(base64);
      setFormData(prev => ({ ...prev, logo: base64 }));
      showToast('Logo actualizado', 'success');
    } catch {
      showToast('Error al subir logo', 'error');
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setFormData(prev => ({ ...prev, logo: '' }));
  };

  const togglePaymentMethod = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(m => m.id === id ? { ...m, active: !m.active } : m)
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      updateSettings({
        ...settings,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        currency: formData.currency,
        currencySymbol: formData.currencySymbol,
        socialMedia: formData.socialMedia,
        logo: formData.logo || logoPreview || '',
      });
      localStorage.setItem('shippingSettings', JSON.stringify(shippingSettings));
      const methodsWithType = paymentMethods.map(m => ({
        id: m.id,
        name: m.name,
        desc: m.desc,
        active: m.active,
        type: m.type || 'transfer'
      }));
      localStorage.setItem('paymentMethods', JSON.stringify(methodsWithType));
      localStorage.setItem('notificationSettings', JSON.stringify(notifications));
      showToast('Configuración guardada correctamente', 'success');
    } catch {
      showToast('Error al guardar', 'error');
    }
    setIsSaving(false);
  };

  const handleReset = () => {
    if (confirm('¿Restaurar configuración predeterminada?')) {
      setFormData({
        name: 'JEANCOL Professional',
        email: 'contacto@jeancol.com',
        phone: '+57 300 123 4567',
        address: 'Colombia',
        currency: 'COP',
        currencySymbol: '$',
        socialMedia: {
          instagram: '',
          facebook: '',
          whatsapp: '',
          youtube: '',
          twitter: '',
          tiktok: '',
        },
      });
      setShippingSettings({
        freeShippingThreshold: 150000,
        fixedShippingCost: 12000,
        estimatedDays: '3-5 días',
      });
      setPaymentMethods([
        { id: 'cod', name: 'Contra Entrega', desc: 'Paga en efectivo al recibir tu pedido', active: true },
        { id: 'nequi', name: 'Nequi', desc: 'Paga desde la app Nequi', active: true },
        { id: 'daviplata', name: 'Daviplata', desc: 'Paga desde DaviPlata', active: true },
        { id: 'bancolombia', name: 'Bancolombia', desc: 'Transferencia a Bancolombia', active: true },
        { id: 'breb', name: 'Bre-B', desc: 'Pago instantáneo con Bre-B', active: true },
      ]);
      localStorage.removeItem('paymentMethods');
      setNotifications({
        emailOrders: true,
        emailStock: true,
        emailReviews: false,
        pushNewOrder: true,
        pushStock: true,
        pushReview: false,
      });
      setLogoPreview(null);
      showToast('Configuración restaurada', 'success');
    }
  };

  const handlePasswordChange = () => {
    if (!passwordData.current) {
      showToast('Ingresa tu contraseña actual', 'error');
      return;
    }
    if (passwordData.new.length < 6) {
      showToast('La nueva contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }
    if (passwordData.new !== passwordData.confirm) {
      showToast('Las contraseñas no coinciden', 'error');
      return;
    }
    showToast('Contraseña actualizada correctamente', 'success');
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  const sections = [
    { id: 'store', label: 'Tienda', icon: Store },
    { id: 'header', label: 'Encabezado', icon: Layout },
    { id: 'social', label: 'Redes', icon: Instagram },
    { id: 'shipping', label: 'Envíos', icon: Truck },
    { id: 'payments', label: 'Pagos', icon: CreditCard },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'security', label: 'Seguridad', icon: Shield },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-zinc-50/50 dark:bg-zinc-950">
      <AdminNavigation />
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 h-14 lg:h-20 flex items-center px-4 lg:px-8">
          <h2 className="text-primary text-lg lg:text-2xl font-black tracking-tighter uppercase">AJUSTES</h2>
        </header>
        
        <div className="flex flex-col lg:flex-row flex-1">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 p-4 lg:p-6 lg:border-r lg:border-zinc-200 dark:lg:border-zinc-800">
            <nav className="space-y-1">
              {sections.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeSection === id
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 p-4 lg:p-8 pb-28 lg:pb-12">
            <div className="max-w-3xl space-y-6">
              
              {/* Store Settings */}
              {activeSection === 'store' && (
                <>
                  <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                      <ImagePlus className="w-5 h-5 text-primary" />
                      Logo de la Tienda
                    </h3>
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner">
                        {logoPreview ? (
                          <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                        ) : (
                          <span className="text-4xl font-black text-zinc-300 dark:text-zinc-600">J</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold cursor-pointer hover:bg-primary/90 transition-colors text-center">
                          Subir Logo
                          <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                        </label>
                        {logoPreview && (
                          <button onClick={handleRemoveLogo} className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                            Eliminar
                          </button>
                        )}
                        <p className="text-xs text-zinc-500">PNG o JPG, máx 2MB</p>
                      </div>
                    </div>
                  </section>

                  <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                      <Store className="w-5 h-5 text-primary" />
                      Información de la Tienda
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Nombre de la Tienda *</label>
                          <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none dark:text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Moneda</label>
                          <div className="flex gap-2">
                            <select 
                              value={formData.currency}
                              onChange={(e) => handleChange('currency', e.target.value)}
                              className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-bold outline-none appearance-none dark:text-white"
                            >
                              <option value="COP">COP</option>
                              <option value="USD">USD</option>
                              <option value="EUR">EUR</option>
                            </select>
                            <input 
                              type="text" 
                              value={formData.currencySymbol}
                              onChange={(e) => handleChange('currencySymbol', e.target.value)}
                              maxLength={3}
                              className="w-20 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-bold text-center dark:text-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Email</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input 
                              type="email" 
                              value={formData.email}
                              onChange={(e) => handleChange('email', e.target.value)}
                              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-12 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none dark:text-white"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Teléfono</label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input 
                              type="tel" 
                              value={formData.phone}
                              onChange={(e) => handleChange('phone', e.target.value)}
                              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-12 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none dark:text-white"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">WhatsApp</label>
                          <div className="relative">
                            <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input 
                              type="tel" 
                              value={formData.socialMedia?.whatsapp || ''}
                              onChange={(e) => handleSocialChange('whatsapp', e.target.value)}
                              placeholder="+57 300 123 4567"
                              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-12 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none dark:text-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Dirección</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                          <input 
                            type="text" 
                            value={formData.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-12 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Horario de Atención</label>
                        <div className="relative">
                          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                          <input 
                            type="text" 
                            placeholder="Lun-Vie: 9:00 AM - 6:00 PM"
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-12 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none dark:text-white placeholder:text-zinc-400"
                          />
                        </div>
                      </div>
                    </div>
                  </section>
                </>
              )}

              {/* Header Icons Settings */}
              {activeSection === 'header' && (
                <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                    <Layout className="w-5 h-5 text-primary" />
                    Encabezado
                  </h3>
                  
                  <div className="space-y-6">
                    <p className="text-xs text-zinc-500 mb-4">Configura qué elementos aparecen en el encabezado de tu tienda.</p>

                    {/* Navegación */}
                    <div>
                      <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-3">Navegación</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { key: 'showHome', label: 'Inicio', desc: 'Página principal' },
                          { key: 'showCategories', label: 'Categorías', desc: 'Ver todas las categorías' },
                          { key: 'showOffers', label: 'Ofertas', desc: 'Ver productos en oferta' },
                        ].map(({ key, label, desc }) => (
                          <div key={key} className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold text-zinc-900 dark:text-white">{label}</span>
                              <button
                                onClick={() => {
                                  const newConfig = { ...headerConfig, [key]: !headerConfig[key as keyof typeof headerConfig] };
                                  setHeaderConfig(newConfig);
                                  localStorage.setItem('headerConfig', JSON.stringify(newConfig));
                                  window.dispatchEvent(new CustomEvent('headerConfigUpdated'));
                                }}
                                className={`w-11 h-6 rounded-full transition-all relative ${
                                  headerConfig[key as keyof typeof headerConfig] ? 'bg-green-500' : 'bg-zinc-300 dark:bg-zinc-600'
                                }`}
                              >
                                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                                  headerConfig[key as keyof typeof headerConfig] ? 'left-6' : 'left-1'
                                }`} />
                              </button>
                            </div>
                            <p className="text-[10px] text-zinc-400">{desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Iconos y elementos */}
                    <div>
                      <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-3">Iconos</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { key: 'showSearch', label: 'Buscar', icon: Search, desc: 'Botón de búsqueda' },
                          { key: 'showTheme', label: 'Modo Oscuro', icon: Moon, desc: 'Cambiar tema claro/oscuro' },
                          { key: 'showCart', label: 'Carrito', icon: ShoppingCart, desc: 'Ir al carrito de compras' },
                        ].map(({ key, label, icon: Icon, desc }) => (
                        <div key={key} className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-zinc-500" />
                              <span className="text-xs font-bold text-zinc-900 dark:text-white">{label}</span>
                            </div>
                            <button
                              onClick={() => {
                                const newConfig = { ...headerConfig, [key]: !headerConfig[key as keyof typeof headerConfig] };
                                setHeaderConfig(newConfig);
                                localStorage.setItem('headerConfig', JSON.stringify(newConfig));
                                window.dispatchEvent(new CustomEvent('headerConfigUpdated'));
                              }}
                              className={`w-11 h-6 rounded-full transition-all relative ${
                                headerConfig[key as keyof typeof headerConfig] ? 'bg-green-500' : 'bg-zinc-300 dark:bg-zinc-600'
                              }`}
                            >
                              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                                headerConfig[key as keyof typeof headerConfig] ? 'left-6' : 'left-1'
                              }`} />
                            </button>
                          </div>
                          <p className="text-[10px] text-zinc-400">{desc}</p>
                        </div>
                        ))}
                      </div>
                    </div>

                    <hr className="border-zinc-200 dark:border-zinc-700" />

                    <p className="text-xs text-zinc-500 mb-4">Selecciona o sube tus propios iconos para el encabezado.</p>
                    
                    {[
                      { key: 'cartIcon', label: 'Icono Carrito', defaultIcon: 'ShoppingCart', options: ['ShoppingCart', 'ShoppingBag'] },
                      { key: 'searchIcon', label: 'Icono Búsqueda', defaultIcon: 'Search', options: ['Search', 'Scan'] },
                      { key: 'themeIcon', label: 'Icono Modo Oscuro', defaultIcon: 'Moon', options: ['Moon', 'Sun'] },
                    ].map(({ key, label, options }) => {
                      const customIcon = customIcons[key as keyof typeof customIcons];
                      const currentValue = headerIcons[key] || options[0];
                      const isCustom = currentValue.startsWith('custom_');
                      
                      return (
                        <div key={key} className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                          <label className="text-xs font-bold text-zinc-900 dark:text-white mb-3 block">{label}</label>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {options.map(opt => {
                              const IconComponent = ICON_MAP[opt] || Search;
                              return (
                                <button
                                  key={opt}
                                  onClick={() => {
                                    const newIcons = { ...headerIcons, [key]: opt };
                                    setHeaderIcons(newIcons);
                                    localStorage.setItem('headerIcons', JSON.stringify(newIcons));
                                    window.dispatchEvent(new CustomEvent('headerIconsUpdated'));
                                  }}
                                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                                    currentValue === opt && !isCustom
                                      ? 'bg-primary text-white scale-110'
                                      : 'bg-white dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600'
                                  }`}
                                  title={opt}
                                >
                                  <IconComponent className="w-5 h-5" />
                                </button>
                              );
                            })}
                          </div>
                          
                          {/* Custom Icon Upload */}
                          <div className="flex items-center gap-2">
                            <label className="flex-1 cursor-pointer">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleCustomIconUpload(e, key)}
                                className="hidden"
                              />
                              <span className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-600 transition-all">
                                <ImagePlus className="w-4 h-4" />
                                Subir icono personalizado
                              </span>
                            </label>
                            {isCustom && customIcon && (
                              <div className="flex items-center gap-2">
                                <img src={customIcon} alt="Custom" className="w-8 h-8 object-contain bg-white rounded-lg border" />
                                <button
                                  onClick={() => removeCustomIcon(key)}
                                  className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                            {isCustom && (
                              <button
                                onClick={() => {
                                  const newIcons = { ...headerIcons, [key]: options[0] };
                                  setHeaderIcons(newIcons);
                                  localStorage.setItem('headerIcons', JSON.stringify(newIcons));
                                  window.dispatchEvent(new CustomEvent('headerIconsUpdated'));
                                }}
                                className="px-2 py-1 text-xs bg-zinc-200 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-500"
                              >
                                Usar predeterminado
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Social Media Settings */}
              {activeSection === 'social' && (
                <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                    <Instagram className="w-5 h-5 text-primary" />
                    Redes Sociales
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'instagram', label: 'Instagram', icon: Instagram, placeholder: '@usuario' },
                      { key: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'facebook.com/pagina' },
                      { key: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'youtube.com/canal' },
                      { key: 'twitter', label: 'Twitter / X', icon: Twitter, placeholder: '@usuario' },
                      { key: 'tiktok', label: 'TikTok', icon: Music, placeholder: '@usuario' },
                    ].map(({ key, label, icon: Icon, placeholder }) => (
                      <div key={key} className="space-y-1">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {label}
                        </label>
                        <input 
                          type="text" 
                          value={formData.socialMedia?.[key as keyof typeof formData.socialMedia] || ''}
                          onChange={(e) => handleSocialChange(key, e.target.value)}
                          placeholder={placeholder}
                          className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none dark:text-white"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Shipping Settings */}
              {activeSection === 'shipping' && (
                <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                    <Truck className="w-5 h-5 text-primary" />
                    Configuración de Envíos
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                      <div>
                        <p className="text-sm font-bold text-zinc-900 dark:text-white">Envío Gratis</p>
                        <p className="text-xs text-zinc-500">Activar para pedidos mayores a:</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-zinc-500">$</span>
                        <input 
                          type="number" 
                          value={shippingSettings.freeShippingThreshold}
                          onChange={(e) => setShippingSettings(prev => ({ ...prev, freeShippingThreshold: Number(e.target.value) }))}
                          className="w-36 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-xl px-4 py-2 text-sm font-bold text-center dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                      <div>
                        <p className="text-sm font-bold text-zinc-900 dark:text-white">Costo de Envío Fijo</p>
                        <p className="text-xs text-zinc-500">Para pedidos menores al mínimo:</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-zinc-500">$</span>
                        <input 
                          type="number" 
                          value={shippingSettings.fixedShippingCost}
                          onChange={(e) => setShippingSettings(prev => ({ ...prev, fixedShippingCost: Number(e.target.value) }))}
                          className="w-36 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-xl px-4 py-2 text-sm font-bold text-center dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                      <div>
                        <p className="text-sm font-bold text-zinc-900 dark:text-white">Tiempo Estimado</p>
                        <p className="text-xs text-zinc-500">Días hábiles de entrega:</p>
                      </div>
                      <select 
                        value={shippingSettings.estimatedDays}
                        onChange={(e) => setShippingSettings(prev => ({ ...prev, estimatedDays: e.target.value }))}
                        className="bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-xl px-4 py-2 text-sm font-bold dark:text-white"
                      >
                        <option value="1-3 días">1-3 días</option>
                        <option value="2-4 días">2-4 días</option>
                        <option value="3-5 días">3-5 días</option>
                        <option value="5-7 días">5-7 días</option>
                      </select>
                    </div>
                  </div>
                </section>
              )}

              {/* Payments Settings */}
              {activeSection === 'payments' && (
                <section className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-2xl font-black text-zinc-900 dark:text-white">{paymentMethods.filter(m => m.active).length}</p>
                          <p className="text-xs text-zinc-500">Activos</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                          <X className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div>
                          <p className="text-2xl font-black text-zinc-900 dark:text-white">{paymentMethods.filter(m => !m.active).length}</p>
                          <p className="text-xs text-zinc-500">Inactivos</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-2xl font-black text-zinc-900 dark:text-white">{paymentMethods.length}</p>
                          <p className="text-xs text-zinc-500">Total</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Methods List */}
                  <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-primary" />
                        Métodos de Pago
                      </h3>
                      <button
                        onClick={() => {
                          setEditingMethod(null);
                          setNewMethod({ name: '', desc: '', type: 'cod', active: true });
                          setShowMethodModal(true);
                        }}
                        className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Nuevo Método
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {paymentMethods.map((method, index) => (
                        <div 
                          key={method.id} 
                          className={`group relative p-4 rounded-2xl border-2 transition-all ${
                            method.active 
                              ? 'bg-gradient-to-r from-green-50/50 to-transparent dark:from-green-900/10 border-green-200 dark:border-green-800/50' 
                              : 'bg-zinc-50 dark:bg-zinc-800/30 border-zinc-200 dark:border-zinc-700/50 opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="w-6 h-6 rounded bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-zinc-500">{index + 1}</span>
                              </div>
                            </div>
                            
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                              method.type === 'cod' 
                                ? 'bg-amber-100 dark:bg-amber-900/30' 
                                : 'bg-green-100 dark:bg-green-900/30'
                            }`}>
                              {method.type === 'cod' ? (
                                <Banknote className={`w-6 h-6 ${method.active ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-400'}`} />
                              ) : (
                                <Smartphone className={`w-6 h-6 ${method.active ? 'text-green-600 dark:text-green-400' : 'text-zinc-400'}`} />
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-base font-bold text-zinc-900 dark:text-white">{method.name}</p>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  method.type === 'cod'
                                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                }`}>
                                  {method.type === 'cod' ? 'CONTRA ENTREGA' : 'TRANSFERENCIA'}
                                </span>
                                {method.active && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                    ACTIVO
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-zinc-500 mt-0.5">{method.desc}</p>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => {
                                  setEditingMethod(method);
                                  setNewMethod({ 
                                    name: method.name, 
                                    desc: method.desc, 
                                    type: method.type || 'transfer',
                                    active: method.active 
                                  });
                                  setShowMethodModal(true);
                                }}
                                className="p-3 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-xl text-zinc-400 hover:text-primary transition-all"
                                title="Editar"
                              >
                                <Pencil className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`¿Eliminar "${method.name}"?`)) {
                                    setPaymentMethods(prev => prev.filter(m => m.id !== method.id));
                                    showToast('Método eliminado', 'success');
                                  }
                                }}
                                className="p-3 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl text-zinc-400 hover:text-red-500 transition-all"
                                title="Eliminar"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => togglePaymentMethod(method.id)}
                                className={`w-14 h-8 rounded-full relative transition-all ${
                                  method.active 
                                    ? 'bg-primary shadow-lg shadow-primary/30' 
                                    : 'bg-zinc-300 dark:bg-zinc-600'
                                }`}
                              >
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${
                                  method.active ? 'left-7' : 'left-1'
                                }`} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {paymentMethods.length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                          <CreditCard className="w-10 h-10 text-zinc-300 dark:text-zinc-600" />
                        </div>
                        <p className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Sin métodos de pago</p>
                        <p className="text-sm text-zinc-500 mb-4">Agrega métodos para que tus clientes puedan pagar</p>
                        <button
                          onClick={() => {
                            setEditingMethod(null);
                            setNewMethod({ name: '', desc: '', type: 'cod', active: true });
                            setShowMethodModal(true);
                          }}
                          className="px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                        >
                          Agregar método
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Info Box */}
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <CreditCard className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900 dark:text-white mb-1">Tipos de pago</p>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                          <strong>Contra Entrega:</strong> El cliente paga en efectivo al recibir el pedido.<br/>
                          <strong>Transferencia:</strong> Al confirmar, el cliente es redirigido a WhatsApp para coordinar el pago.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Payment Method Modal */}
              {showMethodModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
                  >
                    <div className="relative p-6 border-b border-zinc-100 dark:border-zinc-800 bg-gradient-to-r from-primary/5 to-transparent">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-zinc-900 dark:text-white">
                            {editingMethod ? 'Editar Método' : 'Nuevo Método'}
                          </h3>
                          <p className="text-sm text-zinc-500">
                            {editingMethod ? 'Modifica los datos del método' : 'Agrega un nuevo método de pago'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setShowMethodModal(false);
                          setEditingMethod(null);
                        }}
                        className="absolute top-6 right-6 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                      >
                        <X className="w-5 h-5 text-zinc-500" />
                      </button>
                    </div>
                    
                    <div className="p-6 space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Nombre del método</label>
                        <input
                          type="text"
                          value={newMethod.name}
                          onChange={(e) => setNewMethod(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Ej: Nequi, Daviplata, Bancolombia..."
                          className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-4 text-base font-bold focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none dark:text-white placeholder:text-zinc-400"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Descripción</label>
                        <input
                          type="text"
                          value={newMethod.desc}
                          onChange={(e) => setNewMethod(prev => ({ ...prev, desc: e.target.value }))}
                          placeholder="Ej: Paga desde la app Nequi de forma segura"
                          className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-4 text-base focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none dark:text-white placeholder:text-zinc-400"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Tipo de pago</label>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => setNewMethod(prev => ({ ...prev, type: 'cod' }))}
                            className={`relative p-5 rounded-2xl border-2 transition-all ${
                              newMethod.type === 'cod'
                                ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                                : 'border-zinc-200 dark:border-zinc-700 hover:border-primary/50 bg-zinc-50 dark:bg-zinc-800/50'
                            }`}
                          >
                            <Banknote className={`w-8 h-8 mx-auto mb-3 ${newMethod.type === 'cod' ? 'text-primary' : 'text-zinc-400'}`} />
                            <p className={`text-sm font-bold ${newMethod.type === 'cod' ? 'text-primary' : 'text-zinc-600 dark:text-zinc-400'}`}>Contra Entrega</p>
                            <p className="text-xs text-zinc-500 mt-1">Pago al recibir</p>
                            {newMethod.type === 'cod' && (
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setNewMethod(prev => ({ ...prev, type: 'transfer' }))}
                            className={`relative p-5 rounded-2xl border-2 transition-all ${
                              newMethod.type === 'transfer'
                                ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                                : 'border-zinc-200 dark:border-zinc-700 hover:border-primary/50 bg-zinc-50 dark:bg-zinc-800/50'
                            }`}
                          >
                            <Smartphone className={`w-8 h-8 mx-auto mb-3 ${newMethod.type === 'transfer' ? 'text-primary' : 'text-zinc-400'}`} />
                            <p className={`text-sm font-bold ${newMethod.type === 'transfer' ? 'text-primary' : 'text-zinc-600 dark:text-zinc-400'}`}>Transferencia</p>
                            <p className="text-xs text-zinc-500 mt-1">Redirige a WhatsApp</p>
                            {newMethod.type === 'transfer' && (
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </button>
                        </div>
                        <div className={`p-4 rounded-xl ${newMethod.type === 'cod' ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
                          <p className={`text-sm ${newMethod.type === 'cod' ? 'text-amber-700 dark:text-amber-300' : 'text-green-700 dark:text-green-300'}`}>
                            {newMethod.type === 'cod' 
                              ? '✓ El cliente paga en efectivo cuando reciba su pedido en la dirección indicada.'
                              : '✓ Al confirmar, el cliente será redirigido a WhatsApp con los datos del pedido para coordinar el pago.'
                            }
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${newMethod.active ? 'bg-green-100 dark:bg-green-900/30' : 'bg-zinc-200 dark:bg-zinc-700'}`}>
                            {newMethod.active ? (
                              <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                            ) : (
                              <X className="w-5 h-5 text-zinc-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-zinc-900 dark:text-white">Activo</p>
                            <p className="text-xs text-zinc-500">{newMethod.active ? 'Visible para clientes' : 'Oculto para clientes'}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setNewMethod(prev => ({ ...prev, active: !prev.active }))}
                          className={`w-14 h-8 rounded-full relative transition-all ${
                            newMethod.active 
                              ? 'bg-primary shadow-lg shadow-primary/30' 
                              : 'bg-zinc-300 dark:bg-zinc-600'
                          }`}
                        >
                          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${
                            newMethod.active ? 'left-7' : 'left-1'
                          }`} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
                      <button
                        onClick={() => {
                          setShowMethodModal(false);
                          setEditingMethod(null);
                        }}
                        className="flex-1 py-4 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 font-bold text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => {
                          if (!newMethod.name.trim()) {
                            showToast('Ingresa el nombre del método', 'error');
                            return;
                          }
                          if (editingMethod) {
                            setPaymentMethods(prev => prev.map(m => m.id === editingMethod.id ? { ...m, ...newMethod } : m));
                            showToast('Método actualizado', 'success');
                          } else {
                            const newId = newMethod.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
                            setPaymentMethods(prev => [...prev, { ...newMethod, id: newId }]);
                            showToast('Método agregado', 'success');
                          }
                          setShowMethodModal(false);
                          setEditingMethod(null);
                        }}
                        className="flex-1 py-4 rounded-2xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
                      >
                        {editingMethod ? 'Guardar Cambios' : 'Agregar Método'}
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeSection === 'notifications' && (
                <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                    <Bell className="w-5 h-5 text-primary" />
                    Notificaciones
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                      <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4">Email</h4>
                      <div className="space-y-3">
                        {[
                          { key: 'emailOrders', label: 'Nuevos pedidos', desc: 'Recibir email cuando llegue un pedido' },
                          { key: 'emailStock', label: 'Stock bajo', desc: 'Alertas cuando el inventario sea bajo' },
                          { key: 'emailReviews', label: 'Nuevas reseñas', desc: 'Notificar nuevas reseñas de productos' },
                        ].map(({ key, label, desc }) => (
                          <div key={key} className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-bold text-zinc-900 dark:text-white">{label}</p>
                              <p className="text-xs text-zinc-500">{desc}</p>
                            </div>
                            <button
                              onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof notifications] }))}
                              className={`w-14 h-7 rounded-full relative transition-colors ${
                                notifications[key as keyof typeof notifications] ? 'bg-primary' : 'bg-zinc-300 dark:bg-zinc-600'
                              }`}
                            >
                              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all ${
                                notifications[key as keyof typeof notifications] ? 'left-8' : 'left-1'
                              }`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                      <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4">Notificaciones Push</h4>
                      <div className="space-y-3">
                        {[
                          { key: 'pushNewOrder', label: 'Nuevos pedidos' },
                          { key: 'pushStock', label: 'Alertas de inventario' },
                          { key: 'pushReview', label: 'Reseñas de clientes' },
                        ].map(({ key, label }) => (
                          <div key={key} className="flex items-center justify-between">
                            <p className="text-sm font-bold text-zinc-900 dark:text-white">{label}</p>
                            <button
                              onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof notifications] }))}
                              className={`w-14 h-7 rounded-full relative transition-colors ${
                                notifications[key as keyof typeof notifications] ? 'bg-primary' : 'bg-zinc-300 dark:bg-zinc-600'
                              }`}
                            >
                              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all ${
                                notifications[key as keyof typeof notifications] ? 'left-8' : 'left-1'
                              }`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Security Settings */}
              {activeSection === 'security' && (
                <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    Seguridad
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-900 dark:text-white">Autenticación de Dos Pasos</p>
                          <p className="text-xs text-zinc-500">Añade seguridad extra a tu cuenta</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors">
                        Activar
                      </button>
                    </div>
                    
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl space-y-4">
                      <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest">Cambiar Contraseña</h4>
                      <div className="space-y-3">
                        <div className="relative">
                          <input 
                            type={showPassword ? 'text' : 'password'}
                            value={passwordData.current}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                            placeholder="Contraseña actual"
                            className="w-full bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none dark:text-white"
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <input 
                          type="password"
                          value={passwordData.new}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                          placeholder="Nueva contraseña"
                          className="w-full bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none dark:text-white"
                        />
                        <input 
                          type="password"
                          value={passwordData.confirm}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                          placeholder="Confirmar nueva contraseña"
                          className="w-full bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none dark:text-white"
                        />
                        <button
                          onClick={handlePasswordChange}
                          className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors"
                        >
                          Actualizar Contraseña
                        </button>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-amber-800 dark:text-amber-200">Sesiones Activas</p>
                          <p className="text-xs text-amber-600 dark:text-amber-300 mt-1">
                            Actualmente tienes 1 sesión activa. La última actividad fue hace 5 minutos desde Bogotá, Colombia.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Guardar Cambios
                    </>
                  )}
                </button>
                <button 
                  onClick={handleReset}
                  className="px-6 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restaurar
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
