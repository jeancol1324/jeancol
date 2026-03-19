import React, { useState } from 'react';
import { 
  ShoppingBag, 
  ArrowRight, 
  Star, 
  Zap, 
  Flame, 
  Sparkles, 
  TrendingUp, 
  Eye,
  Quote,
  Instagram,
  Twitter,
  Facebook,
  Truck,
  ShieldCheck,
  RotateCcw,
  Award,
  Gift,
  Camera,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { cn } from '../lib/utils';
import { QuickView } from '../components/QuickView';
import { Footer } from '../components/Footer';
import { Helmet } from 'react-helmet-async';
import { MarqueeText, TiltCard } from '../components/Animations';
import { CountdownBadge } from '../components/CountdownTimer';

const CartIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 60 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M52.5 9.16667H45.8333M52.5 9.16667V47.5C52.5 48.8818 51.6318 50 50.25 50H41.5M52.5 9.16667L46.5833 2.5H13.4167M13.4167 2.5L5.83333 18.3333V47.5C5.83333 48.8818 6.7012 50 8.08333 50H41.5M13.4167 2.5H46.5833M41.5 50C43.433 46.2278 44.5 41.6189 44.5 36.6667C44.5 31.7144 43.433 27.1056 41.5 23.3333C39.567 27.1056 38.5 31.7144 38.5 36.6667C38.5 41.6189 39.567 46.2278 41.5 50ZM19.5 36.6667C19.5 40.2389 17.071 43.1667 14.125 43.1667C11.179 43.1667 8.75 40.2389 8.75 36.6667C8.75 33.0944 11.179 30.1667 14.125 30.1667C17.071 30.1667 19.5 33.0944 19.5 36.6667ZM50.25 43.1667C52.196 40.2389 53.25 36.4744 53.25 32.5C53.25 28.5256 52.196 24.7611 50.25 21.8333C48.304 24.7611 47.25 28.5256 47.25 32.5C47.25 36.4744 48.304 40.2389 50.25 43.1667Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

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

const trendingCategories = [
  { name: 'Streetwear', icon: Zap, count: '45 Artículos' },
  { name: 'Minimalist', icon: Sparkles, count: '32 Artículos' },
  { name: 'Sartorial', icon: Flame, count: '28 Artículos' },
  { name: 'Athleisure', icon: TrendingUp, count: '54 Artículos' }
];

const brands = [
  'VOGUE', 'GQ', 'HYPEBEAST', 'HIGHSNOBIETY', 'COMPLEX', 'WWD', 'DAZED', 'I-D'
];

export const HomeScreen = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      selectedSize: 'M',
      quantity: 1
    });
    showToast(`¡${product.name} añadido a tu bolsa!`, 'success');
  };

  const handleQuickView = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

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
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80" 
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
              Nueva Colección 2024
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
            <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-wider">+1,200 personas comprando ahora</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white uppercase tracking-tighter italic leading-[0.9] drop-shadow-2xl"
          >
            Define tu <br /> <span className="text-primary">Legado</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-white/70 md:text-white/80 text-sm md:text-base lg:text-lg max-w-xl mx-auto font-medium leading-relaxed"
          >
            Piezas maestras diseñadas para quienes no solo siguen tendencias, sino que las crean.
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
              Explorar Colección
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

      {/* Trust & Loyalty Bar */}
      <section className="bg-zinc-50 dark:bg-zinc-900/30 py-12 border-b border-zinc-100 dark:border-zinc-800">
        <div className="w-full px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Truck, title: "Envío Express", desc: "Gratis en pedidos +$150" },
            { icon: ShieldCheck, title: "Pago Seguro", desc: "Encriptación SSL 256-bit" },
            { icon: RotateCcw, title: "Devolución Fácil", desc: "30 días de garantía" },
            { icon: Award, title: "VIBE Points", desc: "Gana 5% en cada compra" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white">{item.title}</h4>
                <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Banners */}
      <section className="py-12 px-4 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative h-[400px] md:h-[500px] rounded-3xl md:rounded-[4rem] overflow-hidden group cursor-pointer"
          >
            <img 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              alt="Summer Sale"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 md:bottom-12 md:left-12 md:right-12 space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary px-4 py-1.5 rounded-full">
                <Flame className="w-4 h-4 text-white" />
                <span className="text-white text-xs md:text-[10px] font-black uppercase tracking-widest">Oferta Flash</span>
              </div>
              <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-none">Summer <br /> <span className="text-primary">Vibes</span></h3>
              <p className="text-white/60 font-medium text-sm md:text-lg">Hasta 50% de descuento en piezas seleccionadas.</p>
              <button
                onClick={() => navigate('/offers')}
                className="bg-white text-zinc-900 px-6 md:px-8 py-3 md:py-4 rounded-2xl text-xs md:text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2"
              >
                Ver Ofertas <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative h-[400px] md:h-[500px] rounded-3xl md:rounded-[4rem] overflow-hidden group cursor-pointer bg-zinc-900"
          >
            <div className="absolute inset-0 opacity-40">
              <img 
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                alt="New Arrivals"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 md:bottom-12 md:left-12 md:right-12 space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-white text-xs md:text-[10px] font-black uppercase tracking-widest">Novedades</span>
              </div>
              <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-none">The <br /> <span className="text-primary">Edit</span></h3>
              <p className="text-white/60 font-medium text-sm md:text-lg">Nuevas piezas añadidas diariamente. No te lo pierdas.</p>
              <button onClick={() => navigate('/categories')} className="bg-primary text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl text-xs md:text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-zinc-950 transition-all">
                Descubrir Más
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Brand Marquee */}
      <section className="py-12 md:py-20 border-y border-zinc-100 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-950">
        <div className="flex whitespace-nowrap animate-marquee">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex items-center gap-12 mx-12">
              <span className="text-4xl lg:text-6xl font-black text-zinc-200 dark:text-zinc-800 uppercase tracking-tighter italic hover:text-primary transition-colors cursor-default">BRAND {i}</span>
              <div className="w-3 h-3 rounded-full bg-primary" />
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={`dup-${i}`} className="flex items-center gap-12 mx-12">
              <span className="text-4xl lg:text-6xl font-black text-zinc-200 dark:text-zinc-800 uppercase tracking-tighter italic hover:text-primary transition-colors cursor-default">BRAND {i}</span>
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
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic leading-none">Colecciones <br /> <span className="text-primary">Maestras</span></h2>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-sm text-sm md:text-base">Explora los estilos que están definiendo la escena global este año.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-6 h-auto lg:h-[600px] xl:h-[700px]">
          {/* Large Main Bento Item */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            onClick={() => navigate('/categories')}
            className="lg:col-span-2 lg:row-span-2 relative rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              alt="Urban Core"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent" />
            <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 right-6 md:right-10 space-y-3">
              <span className="bg-primary text-white px-3 md:px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Destacado</span>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter italic leading-none">Urban Core</h3>
              <p className="text-white/60 font-medium text-sm md:text-base max-w-md">La esencia de la calle elevada al lujo absoluto.</p>
              <div className="flex items-center gap-3 text-primary text-xs font-black uppercase tracking-widest pt-2 group-hover:translate-x-2 transition-transform">
                Explorar Colección <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>

          {/* Medium Bento Item */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            onClick={() => navigate('/categories')}
            className="lg:col-span-2 lg:row-span-1 relative rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              alt="Minimalist"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 right-6 md:right-8">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter italic leading-none">Minimalist</h3>
              <p className="text-white/60 font-medium text-sm mt-2">Menos es más, siempre.</p>
            </div>
          </motion.div>

          {/* Small Bento Item 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            onClick={() => navigate('/categories')}
            className="lg:col-span-1 lg:row-span-1 relative rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1594932224440-746932266e62?auto=format&fit=crop&w=800&q=80" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              alt="Sartorial"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6">
              <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter italic leading-none">Sartorial</h3>
            </div>
          </motion.div>

          {/* Small Bento Item 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            onClick={() => navigate('/categories')}
            className="lg:col-span-1 lg:row-span-1 relative rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              alt="Essentials"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6">
              <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter italic leading-none">Essentials</h3>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Virtual Try-On Teaser */}
      <section className="py-12 md:py-20 px-4 lg:px-8 w-full">
        <div className="relative rounded-3xl md:rounded-[5rem] bg-zinc-900 dark:bg-zinc-800 p-8 md:p-16 lg:p-24 overflow-hidden group">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#FF6321_0%,transparent_70%)]" />
          </div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
            <div className="flex-1 space-y-6 lg:space-y-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-3 bg-primary/20 backdrop-blur-md px-4 py-2 rounded-full border border-primary/30">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-primary text-[10px] font-black uppercase tracking-widest">Tecnología AI</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter italic leading-none">Probador <br /> <span className="text-primary">Virtual</span></h2>
              <p className="text-zinc-400 font-medium text-base md:text-lg lg:text-xl leading-relaxed max-w-xl">¿No estás seguro de cómo te quedará? Usa nuestra IA avanzada para probarte cualquier prenda en tiempo real desde tu cámara.</p>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                    <Camera className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-white text-sm font-black uppercase tracking-tighter italic">Escaneo 3D</h4>
                  <p className="text-zinc-500 text-xs">Mapeo preciso de tu cuerpo.</p>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-white text-sm font-black uppercase tracking-tighter italic">Tiempo Real</h4>
                  <p className="text-zinc-500 text-xs">Visualiza el movimiento.</p>
                </div>
              </div>

              <button className="w-full lg:w-auto px-8 md:px-12 py-4 md:py-5 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-zinc-900 transition-all">
                Iniciar Probador
              </button>
            </div>

            <div className="flex-1 w-full lg:w-auto">
              <div className="relative rounded-2xl md:rounded-[3rem] overflow-hidden border-4 md:border-8 border-white/5 shadow-2xl aspect-[4/5] max-w-sm mx-auto">
                <img 
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80" 
                  className="w-full h-full object-cover grayscale brightness-50" 
                  alt="Virtual Try-On Preview"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-primary/20 backdrop-blur-xl border border-primary/30 flex items-center justify-center">
                    <Camera className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
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
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div 
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="relative aspect-[3/4] rounded-xl md:rounded-2xl overflow-hidden bg-white dark:bg-zinc-800 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                >
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.offerPrice && (
                      <span className="bg-primary text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider">
                        -{Math.round(((product.price - product.offerPrice) / product.price) * 100)}%
                      </span>
                    )}
                    {product.isNew && !product.offerPrice && (
                      <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider">
                        Nuevo
                      </span>
                    )}
                    {product.isTrending && !product.offerPrice && (
                      <span className="bg-primary text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider">
                        Trending
                      </span>
                    )}
                    {product.stock <= 5 && (
                      <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider">
                        Solo {product.stock}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button - Cart Icon */}
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { 
                      e.stopPropagation();
                      const price = product.offerPrice || product.price;
                      addItem({ ...product, price, selectedSize: 'M', quantity: 1 });
                      showToast(`${product.name} añadido al carrito`, 'success');
                    }}
                    className="absolute top-2 right-2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-md text-primary"
                  >
                    <CartIcon className="w-4 h-4 md:w-5 md:h-5" />
                  </motion.button>

                  {/* Countdown Badge */}
                  {product.offerEndDate && (
                    <div className="absolute bottom-2 left-2 right-2">
                      <CountdownBadge endDate={product.offerEndDate} />
                    </div>
                  )}
                </div>

                <div className="mt-2 md:mt-3 space-y-1">
                  <span className="text-primary text-[8px] md:text-[9px] font-black uppercase tracking-wider">{product.category}</span>
                  <h3 className="text-xs md:text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight truncate">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {product.offerPrice ? (
                        <>
                          <span className="text-sm md:text-base font-black text-primary">${product.offerPrice.toFixed(2)}</span>
                          <span className="text-[10px] md:text-xs text-zinc-400 line-through">${product.price.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="text-sm md:text-base font-black text-zinc-900 dark:text-white">${product.price.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3 h-3 fill-amber-500" />
                      <span className="text-[10px] font-black">{product.rating}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Loyalty Program Teaser */}
      <section className="py-12 md:py-20 px-4 lg:px-8 w-full">
        <div className="relative rounded-3xl md:rounded-[4rem] bg-primary p-8 md:p-12 lg:p-16 overflow-hidden group">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
            <Award className="w-[400px] h-[400px] -rotate-12 translate-x-1/4 -translate-y-1/4" />
          </div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            <div className="space-y-4 lg:space-y-6 text-center lg:text-left max-w-xl">
              <div className="space-y-2">
                <span className="text-white text-[10px] font-black uppercase tracking-[0.5em]">Programa de Fidelidad</span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white uppercase tracking-tighter italic leading-none">VIBE <br /> <span className="text-zinc-900">REWARDS</span></h2>
              </div>
              <p className="text-white/80 font-medium text-sm md:text-base lg:text-lg leading-relaxed">Convierte tus compras en experiencias. Gana puntos, desbloquea niveles y accede a beneficios exclusivos.</p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                <div className="bg-white/20 backdrop-blur-md px-4 md:px-6 py-2 md:py-3 rounded-xl border border-white/30 flex items-center gap-3">
                  <Gift className="w-4 h-4 text-white" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Regalos</span>
                </div>
                <div className="bg-white/20 backdrop-blur-md px-4 md:px-6 py-2 md:py-3 rounded-xl border border-white/30 flex items-center gap-3">
                  <Zap className="w-4 h-4 text-white" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Acceso Anticipado</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[4rem] p-12 shadow-2xl text-zinc-900 space-y-8 min-w-[350px]">
              <div className="text-center space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Tu Estado Actual</p>
                <h3 className="text-4xl font-black uppercase tracking-tighter italic">Nivel Bronce</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span>0 Puntos</span>
                  <span>500 Puntos para Plata</span>
                </div>
                <div className="h-3 bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[15%]" />
                </div>
              </div>
              <button className="w-full py-6 bg-zinc-900 text-white rounded-3xl text-xs font-black uppercase tracking-[0.3em] hover:bg-primary transition-all">
                Unirse al Club
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-20 px-4 lg:px-8 w-full overflow-hidden">
        <div className="text-center space-y-4 mb-10 lg:mb-16">
          <span className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">Comunidad</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic leading-none">Voces de <br /> <span className="text-primary">Excelencia</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((t, i) => (
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
                  {[...Array(t.rating)].map((_, i) => (
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

      {/* Social Feed Section */}
      <section className="py-32 bg-zinc-900 dark:bg-zinc-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-6 gap-4 transform -rotate-12 scale-150">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-square bg-white/20 rounded-3xl" />
            ))}
          </div>
        </div>
        
        <div className="w-full px-4 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
            <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
              <div className="space-y-2">
                <span className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">Síguenos</span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black uppercase tracking-tighter italic leading-none">Únete a la <br /> <span className="text-primary">Revolución</span></h2>
              </div>
              <p className="text-zinc-400 text-sm md:text-base lg:text-lg max-w-md font-medium">Comparte tu estilo usando <span className="text-white font-black">#LEGADO2024</span> y forma parte de nuestra galería exclusiva.</p>
              <div className="flex items-center justify-center lg:justify-start gap-4 md:gap-6">
                <button className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all group">
                  <Instagram className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
                </button>
                <button className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all group">
                  <Twitter className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
                </button>
                <button className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all group">
                  <Facebook className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4 w-full lg:w-1/2">
              <div className="space-y-3 md:space-y-4 pt-6 md:pt-8">
                <div className="aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden bg-white/5 border border-white/10 group">
                  <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="social" />
                </div>
                <div className="aspect-square rounded-2xl md:rounded-3xl overflow-hidden bg-white/5 border border-white/10 group">
                  <img src="https://images.unsplash.com/photo-1529139513477-3235a8ad4df4?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="social" />
                </div>
              </div>
              <div className="space-y-3 md:space-y-4">
                <div className="aspect-square rounded-2xl md:rounded-3xl overflow-hidden bg-white/5 border border-white/10 group">
                  <img src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="social" />
                </div>
                <div className="aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden bg-white/5 border border-white/10 group">
                  <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="social" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 md:py-20 px-4 lg:px-8 w-full overflow-hidden">
        <div className="relative rounded-3xl md:rounded-[4rem] bg-zinc-900 dark:bg-zinc-800 p-8 md:p-12 lg:p-16 xl:p-20 overflow-hidden group">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[600px] md:h-[600px] bg-primary rounded-full blur-[100px] md:blur-[150px] animate-pulse-soft" />
          </div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
            <div className="space-y-4 lg:space-y-6 text-center lg:text-left max-w-xl">
              <div className="space-y-2">
                <span className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">Acceso Exclusivo</span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white uppercase tracking-tighter italic leading-none">VIBE <br /> <span className="text-primary">INSIDER</span></h2>
              </div>
              <p className="text-zinc-400 font-medium text-sm md:text-base lg:text-lg leading-relaxed">Únete a nuestra comunidad selecta y recibe acceso anticipado a colecciones, eventos privados y ofertas exclusivas.</p>
            </div>

            <div className="w-full lg:w-auto min-w-[300px] md:min-w-[350px] lg:min-w-[400px]">
              <form className="space-y-4 md:space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="relative group/input">
                  <input 
                    type="email" 
                    placeholder="TU EMAIL" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl px-6 md:px-8 lg:px-10 py-4 md:py-5 lg:py-6 text-white font-black uppercase tracking-widest placeholder:text-zinc-600 focus:outline-none focus:border-primary transition-all text-sm md:text-base"
                  />
                  <div className="absolute inset-0 rounded-2xl md:rounded-3xl bg-primary/5 opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none" />
                </div>
                <button className="w-full py-4 md:py-5 lg:py-6 bg-primary text-white rounded-2xl md:rounded-3xl text-xs md:text-sm font-black uppercase tracking-[0.3em] hover:bg-white hover:text-zinc-900 transition-all duration-500 shadow-2xl shadow-primary/20">
                  Suscribirse Ahora
                </button>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest text-center">Al suscribirte, aceptas nuestra política de privacidad.</p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />

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
