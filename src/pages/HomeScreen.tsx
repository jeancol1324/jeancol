import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShoppingBag, 
  ArrowRight, 
  Star, 
  Zap, 
  Flame, 
  TrendingUp, 
  Eye,
  Quote,
  Instagram,
  Twitter,
  Facebook,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  ChevronRight,
  ChevronLeft,
  CreditCard,
  Package,
  Lock,
  Clock,
  Sparkles,
  Gift,
  Tag,
  BadgePercent,
  Leaf,
  Award,
  Heart,
  Ticket,
  List
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { QuickView } from '../components/QuickView';
import { Helmet } from 'react-helmet-async';
import { MarqueeText, TiltCard } from '../components/Animations';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { useProducts } from '../context/ProductContext';

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Heart,
  Star,
  ShoppingBag,
  CreditCard,
  Package,
  Lock,
  Clock,
  Sparkles,
  Gift,
  Tag,
  BadgePercent,
  Leaf,
  Flame,
  TrendingUp,
  Award,
  Zap,
};

const trustItems = (() => {
  const saved = localStorage.getItem('trustItems');
  return saved ? JSON.parse(saved) : [
    { icon: 'Truck', title: 'Envío Express', description: 'Gratis en pedidos +$150' },
    { icon: 'ShieldCheck', title: 'Pago Seguro', description: 'Encriptación SSL 256-bit' },
    { icon: 'RotateCcw', title: 'Devolución Fácil', description: '30 días de garantía' },
    { icon: 'Headphones', title: 'Soporte 24/7', description: 'Atención personalizada' },
  ];
})();

const featuredProducts = [
  {
    id: '1',
    name: 'Sudadera Premium Oversize',
    price: 89.99,
    offerPrice: 59.99,
    offerEndDate: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80',
    category: 'Hombres',
    rating: 4.8,
    reviews: 124,
    isNew: true,
    isTrending: true,
    viewers: 89,
    stock: 5,
  },
  {
    id: '2',
    name: 'Vestido de Seda',
    price: 249.99,
    offerPrice: 179.99,
    offerEndDate: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1539008835154-33321e17c76a?auto=format&fit=crop&w=800&q=80',
    category: 'Mujeres',
    rating: 4.9,
    reviews: 86,
    isNew: true,
    isTrending: false,
    viewers: 156,
    stock: 3,
  },
  {
    id: '3',
    name: 'Reloj Cronógrafo Elite',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80',
    category: 'Accesorios',
    rating: 4.7,
    reviews: 42,
    isNew: false,
    isTrending: true,
    viewers: 215,
    stock: 8,
  },
  {
    id: '4',
    name: 'Zapatillas Pro',
    price: 159.99,
    offerPrice: 99.99,
    offerEndDate: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    category: 'Calzado',
    rating: 4.6,
    reviews: 234,
    isNew: false,
    isTrending: false,
    viewers: 167,
    stock: 12,
  },
  {
    id: '5',
    name: 'Chaqueta Bomber',
    price: 179.99,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    category: 'Hombres',
    rating: 4.5,
    reviews: 78,
    isNew: true,
    isTrending: false,
    viewers: 92,
    stock: 7,
  },
  {
    id: '6',
    name: 'Bolso de Cuero',
    price: 129.99,
    offerPrice: 79.99,
    offerEndDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    category: 'Accesorios',
    rating: 4.8,
    reviews: 156,
    isNew: false,
    isTrending: true,
    viewers: 134,
    stock: 15,
  },
  {
    id: '7',
    name: 'Camisa Formal',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    category: 'Hombres',
    rating: 4.4,
    reviews: 203,
    isNew: false,
    isTrending: false,
    viewers: 67,
    stock: 20,
  },
  {
    id: '8',
    name: 'Falda Midi',
    price: 99.99,
    offerPrice: 59.99,
    offerEndDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0uj7d?auto=format&fit=crop&w=800&q=80',
    category: 'Mujeres',
    rating: 4.7,
    reviews: 89,
    isNew: true,
    isTrending: false,
    viewers: 45,
    stock: 6,
  },
  {
    id: '9',
    name: 'Gafas Aviador',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    category: 'Accesorios',
    rating: 4.9,
    reviews: 312,
    isNew: false,
    isTrending: true,
    viewers: 198,
    stock: 25,
  },
  {
    id: '10',
    name: 'Botas Chelsea',
    price: 219.99,
    offerPrice: 149.99,
    offerEndDate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1542280756-74b2f55e73ab?auto=format&fit=crop&w=800&q=80',
    category: 'Calzado',
    rating: 4.6,
    reviews: 67,
    isNew: false,
    isTrending: false,
    viewers: 78,
    stock: 9,
  },
  {
    id: '11',
    name: 'Pantalón Cargo',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    category: 'Hombres',
    rating: 4.5,
    reviews: 145,
    isNew: true,
    isTrending: true,
    viewers: 112,
    stock: 11,
  },
  {
    id: '12',
    name: 'Top Deportivo',
    price: 59.99,
    offerPrice: 39.99,
    offerEndDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    category: 'Deportes',
    rating: 4.8,
    reviews: 234,
    isNew: false,
    isTrending: false,
    viewers: 89,
    stock: 18,
  },
];

