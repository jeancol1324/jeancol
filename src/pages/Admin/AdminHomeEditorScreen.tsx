import React, { useState, useEffect, useMemo } from 'react';
import { 
  Layout, Type, ShieldCheck, Palette, Sparkles, 
  Check, RotateCcw, Upload, Monitor, Smartphone, Image, Trash2, Plus, GripVertical, Search, X, Link as LinkIcon, ArrowRight, Users, Star, Footprints
} from 'lucide-react';
import { AdminNavigation } from '../../components/AdminNavigation';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { useCategories } from '../../context/CategoryContext';
import { useProducts } from '../../context/ProductContext';
import { compressImage } from '../../utils/imageUtils';

const TABS = [
  { id: 'hero', label: 'Portada', icon: Layout },
  { id: 'marquee', label: 'Noticias', icon: Type },
  { id: 'trust', label: 'Confianza', icon: ShieldCheck },
  { id: 'banners', label: 'Banners', icon: Image },
  { id: 'collections', label: 'Colecciones', icon: Palette },
  { id: 'testimonials', label: 'Comunidad', icon: Users },
  { id: 'featured', label: 'Destacados', icon: Sparkles },
  { id: 'footer', label: 'Footer', icon: Footprints },
];

const ICON_OPTIONS = [
  { value: 'Truck', label: '🚚' },
  { value: 'ShieldCheck', label: '🛡️' },
  { value: 'Return', label: '🔄' },
  { value: 'Headphones', label: '🎧' },
  { value: 'Heart', label: '❤️' },
  { value: 'Star', label: '⭐' },
  { value: 'ShoppingBag', label: '🛍️' },
  { value: 'CreditCard', label: '💳' },
  { value: 'Package', label: '📦' },
  { value: 'Lock', label: '🔒' },
  { value: 'Clock', label: '⏰' },
  { value: 'Sparkles', label: '✨' },
  { value: 'Gift', label: '🎁' },
  { value: 'Tag', label: '🏷️' },
  { value: 'BadgePercent', label: '💰' },
  { value: 'Leaf', label: '🌿' },
  { value: 'Flame', label: '🔥' },
  { value: 'TrendingUp', label: '📈' },
  { value: 'Award', label: '🏆' },
  { value: 'Zap', label: '⚡' },
];

const PAGE_LINKS = [
  { value: '/categories', label: 'Todas las Categorías' },
  { value: '/offers', label: 'Ofertas' },
  { value: '/products', label: 'Todos los Productos' },
];

