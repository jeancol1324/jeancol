import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Ruler, 
  CheckCircle2,
  Plus,
  Minus,
  X,
  Flame,
  Users,
  TrendingUp,
  Zap,
  ArrowRight,
  Sparkles,
  Heart,
  Share2,
  Maximize2,
  Info,
  Clock,
  Eye,
  Award,
  Wind
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { cn } from '../lib/utils';

export const ProductDetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
  
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>('description');
  const [viewers, setViewers] = useState(Math.floor(Math.random() * 20) + 15);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [lastPurchased, setLastPurchased] = useState<{ name: string, time: string } | null>(null);
  
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  
  const { addItem } = useCart();
  const { showToast } = useToast();
  
  // Sticky Add to Cart visibility
  const [showStickyBar, setShowStickyBar] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 800);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(prev => {
        const change = Math.floor(Math.random() * 3) - 1;
        return Math.max(10, prev + change);
      });
    }, 5000);

    // Simulate "Last purchased" notification
    const purchaseInterval = setInterval(() => {
      const names = ['Mateo', 'Sofía', 'Alejandro', 'Valentina', 'Nicolás'];
      const times = ['hace 5 min', 'hace 12 min', 'hace 2 min', 'hace 20 min'];
      setLastPurchased({
        name: names[Math.floor(Math.random() * names.length)],
        time: times[Math.floor(Math.random() * times.length)]
      });
      setTimeout(() => setLastPurchased(null), 5000);
    }, 15000);

    return () => {
      clearInterval(interval);
      clearInterval(purchaseInterval);
    };
  }, []);

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  const sizes = product.sizes && product.sizes.length > 0 
    ? product.sizes 
    : ['38', '39', '40', '41', '42', '43', '44'];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      showToast('Por favor selecciona una talla', 'error');
      return;
    }
    addItem(product, selectedSize, quantity);
    showToast(`${product.name} añadido al carrito`, 'success');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.comment.trim()) {
      showToast('Por favor escribe un comentario', 'error');
      return;
    }
    showToast('¡Gracias por tu reseña!', 'success');
    setShowReviewModal(false);
    setNewReview({ rating: 5, comment: '' });
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

  const relatedProducts = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-500 pb-20 selection:bg-primary selection:text-white">
      {/* Immersive Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse-soft" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse-soft" style={{ animationDelay: '2s' }} />
      </div>

      {/* Breadcrumbs & Actions */}
      <nav className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
          <button onClick={() => navigate('/')} className="hover:text-primary transition-colors">Inicio</button>
          <span className="text-zinc-200 dark:text-zinc-800">/</span>
          <span className="hover:text-primary transition-colors cursor-pointer">{product.category}</span>
          <span className="text-zinc-200 dark:text-zinc-800">/</span>
          <span className="text-zinc-900 dark:text-white">{product.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-primary transition-all border border-zinc-100 dark:border-zinc-800"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all border",
              isFavorite 
                ? "bg-primary/10 border-primary text-primary" 
                : "bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:text-primary"
            )}
          >
            <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Left: Image Gallery */}
        <div className="space-y-8">
          <div 
            className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-zinc-100 dark:bg-zinc-900 cursor-zoom-in group shadow-2xl shadow-black/5"
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
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
            
            {/* Navigation Arrows */}
            <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
              <button 
                onClick={(e) => { e.stopPropagation(); setActiveImage(prev => (prev === 0 ? images.length - 1 : prev - 1)); }}
                className="pointer-events-auto w-14 h-14 rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur-xl flex items-center justify-center text-zinc-900 dark:text-white shadow-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-white -translate-x-4 group-hover:translate-x-0"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setActiveImage(prev => (prev === images.length - 1 ? 0 : prev + 1)); }}
                className="pointer-events-auto w-14 h-14 rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur-xl flex items-center justify-center text-zinc-900 dark:text-white shadow-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-white translate-x-4 group-hover:translate-x-0"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Badges */}
            <div className="absolute top-10 left-10 flex flex-col gap-4">
              {product.discount && (
                <motion.span 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="bg-primary text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 flex items-center gap-2"
                >
                  <Zap className="w-3 h-3 fill-current" />
                  {product.discount} OFF
                </motion.span>
              )}
              <motion.span 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-zinc-900/90 dark:bg-zinc-800/90 backdrop-blur-xl text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.2em] shadow-2xl flex items-center gap-2"
              >
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                Trending Now
              </motion.span>
            </div>

            {/* Fullscreen Toggle */}
            <button 
              onClick={() => setShowFullscreen(true)}
              className="absolute top-10 right-10 w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-primary"
            >
              <Maximize2 className="w-5 h-5" />
            </button>

            {/* Social Proof Overlay */}
            <div className="absolute bottom-10 left-10 right-10">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden bg-zinc-800">
                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                      <Users className="w-3 h-3 text-primary" />
                      {viewers} Viendo ahora
                    </span>
                    <span className="text-[10px] text-white/60 font-medium">Alta demanda en las últimas 24h</span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/10">
                  <Flame className="w-4 h-4 text-primary animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Pocas Unidades</span>
                </div>
              </div>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4 px-2">
            {images.map((img, i) => (
              <button 
                key={i}
                onClick={() => setActiveImage(i)}
                className={cn(
                  "w-28 h-28 rounded-3xl overflow-hidden border-2 transition-all shrink-0 relative group",
                  activeImage === i ? "border-primary scale-105 shadow-2xl shadow-primary/20" : "border-transparent opacity-40 hover:opacity-100"
                )}
              >
                <img src={img} alt={`Thumb ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                {activeImage === i && (
                  <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="lg:sticky lg:top-32 h-fit space-y-12">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">{product.category}</span>
                <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <span className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">SKU: {product.id}0024</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 rounded-full border border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className={cn("w-3 h-3", i <= 4 ? "fill-amber-400 text-amber-400" : "text-zinc-200 dark:text-zinc-800")} />)}
                </div>
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">4.8 (128 Reseñas)</span>
              </div>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter leading-[0.9] italic">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-6">
              <span className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">${product.price.toFixed(2)}</span>
              {product.oldPrice && (
                <div className="flex flex-col">
                  <span className="text-xl text-zinc-400 line-through font-bold tracking-tighter">${product.oldPrice.toFixed(2)}</span>
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                    <ArrowRight className="w-3 h-3 rotate-[-45deg]" />
                    Ahorras ${(product.oldPrice - product.price).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed text-xl max-w-xl">
              {product.description || "Una obra maestra de diseño y funcionalidad. Creada para aquellos que no aceptan compromisos entre estilo y comodidad. Edición limitada."}
            </p>
            <div className="flex items-center gap-3 text-emerald-500">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-widest">En Stock - Listo para enviar</span>
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h4 className="text-zinc-900 dark:text-white font-black uppercase tracking-[0.2em] text-xs">Seleccionar Talla</h4>
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              </div>
              <button 
                onClick={() => setShowSizeGuide(true)}
                className="text-zinc-400 hover:text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors group"
              >
                <Ruler className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Guía de Tallas
              </button>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-4">
              {sizes.map(size => (
                <button 
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "h-14 rounded-2xl border-2 font-black text-sm transition-all flex items-center justify-center relative overflow-hidden group",
                    selectedSize === size 
                      ? "border-primary bg-primary text-white shadow-2xl shadow-primary/30 scale-105" 
                      : "border-zinc-100 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 hover:border-primary hover:text-primary"
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

          {/* Quantity and Actions */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex items-center bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] px-6 py-4 border border-zinc-100 dark:border-zinc-800">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:text-primary hover:bg-white dark:hover:bg-zinc-800 transition-all"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="w-16 text-center font-black text-2xl text-zinc-900 dark:text-white tracking-tighter">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)} 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:text-primary hover:bg-white dark:hover:bg-zinc-800 transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <button 
              id="add-to-cart-btn"
              onClick={handleAddToCart}
              className="flex-1 bg-primary text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12" />
              <ShoppingBag className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              AÑADIR AL CARRITO
              <ArrowRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12 border-t border-zinc-100 dark:border-zinc-800">
            {[
              { icon: Truck, text: 'Envío Express', sub: 'Gratis hoy' },
              { icon: RotateCcw, text: '30 Días', sub: 'Devolución fácil' },
              { icon: ShieldCheck, text: 'Pago Seguro', sub: 'SSL Encriptado' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white">{item.text}</span>
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{item.sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Dynamic Notifications */}
          <AnimatePresence>
            {lastPurchased && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-zinc-900 dark:bg-zinc-800 text-white p-4 rounded-2xl flex items-center gap-4 shadow-2xl"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest">{lastPurchased.name} acaba de comprar esto</span>
                  <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">{lastPurchased.time}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Tabs Section */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 mt-40">
        <div className="flex gap-12 border-b border-zinc-100 dark:border-zinc-800 mb-16 overflow-x-auto no-scrollbar">
          {[
            { id: 'description', label: 'Descripción Detallada' },
            { id: 'reviews', label: `Reseñas de Clientes (${product.reviewsCount || 0})` },
            { id: 'shipping', label: 'Envíos y Garantía' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "pb-8 text-xs font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap",
                activeTab === tab.id ? "text-primary" : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(255,99,33,0.5)]" />
              )}
            </button>
          ))}
        </div>

        <div className="min-h-[400px]">
          {activeTab === 'description' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="space-y-10">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">Calidad Premium</span>
                </div>
                <h3 className="text-4xl lg:text-6xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic leading-none">Ingeniería <br /> de Precisión</h3>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed text-xl">
                  Cada par de {product.name} es el resultado de un proceso meticuloso que combina la artesanía tradicional con la tecnología de vanguardia. Diseñadas para durar y destacar.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { label: 'Suela antideslizante PRO', icon: Award },
                    { label: 'Plantilla de memoria', icon: Sparkles },
                    { label: 'Malla ultra-transpirable', icon: Wind },
                    { label: 'Refuerzos de carbono', icon: ShieldCheck }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 group hover:border-primary transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        {item.icon ? <item.icon className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <span className="text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-widest">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative rounded-[3rem] overflow-hidden aspect-video shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Detail" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-10">
                    <div className="space-y-2">
                      <span className="text-primary text-[10px] font-black uppercase tracking-widest">Vista de Detalle</span>
                      <h4 className="text-white text-2xl font-black uppercase tracking-tighter italic">Materiales de Grado Aeroespacial</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex flex-col lg:flex-row gap-16 items-start">
                <div className="bg-zinc-50 dark:bg-zinc-900 p-12 rounded-[3rem] w-full lg:w-96 text-center border border-zinc-100 dark:border-zinc-800 shadow-xl">
                  <span className="text-8xl font-black text-zinc-900 dark:text-white tracking-tighter italic">4.8</span>
                  <div className="flex justify-center gap-2 my-6">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className={cn("w-6 h-6", i <= 4 ? "fill-amber-400 text-amber-400" : "text-zinc-200 dark:text-zinc-800")} />)}
                  </div>
                  <p className="text-zinc-400 font-black uppercase tracking-[0.2em] text-[10px] mb-10">Basado en {product.reviewsCount || 0} experiencias reales</p>
                  <button 
                    onClick={() => setShowReviewModal(true)}
                    className="w-full bg-zinc-900 dark:bg-zinc-800 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 group"
                  >
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    Escribir Reseña
                  </button>
                </div>

                <div className="flex-1 space-y-12">
                  {(product.reviews || []).map((review) => (
                    <div key={review.id} className="pb-12 border-b border-zinc-100 dark:border-zinc-800 last:border-0 group">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-black text-zinc-900 dark:text-white text-xl shadow-inner">
                            {review.avatar || review.userName.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h5 className="font-black text-zinc-900 dark:text-white uppercase tracking-[0.2em] text-sm mb-1">{review.userName}</h5>
                            <div className="flex items-center gap-3">
                              <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">{review.date}</span>
                              <div className="w-1 h-1 rounded-full bg-zinc-300" />
                              <span className="text-emerald-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Compra Verificada
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-100 dark:border-zinc-800">
                          {[1, 2, 3, 4, 5].map(j => (
                            <Star key={j} className={cn("w-3 h-3", j <= review.rating ? "fill-amber-400 text-amber-400" : "text-zinc-200 dark:text-zinc-700")} />
                          ))}
                        </div>
                      </div>
                      <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed text-lg italic mb-8 pl-4 border-l-4 border-primary/20">
                        "{review.comment}"
                      </p>
                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-4 pl-4">
                          {review.images.map((img, idx) => (
                            <div key={idx} className="relative group/img cursor-zoom-in">
                              <img src={img} className="w-24 h-24 rounded-2xl object-cover shadow-lg transition-transform group-hover/img:scale-105" alt="Review" referrerPolicy="no-referrer" />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity rounded-2xl" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {(!product.reviews || product.reviews.length === 0) && (
                    <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900 rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                      <p className="text-zinc-400 font-medium italic">No hay reseñas todavía. ¡Sé el primero en calificar este producto!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
              {[
                { 
                  icon: Truck, 
                  title: 'Envío Express', 
                  desc: 'Entrega gratuita en 24-48h para pedidos superiores a $100. Seguimiento en tiempo real incluido.' 
                },
                { 
                  icon: RotateCcw, 
                  title: 'Devolución VIP', 
                  desc: '30 días de prueba sin compromiso. Recogida a domicilio gratuita si no estás satisfecho.' 
                },
                { 
                  icon: ShieldCheck, 
                  title: 'Garantía Total', 
                  desc: 'Protección de 12 meses contra cualquier defecto. Sustitución inmediata por un producto nuevo.' 
                }
              ].map((item, i) => (
                <div key={i} className="p-10 rounded-[3rem] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:shadow-2xl hover:shadow-primary/5 transition-all group">
                  <div className="w-20 h-20 rounded-[2rem] bg-white dark:bg-zinc-800 flex items-center justify-center text-primary mb-8 shadow-xl group-hover:scale-110 transition-transform">
                    <item.icon className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic mb-4">{item.title}</h4>
                  <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 lg:px-8 mt-48">
          <div className="flex items-end justify-between mb-16">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-[2px] bg-primary" />
                <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">Sugerencias</span>
              </div>
              <h2 className="text-5xl lg:text-7xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic leading-none">Completa <br /> tu Look</h2>
            </div>
            <button 
              onClick={() => navigate('/')} 
              className="hidden sm:flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:text-primary transition-all group"
            >
              Ver Colección Completa
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map(p => (
              <motion.div 
                key={p.id}
                whileHover={{ y: -15 }}
                onClick={() => { navigate(`/product/${p.id}`); window.scrollTo(0, 0); }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-8 shadow-xl group-hover:shadow-2xl transition-all">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                    <button className="w-full bg-white text-zinc-900 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 shadow-2xl">Ver Detalles</button>
                  </div>
                  {p.discount && (
                    <div className="absolute top-6 left-6 bg-primary text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      {p.discount} OFF
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{p.category}</span>
                  <h3 className="font-black text-zinc-900 dark:text-white uppercase tracking-tighter text-xl italic group-hover:text-primary transition-colors">{p.name}</h3>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-zinc-900 dark:text-white text-lg">${p.price.toFixed(2)}</span>
                    {p.oldPrice && <span className="text-sm text-zinc-400 line-through font-bold">${p.oldPrice.toFixed(2)}</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Sticky Bottom Bar (Mobile) */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 inset-x-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-t border-zinc-100 dark:border-zinc-800 p-4 sm:hidden flex items-center justify-between gap-4"
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{product.name}</span>
              <span className="text-lg font-black text-zinc-900 dark:text-white">${product.price.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleAddToCart}
              className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center gap-3"
            >
              <ShoppingBag className="w-4 h-4" />
              Añadir
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {showFullscreen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full h-full flex items-center justify-center p-4 lg:p-20"
            >
              <button 
                onClick={() => setShowFullscreen(false)}
                className="absolute top-10 right-10 w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all z-50"
              >
                <X className="w-6 h-6" />
              </button>
              
              <img 
                src={images[activeImage]} 
                className="max-w-full max-h-full object-contain rounded-3xl" 
                alt="Fullscreen" 
                referrerPolicy="no-referrer"
              />

              <div className="absolute bottom-10 inset-x-0 flex justify-center gap-4">
                {images.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all",
                      activeImage === i ? "bg-primary w-10" : "bg-white/20 hover:bg-white/40"
                    )}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {showSizeGuide && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSizeGuide(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-[4rem] p-12 lg:p-20 shadow-2xl overflow-hidden border border-white/10"
            >
              <button 
                onClick={() => setShowSizeGuide(false)}
                className="absolute top-10 right-10 w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all hover:rotate-90"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-4 mb-12">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Ruler className="w-8 h-8" />
                </div>
                <h2 className="text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic leading-none">Guía de <br /> <span className="text-primary">Tallas</span></h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-2 border-zinc-100 dark:border-zinc-800">
                      <th className="py-6 font-black uppercase tracking-[0.2em] text-[10px] text-zinc-400">Talla EU</th>
                      <th className="py-6 font-black uppercase tracking-[0.2em] text-[10px] text-zinc-400">Talla US</th>
                      <th className="py-6 font-black uppercase tracking-[0.2em] text-[10px] text-zinc-400">Longitud (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="text-zinc-900 dark:text-white font-bold">
                    {[
                      { eu: '38', us: '6', cm: '24.5' },
                      { eu: '39', us: '7', cm: '25.2' },
                      { eu: '40', us: '7.5', cm: '25.8' },
                      { eu: '41', us: '8.5', cm: '26.5' },
                      { eu: '42', us: '9', cm: '27.2' },
                      { eu: '43', us: '10', cm: '27.8' },
                      { eu: '44', us: '10.5', cm: '28.5' }
                    ].map(row => (
                      <tr key={row.eu} className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                        <td className="py-6 font-black text-lg group-hover:text-primary transition-colors">{row.eu}</td>
                        <td className="py-6 text-zinc-500">{row.us}</td>
                        <td className="py-6 text-zinc-500">{row.cm} cm</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-12 p-6 bg-zinc-50 dark:bg-zinc-800 rounded-3xl border border-zinc-100 dark:border-zinc-700">
                <p className="text-zinc-500 dark:text-zinc-400 text-[11px] font-medium leading-relaxed flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>* Las medidas son aproximadas. Te recomendamos medir tu pie desde el talón hasta la punta del dedo más largo para mayor precisión. Si estás entre dos tallas, elige la más grande.</span>
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Write Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReviewModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[4rem] p-12 lg:p-16 shadow-2xl overflow-hidden border border-white/10"
            >
              <button 
                onClick={() => setShowReviewModal(false)}
                className="absolute top-10 right-10 w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all hover:rotate-90"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic mb-10 leading-none">Tu <br /> <span className="text-primary">Experiencia</span></h2>
              
              <form onSubmit={handleReviewSubmit} className="space-y-10">
                <div className="space-y-6">
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Calificación</label>
                  <div className="flex justify-between bg-zinc-50 dark:bg-zinc-800 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-700">
                    {[1, 2, 3, 4, 5].map(i => (
                      <button 
                        key={i}
                        type="button"
                        onClick={() => setNewReview(prev => ({ ...prev, rating: i }))}
                        className="transition-all hover:scale-125 active:scale-90"
                      >
                        <Star className={cn("w-10 h-10", i <= newReview.rating ? "fill-amber-400 text-amber-400" : "text-zinc-200 dark:text-zinc-700")} />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Tu Comentario</label>
                  <textarea 
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    rows={5}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-primary rounded-[2rem] p-6 text-zinc-900 dark:text-white font-medium outline-none transition-all resize-none shadow-inner"
                    placeholder="¿Qué es lo que más te gustó de tus nuevas zapatillas?"
                  />
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-primary text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group"
                >
                  Publicar Reseña
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