const collections = [
  {
    title: 'Urban Core',
    desc: 'La esencia de la calle elevada al lujo.',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80',
    size: 'large'
  },
  {
    title: 'Minimalist',
    desc: 'Menos es más, siempre.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    size: 'small'
  },
  {
    title: 'Sartorial',
    desc: 'Sastrería moderna para el día a día.',
    image: 'https://images.unsplash.com/photo-1594932224440-746932266e62?auto=format&fit=crop&w=800&q=80',
    size: 'small'
  }
];

const testimonials = [
  {
    id: 1,
    name: 'Elena Rodríguez',
    role: 'Fashion Blogger',
    content: 'La calidad de las prendas es simplemente excepcional. El corte sastre y la atención al detalle superan cualquier expectativa.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 5
  },
  {
    id: 2,
    name: 'Marco Vales',
    role: 'Arquitecto',
    content: 'Buscaba algo minimalista pero con carácter. Esta tienda se ha convertido en mi referente para el día a día profesional.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 5
  },
  {
    id: 3,
    name: 'Sofía Martínez',
    role: 'Diseñadora UX',
    content: 'La experiencia de compra es tan fluida como sus diseños. El envío fue rapidísimo y el empaque es puro lujo.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    rating: 5
  }
];

const getTestimonials = () => {
  const saved = localStorage.getItem('homeTestimonials');
  return saved ? JSON.parse(saved) : testimonials;
};

const getTestimonialsTitle = () => {
  return localStorage.getItem('testimonialsTitle') || 'Voces de Excelencia';
};

const getTestimonialsSubtitle = () => {
  return localStorage.getItem('testimonialsSubtitle') || 'Comunidad';
};

const trendingCategories = [
  { name: 'Streetwear', icon: Zap, count: '45 Artículos' },
  { name: 'Minimalist', icon: Star, count: '32 Artículos' },
  { name: 'Sartorial', icon: Flame, count: '28 Artículos' },
  { name: 'Athleisure', icon: TrendingUp, count: '54 Artículos' }
];

const brands = [
  'VOGUE', 'GQ', 'HYPEBEAST', 'HIGHSNOBIETY', 'COMPLEX', 'WWD', 'DAZED', 'I-D'
];