export const AdminHomeEditorScreen = () => {
  const { updateSettings } = useStore();
  const { showToast } = useToast();
  const { theme } = useTheme();
  const { categories } = useCategories();
  const { products } = useProducts();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState('hero');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [hasChanges, setHasChanges] = useState(false);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [activeBannerSearch, setActiveBannerSearch] = useState<number | null>(null);

  const filteredProducts = useMemo(() => {
    if (!productSearchQuery) return products.slice(0, 10);
    return products.filter(p => 
      p.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearchQuery.toLowerCase())
    ).slice(0, 10);
  }, [products, productSearchQuery]);

  const [heroSection, setHeroSection] = useState(() => {
    const saved = localStorage.getItem('heroSection');
    return saved ? JSON.parse(saved) : {
      title: 'Define tu Legado',
      subtitle: 'Explora nuestra curaduría de piezas icónicas y colecciones maestras que definen la nueva era de la moda.',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80',
      buttonText: 'Explorar Colección',
      badgeText: 'Nueva Colección 2024',
      liveText: '+1,200 personas comprando ahora',
    };
  });

  const [banners, setBanners] = useState(() => {
    const saved = localStorage.getItem('homeBanners');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        title: 'Summer Vibes',
        subtitle: 'Hasta 50% de descuento en piezas seleccionadas.',
        badge: 'Oferta Flash',
        badgeIcon: 'Flame',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
        link: '/offers',
        buttonText: 'Ver Ofertas',
        isLarge: true,
      },
      {
        id: '2',
        title: 'The Edit',
        subtitle: 'Nuevas piezas añadidas diariamente. No te lo pierdas.',
        badge: 'Novedades',
        badgeIcon: 'Star',
        image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80',
        link: '/categories',
        buttonText: 'Descubrir Más',
        isLarge: false,
      },
    ];
  });

  const [collections, setCollections] = useState(() => {
    const saved = localStorage.getItem('homeCollections');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        title: 'Urban Core',
        description: 'La esencia de la calle elevada al lujo absoluto.',
        image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80',
        link: '/categories',
        isFeatured: true,
      },
      {
        id: '2',
        title: 'Minimalist',
        description: 'Menos es más, siempre.',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
        link: '/categories',
        isFeatured: false,
      },
      {
        id: '3',
        title: 'Sartorial',
        description: 'Sastrería moderna para el día a día.',
        image: 'https://images.unsplash.com/photo-1594932224440-746932266e62?auto=format&fit=crop&w=800&q=80',
        link: '/categories',
        isFeatured: false,
      },
      {
        id: '4',
        title: 'Essentials',
        description: 'Las piezas básicas que nunca fallan.',
        image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80',
        link: '/categories',
        isFeatured: false,
      },
    ];
  });

  const [marqueeText, setMarqueeText] = useState(() => {
    const saved = localStorage.getItem('marqueeText');
    return saved || 'ENVÍO GRATIS EN PEDIDOS +$150 • FLASH SALE: 30% OFF EN SELECCIONADOS • ÚLTIMAS UNIDADES • NUEVA COLECCIÓN INVADER DISPONIBLE AHORA';
  });

  const [trustItems, setTrustItems] = useState(() => {
    const saved = localStorage.getItem('trustItems');
    return saved ? JSON.parse(saved) : [
      { icon: 'Truck', title: 'Envío Express', description: 'Gratis en pedidos +$150' },
      { icon: 'ShieldCheck', title: 'Pago Seguro', description: 'Encriptación SSL 256-bit' },
      { icon: 'Return', title: 'Devolución Fácil', description: '30 días de garantía' },
      { icon: 'Headphones', title: 'Soporte 24/7', description: 'Atención personalizada' },
    ];
  });

  const [collectionsTitle, setCollectionsTitle] = useState(() => {
    return localStorage.getItem('collectionsTitle') || 'Colecciones Maestras';
  });

  const [collectionsSubtitle, setCollectionsSubtitle] = useState(() => {
    return localStorage.getItem('collectionsSubtitle') || 'Explora los estilos que están definiendo la escena global este año.';
  });

  const [featuredTitle, setFeaturedTitle] = useState(() => {
    return localStorage.getItem('featuredTitle') || 'Lo Más Buscado';
  });

  const [featuredSubtitle, setFeaturedSubtitle] = useState(() => {
    return localStorage.getItem('featuredSubtitle') || 'Productos que definen tendencias.';
  });

  const [testimonialsTitle, setTestimonialsTitle] = useState(() => {
    return localStorage.getItem('testimonialsTitle') || 'Voces de Excelencia';
  });

  const [testimonialsSubtitle, setTestimonialsSubtitle] = useState(() => {
    return localStorage.getItem('testimonialsSubtitle') || 'Comunidad';
  });

  const [testimonials, setTestimonials] = useState(() => {
    const saved = localStorage.getItem('homeTestimonials');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        name: 'Elena Rodríguez',
        role: 'Fashion Blogger',
        content: 'La calidad de las prendas es simplemente excepcional. El corte sastre y la atención al detalle superan cualquier expectativa.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        rating: 5,
      },
      {
        id: '2',
        name: 'Marco Vales',
        role: 'Arquitecto',
        content: 'Buscaba algo minimalista pero con carácter. Esta tienda se ha convertido en mi referente para el día a día profesional.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        rating: 5,
      },
      {
        id: '3',
        name: 'Sofía Martínez',
        role: 'Diseñadora UX',
        content: 'La experiencia de compra es tan fluida como sus diseños. El envío fue rapidísimo y el empaque es puro lujo.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
        rating: 5,
      },
    ];
  });

  const [footerSettings, setFooterSettings] = useState(() => {
    const saved = localStorage.getItem('footerSettings');
    const defaults = {
      logoText: 'JEANCOL',
      tagline: 'Elegancia atemporal para el hombre moderno.',
      showSocial: true,
      showLinks: true,
      showCopyright: true,
      showContact: true,
      showNewsletter: false,
      copyrightText: 'TODOS LOS DERECHOS RESERVADOS.',
      backgroundStyle: 'dark',
      socialLinks: {
        instagram: '#',
        twitter: '#',
        facebook: '#',
        youtube: '#',
        whatsapp: '',
        tiktok: '',
      },
      contactInfo: {
        email: 'contacto@jeancob.store',
        phone: '+57 300 123 4567',
        address: 'Bogotá, Colombia',
      },
      quickLinks: [
        { name: 'Inicio', href: '/' },
        { name: 'Productos', href: '/products' },
        { name: 'Categorías', href: '/categories' },
        { name: 'Ofertas', href: '/offers' },
        { name: 'Contacto', href: '#' },
      ],
      columns: {
        brand: true,
        navigation: true,
        contact: true,
        newsletter: false,
      },
    };
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [heroPreview, setHeroPreview] = useState(heroSection.image);

  useEffect(() => {
    setHasChanges(true);
  }, [heroSection, marqueeText, trustItems, collectionsTitle, collectionsSubtitle, featuredTitle, featuredSubtitle, testimonialsTitle, testimonialsSubtitle, testimonials, banners, collections, footerSettings]);

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showToast('Comprimiendo imagen...', 'info');
      const base64 = await compressImage(file);
      setHeroPreview(base64);
      setHeroSection(prev => ({ ...prev, image: base64 }));
      showToast('Imagen actualizada', 'success');
    } catch {
      showToast('Error al subir imagen', 'error');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('heroSection', JSON.stringify(heroSection));
      localStorage.setItem('marqueeText', marqueeText);
      localStorage.setItem('trustItems', JSON.stringify(trustItems));
      localStorage.setItem('homeBanners', JSON.stringify(banners));
      localStorage.setItem('homeCollections', JSON.stringify(collections));
      localStorage.setItem('collectionsTitle', collectionsTitle);
      localStorage.setItem('collectionsSubtitle', collectionsSubtitle);
      localStorage.setItem('featuredTitle', featuredTitle);
      localStorage.setItem('featuredSubtitle', featuredSubtitle);
      localStorage.setItem('testimonialsTitle', testimonialsTitle);
      localStorage.setItem('testimonialsSubtitle', testimonialsSubtitle);
      localStorage.setItem('homeTestimonials', JSON.stringify(testimonials));
      localStorage.setItem('footerSettings', JSON.stringify(footerSettings));
      updateSettings({ heroSection });
      setHasChanges(false);
      showToast('Configuración guardada correctamente', 'success');
    } catch {
      showToast('Error al guardar', 'error');
    }
    setIsSaving(false);
  };

  const handleReset = () => {
    if (confirm('¿Restaurar configuración predeterminada?')) {
      setHeroSection({
        title: 'Define tu Legado',
        subtitle: 'Explora nuestra curadería de piezas icónicas y colecciones maestras que definen la nueva era de la moda.',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80',
        buttonText: 'Explorar Colección',
        badgeText: 'Nueva Colección 2024',
        liveText: '+1,200 personas comprando ahora',
      });
      setMarqueeText('ENVÍO GRATIS EN PEDIDOS +$150 • FLASH SALE: 30% OFF EN SELECCIONADOS • ÚLTIMAS UNIDADES • NUEVA COLECCIÓN INVADER DISPONIBLE AHORA');
      setTrustItems([
        { icon: 'Truck', title: 'Envío Express', description: 'Gratis en pedidos +$150' },
        { icon: 'ShieldCheck', title: 'Pago Seguro', description: 'Encriptación SSL 256-bit' },
        { icon: 'Return', title: 'Devolución Fácil', description: '30 días de garantía' },
        { icon: 'Headphones', title: 'Soporte 24/7', description: 'Atención personalizada' },
      ]);
      setBanners([
        {
          id: '1',
          title: 'Summer Vibes',
          subtitle: 'Hasta 50% de descuento en piezas seleccionadas.',
          badge: 'Oferta Flash',
          badgeIcon: 'Flame',
          image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
          link: '/offers',
          buttonText: 'Ver Ofertas',
          isLarge: true,
        },
        {
          id: '2',
          title: 'The Edit',
          subtitle: 'Nuevas piezas añadidas diariamente. No te lo pierdas.',
          badge: 'Novedades',
          badgeIcon: 'Star',
          image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80',
          link: '/categories',
          buttonText: 'Descubrir Más',
          isLarge: false,
        },
      ]);
      setCollections([
        {
          id: '1',
          title: 'Urban Core',
          description: 'La esencia de la calle elevada al lujo absoluto.',
          image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80',
          link: '/categories',
          isFeatured: true,
        },
        {
          id: '2',
          title: 'Minimalist',
          description: 'Menos es más, siempre.',
          image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
          link: '/categories',
          isFeatured: false,
        },
        {
          id: '3',
          title: 'Sartorial',
          description: 'Sastrería moderna para el día a día.',
          image: 'https://images.unsplash.com/photo-1594932224440-746932266e62?auto=format&fit=crop&w=800&q=80',
          link: '/categories',
          isFeatured: false,
        },
        {
          id: '4',
          title: 'Essentials',
          description: 'Las piezas básicas que nunca fallan.',
          image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80',
          link: '/categories',
          isFeatured: false,
        },
      ]);
      setCollectionsTitle('Colecciones Maestras');
      setCollectionsSubtitle('Explora los estilos que están definiendo la escena global este año.');
      setFeaturedTitle('Lo Más Buscado');
      setFeaturedSubtitle('Productos que definen tendencias.');
      setHeroPreview('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80');
      setHasChanges(false);
      showToast('Configuración restaurada', 'success');
    }
  };

  const Input = ({ label, value, onChange, placeholder, multiline = false, rows = 3 }: any) => (
    <div className="space-y-2">
      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
        {label}
        {hasChanges && (
          <span className="w-2 h-2 rounded-full bg-amber-400" title="Sin guardar" />
        )}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`w-full px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-all ${
            isDark 
              ? 'bg-zinc-800/60 border border-zinc-700 text-white placeholder-zinc-500' 
              : 'bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400'
          }`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/30 transition-all ${
            isDark 
              ? 'bg-zinc-800/60 border border-zinc-700 text-white placeholder-zinc-500' 
              : 'bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400'
          } border`}
        />
      )}
    </div>
  );

  const TrustItemCard = ({ item, index }: { item: any; index: number }) => (
    <div className={`p-5 rounded-2xl transition-all ${
      isDark ? 'bg-zinc-800/40 border border-zinc-700/50' : 'bg-zinc-50 border border-zinc-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${
            isDark ? 'bg-primary/20' : 'bg-primary/10'
          }`}>
            {ICON_OPTIONS.find(i => i.value === item.icon)?.label || '📦'}
          </div>
          <span className="text-xs font-bold text-primary">Item {index + 1}</span>
        </div>
        <div className="flex gap-1">
          {ICON_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => {
                const newItems = [...trustItems];
                newItems[index] = { ...item, icon: opt.value };
                setTrustItems(newItems);
              }}
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all ${
                item.icon === opt.value
                  ? 'bg-primary text-white scale-110'
                  : isDark ? 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600' : 'bg-white text-zinc-500 hover:bg-zinc-200'
              }`}
              title={opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <Input 
          label="Título" 
          value={item.title} 
          onChange={(v: string) => {
            const newItems = [...trustItems];
            newItems[index] = { ...item, title: v };
            setTrustItems(newItems);
          }} 
          placeholder="Ej: Envío Express" 
        />
        <Input 
          label="Descripción" 
          value={item.description} 
          onChange={(v: string) => {
            const newItems = [...trustItems];
            newItems[index] = { ...item, description: v };
            setTrustItems(newItems);
          }} 
          placeholder="Ej: Gratis en pedidos +$150" 
        />
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'hero':
        return (
          <div className="space-y-6">
            <div className={`p-4 rounded-xl ${isDark ? 'bg-primary/10 border border-primary/20' : 'bg-primary/5 border border-primary/10'}`}>
              <p className="text-xs text-zinc-500">Edita el banner principal que aparece en la parte superior de tu tienda.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Badge Superior" 
                value={heroSection.badgeText} 
                onChange={(v: string) => setHeroSection(p => ({ ...p, badgeText: v }))}
                placeholder="Ej: Nueva Colección 2024"
              />
              <Input 
                label="Texto en Vivo" 
                value={heroSection.liveText} 
                onChange={(v: string) => setHeroSection(p => ({ ...p, liveText: v }))}
                placeholder="Ej: +1,200 personas comprando ahora"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Título Principal" 
                value={heroSection.title} 
                onChange={(v: string) => setHeroSection(p => ({ ...p, title: v }))}
                placeholder="Ej: Define tu Legado"
              />
              <Input 
                label="Texto del Botón" 
                value={heroSection.buttonText} 
                onChange={(v: string) => setHeroSection(p => ({ ...p, buttonText: v }))}
                placeholder="Ej: Explorar Colección"
              />
            </div>
            
            <Input 
              label="Subtítulo" 
              value={heroSection.subtitle} 
              onChange={(v: string) => setHeroSection(p => ({ ...p, subtitle: v }))}
              placeholder="Descripción de tu tienda..."
              multiline
              rows={2}
            />
            
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Imagen de Portada</label>
              <div className={`p-4 rounded-2xl ${isDark ? 'bg-zinc-800/40 border border-zinc-700/50' : 'bg-zinc-50 border border-zinc-200'}`}>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="w-full sm:w-56 aspect-video bg-zinc-200 dark:bg-zinc-700 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={heroPreview} alt="Hero Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center space-y-3">
                    <label className="px-5 py-3 bg-primary text-white rounded-xl text-sm font-bold cursor-pointer text-center hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                      <Upload className="w-4 h-4" />
                      Subir Nueva Imagen
                      <input type="file" accept="image/*" onChange={handleHeroImageUpload} className="hidden" />
                    </label>
                    <p className="text-[10px] text-zinc-400 text-center">Recomendado: 1920x1080px (mínimo 1280x720px)</p>
                    <button 
                      onClick={() => {
                        setHeroPreview(heroSection.image);
                      }}
                      className="text-xs text-zinc-500 hover:text-primary transition-colors"
                    >
                      Usar imagen actual
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {previewMode === 'desktop' && (
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Vista Previa Real</label>
                <div className="rounded-2xl overflow-hidden border border-zinc-300 dark:border-zinc-700 shadow-2xl">
                  <div className="relative h-[70vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-zinc-950">
                    <div className="absolute inset-0 z-0">
                      <img src={heroPreview} alt="Hero" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/70 via-zinc-950/40 to-zinc-950/80" />
                    </div>
                    
                    <div className="relative z-10 text-center px-8 max-w-5xl mx-auto space-y-8">
                      <div className="flex justify-center">
                        <span className="bg-white/10 backdrop-blur-xl text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-[0.3em] border border-white/20 shadow-2xl">
                          {heroSection.badgeText}
                        </span>
                      </div>
                      
                      <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30">
                        <div className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-full w-full bg-primary"></span>
                        </div>
                        <span className="text-xs font-black text-white uppercase tracking-wider">{heroSection.liveText}</span>
                      </div>

                      <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white uppercase tracking-tighter italic leading-[0.9] drop-shadow-2xl">
                        {heroSection.title}
                      </h1>

                      <p className="text-white/80 text-lg max-w-xl mx-auto font-medium leading-relaxed">
                        {heroSection.subtitle}
                      </p>

                      <div className="flex items-center justify-center gap-4 pt-6">
                        <button className="bg-primary text-white px-16 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 flex items-center justify-center gap-4">
                          {heroSection.buttonText}
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </button>
                        <button className="bg-white/10 backdrop-blur-xl text-white border border-white/20 px-16 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-4">
                          Ver Ofertas
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'marquee':
        return (
          <div className="space-y-6">
            <div className={`p-4 rounded-xl ${isDark ? 'bg-primary/10 border border-primary/20' : 'bg-primary/5 border border-primary/10'}`}>
              <p className="text-xs text-zinc-500">El texto que aparece animado en la parte superior de la tienda. Usa • para separar secciones.</p>
            </div>
            <Input 
              label="Texto de la Barra" 
              value={marqueeText} 
              onChange={setMarqueeText}
              placeholder="ENVÍO GRATIS • OFERTA ESPECIAL • NUEVO..."
              multiline
              rows={4}
            />
            <div className={`p-4 rounded-xl ${isDark ? 'bg-zinc-800/40' : 'bg-zinc-50'}`}>
              <p className="text-xs text-zinc-500 mb-2">Vista previa:</p>
              <div className="overflow-hidden">
                <div className="animate-marquee whitespace-nowrap">
                  <span className="text-sm font-medium text-primary">{marqueeText}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'trust':
        return (
          <div className="space-y-6">
            <div className={`p-4 rounded-xl ${isDark ? 'bg-primary/10 border border-primary/20' : 'bg-primary/5 border border-primary/10'}`}>
              <p className="text-xs text-zinc-500">Los 4 íconos de confianza que aparecen debajo del banner principal.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trustItems.map((item, index) => (
                <TrustItemCard item={item} index={index} />
              ))}
            </div>
          </div>
        );

      case 'banners':
        return (
          <div className="space-y-6">
            <div className={`p-4 rounded-xl ${isDark ? 'bg-primary/10 border border-primary/20' : 'bg-primary/5 border border-primary/10'}`}>
              <p className="text-xs text-zinc-500">Edita los banners promocionales. Puedes enlazarlos a productos específicos, categorías o páginas.</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  Banners ({banners.length})
                </h4>
                <button
                  onClick={() => {
                    const newBanner = {
                      id: Date.now().toString(),
                      title: 'Nuevo Banner',
                      subtitle: 'Descripción del banner.',
                      badge: 'Nuevo',
                      badgeIcon: 'Star',
                      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
                      link: '/categories',
                      buttonText: 'Ver Más',
                      isLarge: false,
                    };
                    setBanners([...banners, newBanner]);
                  }}
                  className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Agregar
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {banners.map((banner, index) => {
                  const selectedCategory = categories.find(c => `/category/${c.id}` === banner.link);
                  const selectedProduct = banner.link.startsWith('/product/') 
                    ? products.find(p => p.id === banner.link.split('/').pop()) 
                    : null;
                  return (
                    <div key={banner.id} className={`rounded-2xl overflow-hidden ${isDark ? 'bg-zinc-800/40 border border-zinc-700/50' : 'bg-zinc-50 border border-zinc-200'}`}>
                      <div className="relative aspect-video bg-zinc-200 dark:bg-zinc-700">
                        <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-[10px] font-bold">
                            Banner {index + 1}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3 flex gap-2">
                          <button
                            onClick={() => {
                              const newBanners = [...banners];
                              const duplicated = { ...banner, id: Date.now().toString(), title: `${banner.title} (copia)` };
                              newBanners.splice(index + 1, 0, duplicated);
                              setBanners(newBanners);
                            }}
                            className="p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-black/80 transition-colors"
                            title="Duplicar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              const newBanners = banners.filter((_, i) => i !== index);
                              setBanners(newBanners);
                            }}
                            className="p-2 bg-red-500/80 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3">
                          <label className="flex items-center justify-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-xs font-bold text-zinc-900 cursor-pointer hover:bg-white transition-colors">
                            <Upload className="w-4 h-4" />
                            Cambiar Imagen
                            <input type="file" accept="image/*" onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                const base64 = await compressImage(file);
                                const newBanners = [...banners];
                                newBanners[index] = { ...banner, image: base64 };
                                setBanners(newBanners);
                                showToast('Imagen actualizada', 'success');
                              } catch {
                                showToast('Error al subir imagen', 'error');
                              }
                            }} className="hidden" />
                          </label>
                        </div>
                      </div>
                      
                      <div className="p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase">Título</label>
                            <input
                              type="text"
                              value={banner.title}
                              onChange={(e) => {
                                const newBanners = [...banners];
                                newBanners[index] = { ...banner, title: e.target.value };
                                setBanners(newBanners);
                              }}
                              placeholder="Ej: Summer Vibes"
                              className={`w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30 ${
                                isDark ? 'bg-zinc-700/50 text-white placeholder-zinc-500' : 'bg-white text-zinc-900 placeholder-zinc-400'
                              }`}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase">Badge</label>
                            <input
                              type="text"
                              value={banner.badge}
                              onChange={(e) => {
                                const newBanners = [...banners];
                                newBanners[index] = { ...banner, badge: e.target.value };
                                setBanners(newBanners);
                              }}
                              placeholder="Ej: Oferta Flash"
                              className={`w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30 ${
                                isDark ? 'bg-zinc-700/50 text-white placeholder-zinc-500' : 'bg-white text-zinc-900 placeholder-zinc-400'
                              }`}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase">Descripción</label>
                          <textarea
                            value={banner.subtitle}
                            onChange={(e) => {
                              const newBanners = [...banners];
                              newBanners[index] = { ...banner, subtitle: e.target.value };
                              setBanners(newBanners);
                            }}
                            placeholder="Ej: Hasta 50% de descuento..."
                            rows={2}
                            className={`w-full px-3 py-2 rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary/30 resize-none ${
                              isDark ? 'bg-zinc-700/50 text-white placeholder-zinc-500' : 'bg-white text-zinc-900 placeholder-zinc-400'
                            }`}
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase">Botón</label>
                          <input
                            type="text"
                            value={banner.buttonText}
                            onChange={(e) => {
                              const newBanners = [...banners];
                              newBanners[index] = { ...banner, buttonText: e.target.value };
                              setBanners(newBanners);
                            }}
                            placeholder="Ej: Ver Ofertas"
                            className={`w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30 ${
                              isDark ? 'bg-zinc-700/50 text-white placeholder-zinc-500' : 'bg-white text-zinc-900 placeholder-zinc-400'
                            }`}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1">
                            <LinkIcon className="w-3 h-3" />
                            Link de Destino
                          </label>
                          
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-2">
                              {PAGE_LINKS.map(opt => (
                                <button
                                  key={opt.value}
                                  onClick={() => {
                                    const newBanners = [...banners];
                                    newBanners[index] = { ...banner, link: opt.value };
                                    setBanners(newBanners);
                                  }}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    banner.link === opt.value
                                      ? 'bg-primary text-white'
                                      : isDark ? 'bg-zinc-700/50 text-zinc-300 hover:bg-zinc-600' : 'bg-white text-zinc-600 hover:bg-zinc-100'
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              {categories.map(cat => (
                                <button
                                  key={cat.id}
                                  onClick={() => {
                                    const newBanners = [...banners];
                                    newBanners[index] = { ...banner, link: `/category/${cat.id}` };
                                    setBanners(newBanners);
                                  }}
                                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    banner.link === `/category/${cat.id}`
                                      ? 'bg-primary text-white'
                                      : isDark ? 'bg-zinc-700/50 text-zinc-300 hover:bg-zinc-600' : 'bg-white text-zinc-600 hover:bg-zinc-100'
                                  }`}
                                >
                                  <img src={cat.image} alt={cat.name} className="w-5 h-5 rounded object-cover" />
                                  {cat.name}
                                </button>
                              ))}
                            </div>
                            
                            {banner.link.startsWith('/product/') ? (
                              <div className={`p-3 rounded-xl flex items-center justify-between ${isDark ? 'bg-primary/20' : 'bg-primary/5'}`}>
                                <div className="flex items-center gap-2">
                                  {selectedProduct && (
                                    <>
                                      <img src={selectedProduct.image} alt={selectedProduct.name} className="w-8 h-8 rounded-lg object-cover" />
                                      <div>
                                        <p className="text-xs font-bold text-primary">Producto</p>
                                        <p className="text-xs font-medium truncate max-w-[150px]">{selectedProduct.name}</p>
                                      </div>
                                    </>
                                  )}
                                </div>
                                <button
                                  onClick={() => {
                                    const newBanners = [...banners];
                                    newBanners[index] = { ...banner, link: '/products' };
                                    setBanners(newBanners);
                                  }}
                                  className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-500"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setActiveBannerSearch(activeBannerSearch === index ? null : index)}
                                className={`w-full px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                                  isDark ? 'bg-zinc-700/50 text-zinc-300 hover:bg-zinc-600' : 'bg-white text-zinc-600 hover:bg-zinc-100'
                                }`}
                              >
                                <Search className="w-4 h-4" />
                                Buscar Producto Específico
                              </button>
                            )}
                            
                            {activeBannerSearch === index && (
                              <div className={`rounded-xl border overflow-hidden ${isDark ? 'border-zinc-700' : 'border-zinc-200'}`}>
                                <div className={`flex items-center gap-2 p-3 border-b ${isDark ? 'border-zinc-700' : 'border-zinc-200'}`}>
                                  <Search className="w-4 h-4 text-zinc-400" />
                                  <input
                                    type="text"
                                    value={productSearchQuery}
                                    onChange={(e) => setProductSearchQuery(e.target.value)}
                                    placeholder="Buscar producto..."
                                    className={`flex-1 bg-transparent text-sm outline-none ${isDark ? 'text-white placeholder-zinc-500' : 'text-zinc-900 placeholder-zinc-400'}`}
                                    autoFocus
                                  />
                                  {productSearchQuery && (
                                    <button onClick={() => setProductSearchQuery('')} className="text-zinc-400 hover:text-white">
                                      <X className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                                <div className="max-h-48 overflow-y-auto">
                                  {filteredProducts.length === 0 ? (
                                    <p className="p-4 text-center text-xs text-zinc-500">No se encontraron productos</p>
                                  ) : (
                                    filteredProducts.map(product => (
                                      <button
                                        key={product.id}
                                        onClick={() => {
                                          const newBanners = [...banners];
                                          newBanners[index] = { ...banner, link: `/product/${product.id}` };
                                          setBanners(newBanners);
                                          setActiveBannerSearch(null);
                                          setProductSearchQuery('');
                                        }}
                                        className={`w-full flex items-center gap-3 p-3 text-left hover:bg-primary/10 transition-colors ${isDark ? 'border-b border-zinc-700/50' : 'border-b border-zinc-100'}`}
                                      >
                                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium truncate">{product.name}</p>
                                          <p className="text-xs text-zinc-500">{product.category}</p>
                                        </div>
                                      </button>
                                    ))
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {(selectedCategory || banner.link.startsWith('/product/')) && (
                              <p className="text-[10px] text-primary flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Enlazado a: {selectedCategory?.name || selectedProduct?.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`rounded-2xl overflow-hidden border ${isDark ? 'border-zinc-700 bg-zinc-900' : 'border-zinc-200 bg-zinc-50'}`}>
              <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? 'border-zinc-700' : 'border-zinc-200'}`}>
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-primary" />
                  <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    Vista Previa - Desktop
                  </h4>
                </div>
                <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Live
                </span>
              </div>
              
              <div className="p-6 lg:p-8">
                <div className="bg-white dark:bg-zinc-950 rounded-xl overflow-hidden shadow-2xl">
                  <div className="py-8 px-6 lg:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                      {banners.map((banner: any, idx: number) => (
                        <div 
                          key={banner.id}
                          className="relative h-[350px] md:h-[400px] rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer"
                        >
                          <img 
                            src={banner.image} 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                            alt={banner.title}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
                          <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 space-y-3">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
                              {banner.badgeIcon === 'Flame' ? (
                                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              )}
                              <span className="text-white text-[10px] md:text-xs font-black uppercase tracking-widest">{banner.badge}</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter italic leading-none">{banner.title}</h3>
                            <p className="text-white/60 font-medium text-sm md:text-base">{banner.subtitle}</p>
                            <button className={idx === 0 ? "bg-white text-zinc-900 px-6 md:px-8 py-3 md:py-4 rounded-xl text-xs md:text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2 w-fit" : "bg-primary text-white px-6 md:px-8 py-3 md:py-4 rounded-xl text-xs md:text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-zinc-950 transition-all w-fit"}>
                              {banner.buttonText}
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'collections':
        return (
          <div className="space-y-6">
            <div className={`p-4 rounded-xl ${isDark ? 'bg-primary/10 border border-primary/20' : 'bg-primary/5 border border-primary/10'}`}>
              <p className="text-xs text-zinc-500">Edita las colecciones del bento grid. La primera colección aparece más grande en la vista PC.</p>
            </div>
            
            <div className="space-y-4">
              <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                Configuración de Sección
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Título de Sección" 
                  value={collectionsTitle} 
                  onChange={setCollectionsTitle}
                  placeholder="Ej: Colecciones Maestras"
                />
                <Input 
                  label="Subtítulo de Sección" 
                  value={collectionsSubtitle} 
                  onChange={setCollectionsSubtitle}
                  placeholder="Ej: Explora los estilos..."
                  multiline
                  rows={2}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  Colecciones ({collections.length})
                </h4>
                <button
                  onClick={() => {
                    const newCollection = {
                      id: Date.now().toString(),
                      title: 'Nueva Colección',
                      description: 'Descripción de la colección.',
                      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
                      link: '/categories',
                      isFeatured: false,
                    };
                    setCollections([...collections, newCollection]);
                  }}
                  className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Agregar
                </button>
              </div>
              
              <div className="space-y-3">
                {collections.map((collection, index) => {
                  const selectedCategory = categories.find(c => `/category/${c.id}` === collection.link);
                  return (
                    <div 
                      key={collection.id} 
                      className={`rounded-2xl overflow-hidden transition-all ${
                        isDark ? 'bg-zinc-800/40 border border-zinc-700/50' : 'bg-zinc-50 border border-zinc-200'
                      } ${index === 0 ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-zinc-950' : ''}`}
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="relative w-full md:w-64 aspect-video md:aspect-square flex-shrink-0 bg-zinc-200 dark:bg-zinc-700">
                          <img src={collection.image} alt={collection.title} className="w-full h-full object-cover" />
                          <div className="absolute top-2 left-2 flex gap-2">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${index === 0 ? 'bg-primary text-white' : isDark ? 'bg-zinc-700 text-zinc-300' : 'bg-white/90 text-zinc-600'}`}>
                              {index === 0 ? '⭐ Principal' : `#${index + 1}`}
                            </span>
                          </div>
                          <div className="absolute bottom-2 left-2 right-2">
                            <div className="flex gap-1">
                              <button
                                onClick={() => {
                                  if (index > 0) {
                                    const newCollections = [...collections];
                                    [newCollections[index - 1], newCollections[index]] = [newCollections[index], newCollections[index - 1]];
                                    setCollections(newCollections);
                                  }
                                }}
                                disabled={index === 0}
                                className={`p-1.5 rounded-lg ${index === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/20'} bg-black/50 text-white transition-colors`}
                                title="Mover arriba"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => {
                                  if (index < collections.length - 1) {
                                    const newCollections = [...collections];
                                    [newCollections[index], newCollections[index + 1]] = [newCollections[index + 1], newCollections[index]];
                                    setCollections(newCollections);
                                  }
                                }}
                                disabled={index === collections.length - 1}
                                className={`p-1.5 rounded-lg ${index === collections.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/20'} bg-black/50 text-white transition-colors`}
                                title="Mover abajo"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => {
                                  const newCollections = [...collections];
                                  const duplicated = { ...collection, id: Date.now().toString(), title: `${collection.title} (copia)` };
                                  newCollections.splice(index + 1, 0, duplicated);
                                  setCollections(newCollections);
                                }}
                                className="p-1.5 rounded-lg hover:bg-white/20 bg-black/50 text-white transition-colors"
                                title="Duplicar"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => {
                                  const newCollections = collections.filter((_, i) => i !== index);
                                  setCollections(newCollections);
                                }}
                                className="p-1.5 rounded-lg hover:bg-red-500/80 bg-black/50 text-white transition-colors ml-auto"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-1 p-4 space-y-3">
                          <input
                            type="text"
                            value={collection.title}
                            onChange={(e) => {
                              const newCollections = [...collections];
                              newCollections[index] = { ...collection, title: e.target.value };
                              setCollections(newCollections);
                            }}
                            placeholder="Título de la colección"
                            className={`w-full px-3 py-2 rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-primary/30 ${
                              isDark ? 'bg-zinc-700/50 text-white placeholder-zinc-500' : 'bg-white text-zinc-900 placeholder-zinc-400'
                            }`}
                          />
                          
                          <textarea
                            value={collection.description}
                            onChange={(e) => {
                              const newCollections = [...collections];
                              newCollections[index] = { ...collection, description: e.target.value };
                              setCollections(newCollections);
                            }}
                            placeholder="Descripción breve..."
                            rows={2}
                            className={`w-full px-3 py-2 rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary/30 resize-none ${
                              isDark ? 'bg-zinc-700/50 text-white placeholder-zinc-500' : 'bg-white text-zinc-900 placeholder-zinc-400'
                            }`}
                          />
                          
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase">Categoría de Destino</label>
                            <div className="flex flex-wrap gap-2">
                              {categories.map(cat => (
                                <button
                                  key={cat.id}
                                  onClick={() => {
                                    const newCollections = [...collections];
                                    newCollections[index] = { ...collection, link: `/category/${cat.id}` };
                                    setCollections(newCollections);
                                  }}
                                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    `/category/${cat.id}` === collection.link
                                      ? 'bg-primary text-white'
                                      : isDark ? 'bg-zinc-700/50 text-zinc-300 hover:bg-zinc-600' : 'bg-white text-zinc-600 hover:bg-zinc-100'
                                  }`}
                                >
                                  <img src={cat.image} alt={cat.name} className="w-5 h-5 rounded object-cover" />
                                  {cat.name}
                                </button>
                              ))}
                              <button
                                onClick={() => {
                                  const newCollections = [...collections];
                                  newCollections[index] = { ...collection, link: '/categories' };
                                  setCollections(newCollections);
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                  collection.link === '/categories'
                                    ? 'bg-primary text-white'
                                    : isDark ? 'bg-zinc-700/50 text-zinc-300 hover:bg-zinc-600' : 'bg-white text-zinc-600 hover:bg-zinc-100'
                                }`}
                              >
                                Todas
                              </button>
                            </div>
                            {selectedCategory && (
                              <p className="text-[10px] text-primary flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Enlazado a: {selectedCategory.name}
                              </p>
                            )}
                          </div>
                          
                          <label className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                            isDark ? 'bg-zinc-700/50 hover:bg-zinc-600 text-zinc-300' : 'bg-white hover:bg-zinc-100 text-zinc-600'
                          }`}>
                            <Upload className="w-4 h-4" />
                            Cambiar Imagen
                            <input type="file" accept="image/*" onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                const base64 = await compressImage(file);
                                const newCollections = [...collections];
                                newCollections[index] = { ...collection, image: base64 };
                                setCollections(newCollections);
                                showToast('Imagen actualizada', 'success');
                              } catch {
                                showToast('Error al subir imagen', 'error');
                              }
                            }} className="hidden" />
                          </label>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {collections.length === 0 && (
                  <div className={`text-center py-12 rounded-2xl ${isDark ? 'bg-zinc-800/40 border border-zinc-700/50' : 'bg-zinc-50 border border-zinc-200'}`}>
                    <Palette className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-zinc-600' : 'text-zinc-300'}`} />
                    <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>No hay colecciones todavía</p>
                    <button
                      onClick={() => {
                        const newCollection = {
                          id: Date.now().toString(),
                          title: 'Mi Colección',
                          description: 'Descripción de la colección.',
                          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
                          link: '/categories',
                          isFeatured: false,
                        };
                        setCollections([newCollection]);
                      }}
                      className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors"
                    >
                      Crear primera colección
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className={`rounded-2xl overflow-hidden border ${isDark ? 'border-zinc-700 bg-zinc-900' : 'border-zinc-200 bg-zinc-50'}`}>
              <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? 'border-zinc-700' : 'border-zinc-200'}`}>
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-primary" />
                  <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    Vista Previa - Desktop
                  </h4>
                </div>
                <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Live
                </span>
              </div>
              
              <div className="p-6 lg:p-8">
                <div className="bg-white dark:bg-zinc-950 rounded-xl overflow-hidden shadow-2xl">
                  <div className="py-8 px-6 lg:px-12">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 lg:mb-12 gap-4">
                      <div className="space-y-2">
                        <span className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">Curaduría</span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic leading-none">
                          {collectionsTitle} <br /> <span className="text-primary">Maestras</span>
                        </h2>
                      </div>
                      <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-sm text-sm md:text-base">{collectionsSubtitle}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-6 h-auto lg:h-[500px] xl:h-[600px]">
                      {collections.length === 0 ? (
                        <div className="col-span-4 row-span-2 flex items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900 border-2 border-dashed border-zinc-300 dark:border-zinc-700">
                          <div className="text-center">
                            <Palette className="w-12 h-12 mx-auto mb-3 text-zinc-300 dark:text-zinc-600" />
                            <p className="text-sm text-zinc-500">Sin colecciones</p>
                            <p className="text-xs text-zinc-400">Agrega colecciones arriba</p>
                          </div>
                        </div>
                      ) : collections.slice(0, 4).map((collection, index) => {
                        const isLarge = index === 0;
                        return (
                          <div 
                            key={collection.id}
                            className={`relative rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl transition-all ${
                              isLarge ? 'lg:col-span-2 lg:row-span-2' : 'lg:col-span-1 lg:row-span-1'
                            }`}
                          >
                            <img 
                              src={collection.image} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                              alt={collection.title}
                            />
                            <div className={`absolute inset-0 ${isLarge ? 'bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent' : 'bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent'}`} />
                            <div className={`absolute ${isLarge ? 'bottom-6 md:bottom-10 left-6 md:left-10 right-6 md:right-10 space-y-3' : 'bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6'} space-y-2`}>
                              {isLarge && (
                                <span className="bg-primary text-white px-3 md:px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-block">Destacado</span>
                              )}
                              <h3 className={`font-black text-white uppercase tracking-tighter italic leading-none ${isLarge ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-xl md:text-2xl'}`}>
                                {collection.title}
                              </h3>
                              {isLarge ? (
                                <>
                                  <p className="text-white/60 font-medium text-sm md:text-base max-w-md">{collection.description}</p>
                                  <div className="flex items-center gap-3 text-primary text-xs font-black uppercase tracking-widest pt-2 group-hover:translate-x-2 transition-transform">
                                    Explorar Colección <ArrowRight className="w-4 h-4" />
                                  </div>
                                </>
                              ) : (
                                <p className="text-white/60 font-medium text-xs md:text-sm line-clamp-1">{collection.description}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {collections.length > 4 && (
                        <div className="lg:col-span-1 lg:row-span-1 flex items-center justify-center rounded-2xl md:rounded-3xl bg-zinc-200 dark:bg-zinc-800">
                          <span className="text-lg font-bold text-zinc-400">+{collections.length - 4}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'testimonials':
        return (
          <div className="space-y-6">
            <div className={`p-4 rounded-xl ${isDark ? 'bg-primary/10 border border-primary/20' : 'bg-primary/5 border border-primary/10'}`}>
              <p className="text-xs text-zinc-500">Edita la sección de testimonios de clientes. Cada testimonio muestra el nombre, rol, contenido y calificación.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  Configuración
                </h4>
                
                <Input 
                  label="Etiqueta Superior" 
                  value={testimonialsSubtitle} 
                  onChange={setTestimonialsSubtitle}
                  placeholder="Ej: Comunidad"
                />
                <Input 
                  label="Título de Sección" 
                  value={testimonialsTitle} 
                  onChange={setTestimonialsTitle}
                  placeholder="Ej: Voces de Excelencia"
                />
              </div>
              
              <div className={`p-4 rounded-2xl ${isDark ? 'bg-zinc-800/40 border border-zinc-700/50' : 'bg-zinc-50 border border-zinc-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    Vista Previa
                  </h4>
                  <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold">Live</span>
                </div>
                <div className={`p-3 rounded-xl ${isDark ? 'bg-zinc-950' : 'bg-white'}`}>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{testimonialsSubtitle}</p>
                  <h3 className="text-lg font-black text-zinc-900 dark:text-white uppercase italic tracking-tight">
                    {testimonialsTitle.split(' ').map((word, i) => (
                      i === 0 ? <span key={i}>{word}</span> : i === 1 ? <span key={i}> <span className="text-primary">{word}</span></span> : <span key={i}> {word}</span>
                    ))}
                  </h3>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  Testimonios ({testimonials.length})
                </h4>
                <button
                  onClick={() => {
                    const newTestimonial = {
                      id: Date.now().toString(),
                      name: 'Nuevo Cliente',
                      role: 'Cliente',
                      content: 'Excelente servicio y calidad.',
                      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
                      rating: 5,
                    };
                    setTestimonials([...testimonials, newTestimonial]);
                  }}
                  className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Agregar
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {testimonials.map((testimonial, index) => (
                  <div key={testimonial.id} className={`rounded-2xl overflow-hidden ${isDark ? 'bg-zinc-800/40 border border-zinc-700/50' : 'bg-zinc-50 border border-zinc-200'}`}>
                    <div className="relative p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-xl object-cover border-2 border-primary/20" />
                          <div>
                            <input
                              type="text"
                              value={testimonial.name}
                              onChange={(e) => {
                                const newTestimonials = [...testimonials];
                                newTestimonials[index] = { ...testimonial, name: e.target.value };
                                setTestimonials(newTestimonials);
                              }}
                              placeholder="Nombre"
                              className={`text-sm font-bold outline-none bg-transparent ${isDark ? 'text-white' : 'text-zinc-900'}`}
                            />
                            <input
                              type="text"
                              value={testimonial.role}
                              onChange={(e) => {
                                const newTestimonials = [...testimonials];
                                newTestimonials[index] = { ...testimonial, role: e.target.value };
                                setTestimonials(newTestimonials);
                              }}
                              placeholder="Rol/Profesión"
                              className={`text-[10px] outline-none bg-transparent text-primary ${isDark ? 'text-primary' : 'text-primary'}`}
                            />
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              const newTestimonials = [...testimonials];
                              const duplicated = { ...testimonial, id: Date.now().toString() };
                              newTestimonials.splice(index + 1, 0, duplicated);
                              setTestimonials(newTestimonials);
                            }}
                            className="p-1.5 rounded-lg hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                            title="Duplicar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              const newTestimonials = testimonials.filter((_, i) => i !== index);
                              setTestimonials(newTestimonials);
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-500 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => {
                              const newTestimonials = [...testimonials];
                              newTestimonials[index] = { ...testimonial, rating: star };
                              setTestimonials(newTestimonials);
                            }}
                            className="transition-colors"
                          >
                            <Star className={`w-4 h-4 ${star <= testimonial.rating ? 'text-amber-500 fill-amber-500' : 'text-zinc-300 dark:text-zinc-600'}`} />
                          </button>
                        ))}
                      </div>
                      
                      <textarea
                        value={testimonial.content}
                        onChange={(e) => {
                          const newTestimonials = [...testimonials];
                          newTestimonials[index] = { ...testimonial, content: e.target.value };
                          setTestimonials(newTestimonials);
                        }}
                        placeholder="Contenido del testimonio..."
                        rows={3}
                        className={`w-full px-3 py-2 rounded-lg text-xs outline-none resize-none ${
                          isDark ? 'bg-zinc-700/50 text-white placeholder-zinc-500' : 'bg-white text-zinc-900 placeholder-zinc-400'
                        }`}
                      />
                      
                      <label className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                        isDark ? 'bg-zinc-700/50 hover:bg-zinc-600 text-zinc-300' : 'bg-white hover:bg-zinc-100 text-zinc-600'
                      }`}>
                        <Upload className="w-3 h-3" />
                        Cambiar Foto
                        <input type="file" accept="image/*" onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const base64 = await compressImage(file);
                            const newTestimonials = [...testimonials];
                            newTestimonials[index] = { ...testimonial, avatar: base64 };
                            setTestimonials(newTestimonials);
                            showToast('Foto actualizada', 'success');
                          } catch {
                            showToast('Error al subir imagen', 'error');
                          }
                        }} className="hidden" />
                      </label>
                    </div>
                  </div>
                ))}
                
                {testimonials.length === 0 && (
                  <div className="col-span-full text-center py-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border-2 border-dashed border-zinc-300 dark:border-zinc-700">
                    <Users className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-zinc-600' : 'text-zinc-300'}`} />
                    <p className={`text-sm ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Sin testimonios</p>
                    <button
                      onClick={() => {
                        const newTestimonial = {
                          id: Date.now().toString(),
                          name: 'Cliente',
                          role: 'Cliente',
                          content: 'Excelente servicio.',
                          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
                          rating: 5,
                        };
                        setTestimonials([newTestimonial]);
                      }}
                      className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold"
                    >
                      Crear primer testimonio
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className={`rounded-2xl overflow-hidden border ${isDark ? 'border-zinc-700 bg-zinc-900' : 'border-zinc-200 bg-zinc-50'}`}>
              <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? 'border-zinc-700' : 'border-zinc-200'}`}>
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-primary" />
                  <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    Vista Previa - Desktop
                  </h4>
                </div>
                <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Live
                </span>
              </div>
              
              <div className="p-6 lg:p-8">
                <div className="bg-white dark:bg-zinc-950 rounded-xl overflow-hidden shadow-2xl">
                  <div className="py-10 px-6 lg:px-12">
                    <div className="text-center space-y-3 mb-10">
                      <span className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">{testimonialsSubtitle}</span>
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic leading-none">
                        {testimonialsTitle.split(' ').map((word, i) => (
                          i === 0 ? <span key={i}>{word}</span> : i === 1 ? <span key={i}> <span className="text-primary">{word}</span></span> : <span key={i}> {word}</span>
                        ))}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {testimonials.slice(0, 3).map((testimonial, idx) => (
                        <div key={testimonial.id} className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 relative group">
                          <svg className="absolute top-4 right-4 w-6 h-6 text-primary/10 group-hover:text-primary/20 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                          </svg>
                          <div className="space-y-3">
                            <div className="flex gap-0.5">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                              ))}
                            </div>
                            <p className="text-zinc-600 dark:text-zinc-300 text-sm font-medium italic">"{testimonial.content}"</p>
                            <div className="flex items-center gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                              <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-xl object-cover border-2 border-primary/20" />
                              <div>
                                <h4 className="text-zinc-900 dark:text-white font-black uppercase tracking-tighter italic text-sm">{testimonial.name}</h4>
                                <p className="text-primary text-[10px] font-black uppercase tracking-widest">{testimonial.role}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          );

      case 'featured':
        return (
          <div className="space-y-6">
            <div className={`p-4 rounded-xl ${isDark ? 'bg-primary/10 border border-primary/20' : 'bg-primary/5 border border-primary/10'}`}>
              <p className="text-xs text-zinc-500">Título de la sección de productos más vendidos o destacados.</p>
            </div>
            <Input 
              label="Título de Sección" 
              value={featuredTitle} 
              onChange={setFeaturedTitle}
              placeholder="Ej: Lo Más Buscado"
            />
            <Input 
              label="Subtítulo de Sección" 
              value={featuredSubtitle} 
              onChange={setFeaturedSubtitle}
              placeholder="Ej: Productos que definen tendencias"
              multiline
              rows={2}
            />
          </div>
        );

      case 'footer':
        return (
          <div className="space-y-6">
            <div className={`p-4 rounded-xl ${isDark ? 'bg-primary/10 border border-primary/20' : 'bg-primary/5 border border-primary/10'}`}>
              <p className="text-xs text-zinc-500">Configura el pie de página de tu tienda. Estos cambios se mostrarán en todas las páginas.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* General Settings */}
              <div className="lg:col-span-2 space-y-4">
                <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  Configuración General
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="Eslogan / Tagline" 
                    value={footerSettings.tagline} 
                    onChange={(v: string) => setFooterSettings({ ...footerSettings, tagline: v })}
                    placeholder="Ej: Elegancia atemporal para el hombre moderno."
                  />
                  
                  <Input 
                    label="Texto de Copyright" 
                    value={footerSettings.copyrightText} 
                    onChange={(v: string) => setFooterSettings({ ...footerSettings, copyrightText: v })}
                    placeholder="Ej: TODOS LOS DERECHOS RESERVADOS."
                  />
                </div>

                {/* Style */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Estilo de Fondo</label>
                  <div className="flex gap-3">
                    {['dark', 'neutral', 'gradient'].map((style) => (
                      <button
                        key={style}
                        onClick={() => setFooterSettings({ ...footerSettings, backgroundStyle: style })}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          footerSettings.backgroundStyle === style
                            ? 'bg-primary text-white'
                            : isDark ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700' : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300'
                        }`}
                      >
                        {style === 'dark' ? 'Oscuro' : style === 'neutral' ? 'Neutral' : 'Gradiente'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visibility */}
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Secciones Visibles</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { key: 'showSocial', label: 'Redes', icon: '📱' },
                      { key: 'showLinks', label: 'Enlaces', icon: '🔗' },
                      { key: 'showContact', label: 'Contacto', icon: '📧' },
                      { key: 'showCopyright', label: 'Copyright', icon: '©️' },
                    ].map(({ key, label, icon }) => (
                      <label
                        key={key}
                        className={`flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all ${
                          footerSettings[key as keyof typeof footerSettings]
                            ? isDark ? 'bg-primary/20 border border-primary/30' : 'bg-primary/10 border border-primary/20'
                            : isDark ? 'bg-zinc-800/50 border border-zinc-700/50' : 'bg-zinc-100 border border-zinc-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={footerSettings[key as keyof typeof footerSettings] as boolean}
                          onChange={(e) => setFooterSettings({ ...footerSettings, [key]: e.target.checked })}
                          className="sr-only"
                        />
                        <span className="text-lg">{icon}</span>
                        <span className="text-sm font-medium">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className={`p-4 rounded-xl ${isDark ? 'bg-zinc-800/40 border border-zinc-700/50' : 'bg-zinc-50 border border-zinc-200'}`}>
                  <h5 className={`text-xs font-bold mb-3 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    Información de Contacto
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase mb-1 block">Teléfono</label>
                      <input
                        type="text"
                        value={footerSettings.contactInfo?.phone || ''}
                        onChange={(e) => setFooterSettings({ 
                          ...footerSettings, 
                          contactInfo: { ...footerSettings.contactInfo, phone: e.target.value }
                        })}
                        placeholder="+57 300 123 4567"
                        className={`w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30 ${
                          isDark ? 'bg-zinc-700/50 text-white' : 'bg-white text-zinc-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase mb-1 block">Email</label>
                      <input
                        type="email"
                        value={footerSettings.contactInfo?.email || ''}
                        onChange={(e) => setFooterSettings({ 
                          ...footerSettings, 
                          contactInfo: { ...footerSettings.contactInfo, email: e.target.value }
                        })}
                        placeholder="contacto@tuweb.com"
                        className={`w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30 ${
                          isDark ? 'bg-zinc-700/50 text-white' : 'bg-white text-zinc-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase mb-1 block">Dirección</label>
                      <input
                        type="text"
                        value={footerSettings.contactInfo?.address || ''}
                        onChange={(e) => setFooterSettings({ 
                          ...footerSettings, 
                          contactInfo: { ...footerSettings.contactInfo, address: e.target.value }
                        })}
                        placeholder="Ciudad, País"
                        className={`w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30 ${
                          isDark ? 'bg-zinc-700/50 text-white' : 'bg-white text-zinc-900'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className={`p-4 rounded-xl ${isDark ? 'bg-zinc-800/40 border border-zinc-700/50' : 'bg-zinc-50 border border-zinc-200'}`}>
                  <h5 className={`text-xs font-bold mb-3 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    Redes Sociales
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
                      { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/...' },
                      { key: 'twitter', label: 'Twitter/X', placeholder: 'https://x.com/...' },
                      { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/...' },
                      { key: 'whatsapp', label: 'WhatsApp', placeholder: '+57 300 123 4567' },
                      { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@...' },
                    ].map(({ key, label, placeholder }) => (
                      <div key={key} className="flex items-center gap-2">
                        <span className="w-20 text-xs text-zinc-500 font-medium">{label}</span>
                        <input
                          type="text"
                          value={footerSettings.socialLinks[key as keyof typeof footerSettings.socialLinks] || ''}
                          onChange={(e) => setFooterSettings({ 
                            ...footerSettings, 
                            socialLinks: { ...footerSettings.socialLinks, [key]: e.target.value }
                          })}
                          placeholder={placeholder}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30 ${
                            isDark ? 'bg-zinc-700/50 text-white' : 'bg-white text-zinc-900'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className={`p-4 rounded-2xl ${isDark ? 'bg-zinc-800/40 border border-zinc-700/50' : 'bg-zinc-50 border border-zinc-200'}`}>
                <h4 className={`text-sm font-bold mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  Enlaces Rápidos
                </h4>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {footerSettings.quickLinks.map((link: any, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={link.name}
                        onChange={(e) => {
                          const newLinks = [...footerSettings.quickLinks];
                          newLinks[index] = { ...link, name: e.target.value };
                          setFooterSettings({ ...footerSettings, quickLinks: newLinks });
                        }}
                        placeholder="Nombre"
                        className={`flex-1 px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30 ${
                          isDark ? 'bg-zinc-700/50 text-white' : 'bg-white text-zinc-900'
                        }`}
                      />
                      <select
                        value={link.href}
                        onChange={(e) => {
                          const newLinks = [...footerSettings.quickLinks];
                          newLinks[index] = { ...link, href: e.target.value };
                          setFooterSettings({ ...footerSettings, quickLinks: newLinks });
                        }}
                        className={`px-2 py-2 rounded-lg text-sm outline-none ${
                          isDark ? 'bg-zinc-700/50 text-white' : 'bg-white text-zinc-900'
                        }`}
                      >
                        <option value="/">Inicio</option>
                        <option value="/products">Productos</option>
                        <option value="/categories">Categorías</option>
                        <option value="/offers">Ofertas</option>
                        <option value="/cart">Carrito</option>
                        <option value="/wishlist">Wishlist</option>
                        <option value="#">Otro</option>
                      </select>
                      <button
                        onClick={() => {
                          const newLinks = footerSettings.quickLinks.filter((_: any, i: number) => i !== index);
                          setFooterSettings({ ...footerSettings, quickLinks: newLinks });
                        }}
                        className="p-2 hover:bg-red-500/20 rounded-lg text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newLinks = [...footerSettings.quickLinks, { name: 'Nuevo Enlace', href: '/' }];
                      setFooterSettings({ ...footerSettings, quickLinks: newLinks });
                    }}
                    className={`w-full py-2 rounded-lg text-sm font-medium border-2 border-dashed flex items-center justify-center gap-2 ${
                      isDark ? 'border-zinc-700 text-zinc-500 hover:border-primary hover:text-primary' : 'border-zinc-300 text-zinc-400 hover:border-primary hover:text-primary'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Enlace
                  </button>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className={`rounded-2xl overflow-hidden border ${isDark ? 'border-zinc-700 bg-zinc-900' : 'border-zinc-200 bg-zinc-50'}`}>
              <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? 'border-zinc-700' : 'border-zinc-200'}`}>
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-primary" />
                  <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    Vista Previa del Footer
                  </h4>
                </div>
                <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Live
                </span>
              </div>
              
              <div className="p-4">
                <div className={`rounded-xl overflow-hidden ${
                  footerSettings.backgroundStyle === 'dark' ? 'bg-zinc-950' : 
                  footerSettings.backgroundStyle === 'gradient' ? 'bg-gradient-to-br from-zinc-900 via-zinc-950 to-black' : 'bg-zinc-900'
                } text-white`}>
                  <div className="relative overflow-hidden py-10 px-6">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute -top-20 -left-20 w-32 h-32 bg-primary/20 blur-[60px] rounded-full" />
                      <div className="absolute -bottom-20 -right-20 w-32 h-32 bg-primary/10 blur-[40px] rounded-full" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
                        <div className="text-center md:text-left">
                          <h2 className="text-2xl font-black tracking-tighter italic mb-2">
                            JEANCOL
                          </h2>
                          <p className="text-zinc-400 text-xs max-w-xs">
                            {footerSettings.tagline}
                          </p>
                          {footerSettings.showSocial && (
                            <div className="flex items-center justify-center md:justify-start gap-2 mt-4">
                              {(footerSettings.socialLinks.instagram || footerSettings.socialLinks.facebook) && ['📷', '📘', '🐦', '📺'].slice(0, 4).map((icon, i) => (
                                <span key={i} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sm">
                                  {icon}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {footerSettings.showLinks && (
                          <div className="text-center md:text-left">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3">Navegación</h3>
                            <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2">
                              {footerSettings.quickLinks.slice(0, 5).map((link: any) => (
                                <span key={link.name} className="text-xs text-zinc-400 hover:text-white cursor-pointer transition-colors">
                                  {link.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {footerSettings.showContact && (
                          <div className="text-center md:text-left">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3">Contacto</h3>
                            <div className="space-y-1.5 text-xs text-zinc-400">
                              {footerSettings.contactInfo?.phone && <p>📞 {footerSettings.contactInfo.phone}</p>}
                              {footerSettings.contactInfo?.email && <p>✉️ {footerSettings.contactInfo.email}</p>}
                              {footerSettings.contactInfo?.address && <p>📍 {footerSettings.contactInfo.address}</p>}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {footerSettings.showCopyright && (
                    <div className="py-3 border-t border-white/5 text-center">
                      <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
                        © {new Date().getFullYear()} JEANCOL. {footerSettings.copyrightText}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row ${isDark ? 'bg-zinc-950' : 'bg-zinc-100'}`}>
      <AdminNavigation />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <header className={`sticky top-0 z-40 flex-shrink-0 ${
          isDark ? 'bg-zinc-900/95 border-zinc-800' : 'bg-white/95 border-zinc-200'
        } backdrop-blur-xl border-b px-4 lg:px-6 py-3 lg:py-4`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Layout className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-base lg:text-xl font-black text-primary uppercase tracking-tight flex items-center gap-2">
                  Editor de Home
                  {hasChanges && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Cambios sin guardar" />
                  )}
                </h1>
                <p className={`text-[10px] lg:text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-500'} hidden sm:block`}>
                  Personaliza cada sección de tu página principal
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 lg:gap-3">
              <div className={`hidden md:flex items-center gap-1 p-1 rounded-xl ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-2 rounded-lg transition-all ${previewMode === 'desktop' ? 'bg-primary text-white' : isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'}`}
                  title="Escritorio"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-2 rounded-lg transition-all ${previewMode === 'mobile' ? 'bg-primary text-white' : isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'}`}
                  title="Móvil"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
              
              <button 
                onClick={handleReset}
                className={`px-3 lg:px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                  isDark ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white' : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Restaurar</span>
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 lg:px-6 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-primary/25"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="hidden lg:inline">Guardando...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Guardar</span>
                    {hasChanges && <span className="w-2 h-2 rounded-full bg-amber-300" />}
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6 xl:p-8">
            <div className={`rounded-2xl border shadow-xl ${
              isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
            }`}>
              <div className={`flex border-b overflow-x-auto no-scrollbar ${
                isDark ? 'border-zinc-800' : 'border-zinc-100'
              }`}>
                {TABS.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 border-b-2 flex-shrink-0 ${
                        activeTab === tab.id
                          ? 'text-primary border-primary bg-primary/5'
                          : isDark 
                            ? 'text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-zinc-800/50' 
                            : 'text-zinc-500 border-transparent hover:text-zinc-700 hover:bg-zinc-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
              <div className="p-4 lg:p-6 xl:p-8">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
