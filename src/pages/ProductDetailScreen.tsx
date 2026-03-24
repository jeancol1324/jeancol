import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useReviews } from '../context/ReviewContext';
import { ProductCard } from '../components/ProductCard';
import { ReviewsSection } from '../components/ReviewsSection';
import { CustomerReviewModal } from '../components/CustomerReviewModal';

export const ProductDetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const product = products.find(p => p.id === id) || products[0];
  const { getReviewsByProduct } = useReviews();
  
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [scrolled, setScrolled] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  const reviews = getReviewsByProduct(product.id);
  
  const activeVariations = product.variations?.filter(v => v.isActive) || [];
  const variationNames: string[] = Array.from(new Set(activeVariations.map(v => v.name as string)));
  
  const getVariationPrice = () => {
    const matchingVariation = activeVariations.find(v => {
      const nameMatch = v.name in selectedVariations ? v.name : true;
      const valueMatch = selectedVariations[v.name] ? v.value === selectedVariations[v.name] : true;
      return nameMatch && valueMatch && Object.keys(selectedVariations).length > 0;
    });
    return matchingVariation?.price || product.price;
  };
  
  const getVariationStock = () => {
    const matchingVariation = activeVariations.find(v => {
      return Object.entries(selectedVariations).every(([name, value]) => v.name === name && v.value === value);
    });
    return matchingVariation?.stock ?? product.stock ?? 0;
  };
  
  const getValuesForVariation = (varName: string): string[] => {
    return Array.from(new Set(activeVariations.filter(v => v.name === varName).map(v => v.value as string)));
  };
  
  const handleSelectVariation = (name: string, value: string) => {
    setSelectedVariations(prev => ({ ...prev, [name]: value }));
  };
  
  const hasVariations = variationNames.length > 0;
  const currentPrice = hasVariations ? getVariationPrice() : product.price;
  const currentStock = hasVariations ? getVariationStock() : (product.stock || 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { addItem, clearCart } = useCart();
  const { showToast } = useToast();

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  const sizes = product.sizes && product.sizes.length > 0 
    ? product.sizes 
    : ['38', '39', '40', '41', '42', '43', '44'];

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id);

  const formatCOP = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleAddToCart = () => {
    if (hasVariations) {
      if (Object.keys(selectedVariations).length !== variationNames.length) {
        showToast(`Por favor selecciona ${variationNames.length > 1 ? 'todas las opciones' : 'una opción'}`, 'error');
        return;
      }
      if (currentStock === 0) {
        showToast('Este producto está agotado', 'error');
        return;
      }
    } else if (!selectedSize) {
      showToast('Por favor selecciona una talla', 'error');
      return;
    }
    addItem(product, selectedSize || undefined, quantity, hasVariations ? selectedVariations : undefined);
    showToast(`${product.name} añadido al carrito`, 'success');
  };

  const handleBuyNow = () => {
    if (hasVariations) {
      if (Object.keys(selectedVariations).length !== variationNames.length) {
        showToast(`Por favor selecciona ${variationNames.length > 1 ? 'todas las opciones' : 'una opción'}`, 'error');
        return;
      }
      if (currentStock === 0) {
        showToast('Este producto está agotado', 'error');
        return;
      }
    } else if (!selectedSize) {
      showToast('Por favor selecciona una talla', 'error');
      return;
    }
    clearCart();
    addItem(product, selectedSize || undefined, quantity, hasVariations ? selectedVariations : undefined);
    navigate('/checkout');
  };

  const specs = product.features || [];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="sticky top-0 z-50 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800">
        <div className="px-6 py-2">
          {scrolled ? (
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Volver
            </button>
          ) : (
            <>
              <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                <a href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Inicio</a>
                <span>/</span>
                <a href={`/category/${product.category}`} className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">{product.category}</a>
                <span>/</span>
                <span className="text-zinc-900 dark:text-zinc-100">{product.name}</span>
              </div>
              <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Volver
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[36%_63%] min-h-[60vh]">
        <div className="bg-white dark:bg-zinc-900 p-6 lg:border-r lg:border-zinc-200 dark:lg:border-zinc-800">
          <div className="relative bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden mb-4 aspect-square flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src={images[activeImage]}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            <button 
              onClick={() => setActiveImage(prev => (prev === 0 ? images.length - 1 : prev - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shadow-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button 
              onClick={() => setActiveImage(prev => (prev === images.length - 1 ? 0 : prev + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shadow-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
            </button>
            {(product.isNew || product.discount) && (
              <div className="absolute top-3 left-3 flex gap-2">
                {product.isNew && (
                  <span className="bg-primary text-white px-3 py-1.5 rounded-md text-xs font-bold">NUEVO</span>
                )}
                {product.discount && (
                  <span className="bg-red-500 text-white px-3 py-1.5 rounded-md text-xs font-bold">{product.discount}</span>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-20 h-20 rounded-lg flex-shrink-0 p-1 transition-all ${
                  activeImage === i 
                    ? 'border-2 border-primary' 
                    : 'border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover rounded-md" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6">
          <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
            {product.category}
          </div>

          <h1 className="text-2xl lg:text-[26px] font-black mb-2 text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= (product.rating || 4) ? '#FBBF24' : '#e4e4e7'}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              ))}
            </div>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">{product.rating || 4.7}</span>
            <span className="text-sm text-zinc-400 dark:text-zinc-500">({product.reviewsCount || reviews.length} reseñas)</span>
          </div>

          <div className="mb-5 pb-5 border-b border-zinc-200 dark:border-zinc-800">
            <div className="text-3xl lg:text-[32px] font-black text-zinc-900 dark:text-zinc-100">
              {formatCOP(currentPrice)}
            </div>
            {currentPrice < product.price && (
              <div className="flex items-center gap-2.5 mt-1.5">
                <span className="text-base text-zinc-400 dark:text-zinc-500 line-through">
                  {formatCOP(product.price)}
                </span>
                <span className="bg-red-500 text-white px-2.5 py-1 rounded text-xs font-bold">
                  -{Math.round((1 - currentPrice / product.price) * 100)}%
                </span>
              </div>
            )}
            {product.oldPrice && (
              <div className="flex items-center gap-2.5 mt-1.5">
                <span className="text-base text-zinc-400 dark:text-zinc-500 line-through">
                  {formatCOP(product.oldPrice)}
                </span>
                <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded text-xs font-bold">
                  -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                </span>
              </div>
            )}
          </div>

          {hasVariations && (
            <div className="mb-5">
              {variationNames.map(varName => (
                <div key={varName} className="mb-4">
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-2">
                    {varName}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {getValuesForVariation(varName).map(value => {
                      const variationStock = activeVariations.find(v => v.name === varName && v.value === value)?.stock || 0;
                      const isOutOfStock = variationStock === 0;
                      return (
                        <button
                          key={value}
                          onClick={() => handleSelectVariation(varName, value)}
                          disabled={isOutOfStock}
                          className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                            selectedVariations[varName] === value
                              ? 'bg-primary text-white border-2 border-primary'
                              : isOutOfStock
                                ? 'bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 line-through cursor-not-allowed opacity-50'
                                : 'bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-primary dark:hover:border-primary'
                          }`}
                        >
                          {value}
                          {isOutOfStock && <span className="ml-1 text-xs">(Agotado)</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!hasVariations && sizes.length > 0 && (
            <div className="mb-5">
              <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-3">
                Talla
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                      selectedSize === size
                        ? 'bg-primary text-white border-2 border-primary'
                        : 'bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-primary dark:hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-5">
            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-3">
              Cantidad
            </div>
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center border border-zinc-300 dark:border-zinc-700 rounded-lg overflow-hidden">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-lg font-medium"
                >−</button>
                <span className="w-11 text-center font-bold text-sm leading-10 text-zinc-900 dark:text-zinc-100">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-lg font-medium"
                >+</button>
              </div>
              {currentStock === 0 ? (
                <span className="text-sm text-red-500 dark:text-red-400 font-semibold">● Agotado</span>
              ) : currentStock <= 5 ? (
                <span className="text-sm text-amber-500 dark:text-amber-400 font-semibold">● ¡Solo {currentStock} en stock!</span>
              ) : (
                <span className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">● En stock ({currentStock})</span>
              )}
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <button 
              onClick={handleBuyNow}
              className="flex-1 py-3.5 px-5 rounded-lg bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
            >
              Comprar Ahora
            </button>
            <button 
              onClick={handleAddToCart}
              className="flex-1 py-3.5 px-5 rounded-lg border-2 border-primary text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all"
            >
              Añadir al Carrito
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {[
              { icon: '🔒', text: 'Pago Seguro' },
              { icon: '↩️', text: '30 Días' },
              { icon: '🛡️', text: 'Garantía' },
              { icon: '🚚', text: 'Envío' },
            ].map((item, i) => (
              <div key={i} className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3 text-center">
                <span className="text-lg">{item.icon}</span>
                <span className="block text-[10px] text-zinc-600 dark:text-zinc-400 font-medium mt-1">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 bg-white dark:bg-zinc-900 mt-6">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-4">Descripción</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {product.description || 'Producto de alta calidad con materiales premium y diseño exclusivo.'}
          </p>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-4">Especificaciones</h2>
          <div className="space-y-2.5">
            {product.material && (
              <div className="flex justify-between pb-2.5 border-b border-zinc-200 dark:border-zinc-800">
                <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-500">Material</span>
                <span className="text-sm text-zinc-900 dark:text-zinc-100">{product.material}</span>
              </div>
            )}
            {product.weight && (
              <div className="flex justify-between pb-2.5 border-b border-zinc-200 dark:border-zinc-800">
                <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-500">Peso</span>
                <span className="text-sm text-zinc-900 dark:text-zinc-100">{product.weight}</span>
              </div>
            )}
            {product.dimensions && (
              <div className="flex justify-between pb-2.5 border-b border-zinc-200 dark:border-zinc-800">
                <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-500">Dimensiones</span>
                <span className="text-sm text-zinc-900 dark:text-zinc-100">{product.dimensions}</span>
              </div>
            )}
            {product.brand && (
              <div className="flex justify-between pb-2.5 border-b border-zinc-200 dark:border-zinc-800">
                <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-500">Marca</span>
                <span className="text-sm text-zinc-900 dark:text-zinc-100">{product.brand}</span>
              </div>
            )}
            {specs.map((spec, i) => (
              <div key={i} className={`flex justify-between pb-2.5 ${i < specs.length - 1 ? 'border-b border-zinc-200 dark:border-zinc-800' : ''}`}>
                <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-500">{spec.name}</span>
                <span className="text-sm text-zinc-900 dark:text-zinc-100">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 mt-6">
        <ReviewsSection reviews={reviews} productName={product.name} onWriteReview={() => setShowReviewModal(true)} />
      </div>

      {relatedProducts.length > 0 && (
        <div className="p-6">
          <h2 className="text-xl font-extrabold mb-6 text-zinc-900 dark:text-zinc-100">Productos Relacionados</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {relatedProducts.slice(0, 5).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      <CustomerReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        productId={product.id}
        productName={product.name}
        productImage={product.image}
      />
    </div>
  );
};