export const HomeScreen = () => {
  const navigate = useNavigate();
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const { getStoreName, settings } = useStore();
  const { products: allProducts } = useProducts();
  const storeName = getStoreName();
  const hero = settings.heroSection || {
    title: 'Define tu Legado',
    subtitle: 'Explora nuestra curaduría de piezas icónicas y colecciones maestras que definen la nueva era de la moda.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80',
    buttonText: 'Explorar Colección',
    badgeText: 'Nueva Colección 2024',
    liveText: '+1,200 personas comprando ahora',
  };
  
  const randomProducts = useMemo(() => {
    return [...allProducts]
      .filter(p => (p.stock || 0) > 0)
      .sort(() => Math.random() - 0.5);
  }, [allProducts]);
  
  const homeBanners = JSON.parse(localStorage.getItem('homeBanners') || 'null') || [
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
      link: '/products',
      buttonText: 'Descubrir Más',
      isLarge: false,
    },
  ];
  
  const homeCollections = JSON.parse(localStorage.getItem('homeCollections') || 'null') || [
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
  
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-500">
      <Helmet>
        <title>JEANCOL | Moda de Lujo y Streetwear Exclusivo</title>
        <meta name="description" content="Descubre la colección definitiva de moda urbana y lujo. Envíos rápidos, calidad premium y diseños exclusivos. Define tu legado con JEANCOL." />
        <meta property="og:title" content="JEANCOL | Define tu Legado" />
        <meta property="og:description" content="Explora nuestra curaduría de piezas icónicas y colecciones maestras." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80" />
      </Helmet>

      <MarqueeText 
        text="ENVÍO GRATIS EN PEDIDOS +$150 • FLASH SALE: 30% OFF EN SELECCIONADOS • ÚLTIMAS UNIDADES • NUEVA COLECCIÓN INVADER DISPONIBLE AHORA" 
        speed={40}
        className="bg-primary text-white py-3 text-xs sm:text-sm font-bold uppercase tracking-wider"
        separator="•"
      />

      <motion.section 
        style={{ scale, opacity }}
        className="relative h-[85vh] md:h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <motion.img 
            src={hero.image} 
            className="w-full h-full object-cover"
            alt="hero"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/70 via-zinc-950/40 to-zinc-950/80" />
        </div>

        <div className="relative z-10 text-center px-4 md:px-8 max-w-5xl mx-auto space-y-6 md:space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <span className="bg-white/10 backdrop-blur-xl text-white px-4 md:px-6 py-2 md:py-3 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.3em] md:tracking-[0.5em] border border-white/20 shadow-2xl">
              {hero.badgeText}
            </span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30"
          >
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative flex h-2 w-2 md:h-3 md:w-3"
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-full w-full bg-primary"></span>
            </motion.div>
            <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-wider">{hero.liveText}</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white uppercase tracking-tighter italic leading-[0.9] drop-shadow-2xl"
          >
            {hero.title}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-white/70 md:text-white/80 text-sm md:text-base lg:text-lg max-w-xl mx-auto font-medium leading-relaxed"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 pt-4 md:pt-6"
          >
            <motion.button 
              onClick={() => navigate('/categories')}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto bg-primary text-white px-8 md:px-12 lg:px-16 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 md:gap-4"
            >
              {hero.buttonText}
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </motion.button>
            <motion.button 
              onClick={() => navigate('/offers')}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto bg-white/10 backdrop-blur-xl text-white border border-white/20 px-8 md:px-12 lg:px-16 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3"
            >
              Ver Ofertas
              <Zap className="w-4 h-4 md:w-5 md:h-5" />
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-white/50 text-[10px] uppercase tracking-widest">Scroll</span>
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border-2 border-white/30 flex justify-center pt-1"
          >
            <motion.div className="w-1 h-2 rounded-full bg-white/50" />
          </motion.div>
        </motion.div>

        {/* Floating Stats */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-20 left-4 md:left-8 lg:left-12 hidden md:flex flex-col gap-4"
        >
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 md:p-4 rounded-xl border border-white/10">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-black text-xs uppercase tracking-widest">+15k Ventas</p>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Este mes</p>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Trust Bar */}
      <section className="bg-zinc-50 dark:bg-zinc-900/30 py-12 border-b border-zinc-100 dark:border-zinc-800">
        <div className="w-full px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {trustItems.map((item, i) => {
            const IconComponent = ICON_MAP[item.icon] || Package;
            return (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white">{item.title}</h4>
                  <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Lo más reciente - Recent/New Products */}
      <section className="py-8 md:py-12 bg-white dark:bg-zinc-950">
        <div className="w-full px-4 lg:px-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 lg:mb-8 gap-4">
            <div className="space-y-2">
              <span className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">Recién llegado</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic leading-none">Lo más <br /> <span className="text-primary">Reciente</span></h2>
            </div>
            <button 
              onClick={() => navigate('/products')}
              className="group flex items-center gap-3 text-zinc-900 dark:text-white font-black uppercase tracking-[0.2em] text-[10px] md:text-xs"
            >
              Ver todo lo nuevo
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-lg">
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {randomProducts.slice(0, 6).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Banners */}
      <section className="py-12 px-4 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {homeBanners.map((banner: any, index: number) => (
            <motion.div 
              key={banner.id}
              whileHover={{ scale: 1.02 }}
              className="relative h-[400px] md:h-[500px] rounded-3xl md:rounded-[4rem] overflow-hidden group cursor-pointer"
            >
              <img 
                src={banner.image} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                alt={banner.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 md:bottom-12 md:left-12 md:right-12 space-y-4">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
                  {banner.badgeIcon === 'Flame' ? <Flame className="w-4 h-4 text-white" /> : <Star className="w-4 h-4 text-white" />}
                  <span className="text-white text-xs md:text-[10px] font-black uppercase tracking-widest">{banner.badge}</span>
                </div>
                <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-none">{banner.title}</h3>
                <p className="text-white/60 font-medium text-sm md:text-lg">{banner.subtitle}</p>
                <button
                  onClick={() => navigate(banner.link)}
                  className={index === 0 ? "bg-white text-zinc-900 px-6 md:px-8 py-3 md:py-4 rounded-2xl text-xs md:text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2" : "bg-primary text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl text-xs md:text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-zinc-950 transition-all"}
                >
                  {banner.buttonText} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Brand Marquee */}
      <section className="py-12 md:py-20 border-y border-zinc-100 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-950">
        <div className="flex whitespace-nowrap animate-marquee">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex items-center gap-12 mx-12">
              <span className="text-4xl lg:text-6xl font-black text-zinc-200 dark:text-zinc-800 uppercase tracking-tighter italic hover:text-primary transition-colors cursor-default">{storeName}</span>
              <div className="w-3 h-3 rounded-full bg-primary" />
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={`dup-${i}`} className="flex items-center gap-12 mx-12">
              <span className="text-4xl lg:text-6xl font-black text-zinc-200 dark:text-zinc-800 uppercase tracking-tighter italic hover:text-primary transition-colors cursor-default">{storeName}</span>
              <div className="w-3 h-3 rounded-full bg-primary" />
            </div>
          ))}
        </div>
      </section>

      {/* Bento Grid Collections */}
      <section className="py-12 md:py-20 px-4 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 lg:mb-12 gap-4">
          <div className="space-y-2">
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">Curaduría</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic leading-none">
              {localStorage.getItem('collectionsTitle') || 'Colecciones'} <br /> <span className="text-primary">Maestras</span>
            </h2>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-sm text-sm md:text-base">{localStorage.getItem('collectionsSubtitle') || 'Explora los estilos que están definiendo la escena global este año.'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-6 h-auto lg:h-[600px] xl:h-[700px]">
          {homeCollections.map((collection: any, index: number) => {
            const isFeatured = collection.isFeatured;
            const isLarge = isFeatured;
            
            return (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => navigate(collection.link)}
                className={`relative rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl ${
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
                  {isFeatured && (
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
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="py-8 md:py-12 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="w-full px-4 lg:px-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 lg:mb-8 gap-4">
            <div className="space-y-2">
              <span className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">Lo más buscado</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic leading-none">Piezas <br /> <span className="text-primary">Icónicas</span></h2>
            </div>
            <button 
              onClick={() => navigate('/categories')}
              className="group flex items-center gap-3 text-zinc-900 dark:text-white font-black uppercase tracking-[0.2em] text-[10px] md:text-xs"
            >
              Ver toda la colección
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-lg">
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Products by Category Section */}
      {[
        { id: 'calzado', name: 'Calzado', emoji: '👟' },
        { id: 'accesorios', name: 'Accesorios', emoji: '⌚' },
        { id: 'hombres', name: 'Hombres', emoji: '👔' },
        { id: 'mujeres', name: 'Mujeres', emoji: '👗' }
      ].map((category) => {
        const categoryProducts = featuredProducts.filter(p => 
          p.category.toLowerCase() === category.id.toLowerCase()
        ).slice(0, 4);
        
        if (categoryProducts.length === 0) return null;
        
        return (
          <section key={category.id} className="py-8 md:py-12 bg-zinc-50 dark:bg-zinc-900/50">
            <div className="w-full px-4 lg:px-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 lg:mb-8 gap-4">
                <div className="space-y-2">
                  <span className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">{category.emoji} {category.name}</span>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic leading-none">
                    {category.name} <span className="text-primary">Destacados</span>
                  </h2>
                </div>
                <button 
                  onClick={() => navigate('/categories')}
                  className="group flex items-center gap-3 text-zinc-900 dark:text-white font-black uppercase tracking-[0.2em] text-[10px] md:text-xs"
                >
                  Ver todo en {category.name}
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-lg">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                {categoryProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Testimonials Section */}
      <section className="py-12 md:py-20 px-4 lg:px-8 w-full overflow-hidden">
        <div className="text-center space-y-4 mb-10 lg:mb-16">
          <span className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">{getTestimonialsSubtitle()}</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic leading-none">{getTestimonialsTitle()}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {getTestimonials().map((t: any, i: number) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-zinc-50 dark:bg-zinc-900 p-6 md:p-8 lg:p-10 rounded-2xl md:rounded-3xl border border-zinc-100 dark:border-zinc-800 relative group"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/10 group-hover:text-primary/20 transition-colors" />
              <div className="space-y-4 lg:space-y-6 relative z-10">
                <div className="flex gap-1">
                  {[...Array(t.rating)].map((_: any, i: number) => (
                    <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-zinc-600 dark:text-zinc-300 font-medium text-lg leading-relaxed italic">"{t.content}"</p>
                <div className="flex items-center gap-5 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                  <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-primary/20" />
                  <div>
                    <h4 className="text-zinc-900 dark:text-white font-black uppercase tracking-tighter italic">{t.name}</h4>
                    <p className="text-primary text-[10px] font-black uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {quickViewProduct && (
          <QuickView 
            product={quickViewProduct} 
            onClose={() => setQuickViewProduct(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};
