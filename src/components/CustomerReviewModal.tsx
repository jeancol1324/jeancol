import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Upload, Camera, Play, Check, User, Mail, Phone, Image, Video, MessageCircle } from 'lucide-react';
import { useReviews } from '../context/ReviewContext';
import { useProducts } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';

interface CustomerReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: string;
  productName?: string;
  productImage?: string;
}

const MAX_IMAGE_SIZE = 500 * 1024;
const MAX_VIDEO_SIZE = 2 * 1024 * 1024;
const MAX_IMAGES = 6;
const MAX_VIDEOS = 2;

export const CustomerReviewModal: React.FC<CustomerReviewModalProps> = ({
  isOpen,
  onClose,
  productId,
  productName,
  productImage,
}) => {
  const { addReview } = useReviews();
  const { products } = useProducts();
  const { showToast } = useToast();

  const [step, setStep] = useState<'form' | 'success'>('form');
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    productId: productId || '',
    userName: '',
    userLastName: '',
    email: '',
    phone: '',
    rating: 5,
    comment: '',
    images: [] as string[],
    videos: [] as string[],
  });

  const selectedProduct = products.find(p => p.id === formData.productId);
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearchQuery.toLowerCase())
  );

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.size <= MAX_IMAGE_SIZE) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          const maxDimension = 800;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const compressed = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressed);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = useCallback(async (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(f => f.type.startsWith('image/'));

    const remaining = MAX_IMAGES - formData.images.length;
    if (remaining <= 0) {
      showToast(`Máximo ${MAX_IMAGES} imágenes permitidas`, 'error');
      return;
    }
    
    try {
      const newImages: string[] = [];
      for (const file of imageFiles.slice(0, remaining)) {
        if (file.size > 10 * MAX_IMAGE_SIZE) {
          showToast(`${file.name} es muy grande`, 'error');
          continue;
        }
        const base64 = await compressImage(file);
        newImages.push(base64);
      }
      if (newImages.length > 0) {
        setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
        showToast(`${newImages.length} imagen(es) subida(s)`, 'success');
      }
    } catch {
      showToast('Error al subir imágenes', 'error');
    }
  }, [formData.images.length, showToast]);

  const handleVideoUpload = useCallback(async (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    const videoFiles = fileArray.filter(f => f.type.startsWith('video/'));

    const remaining = MAX_VIDEOS - formData.videos.length;
    if (remaining <= 0) {
      showToast(`Máximo ${MAX_VIDEOS} videos permitidos`, 'error');
      return;
    }
    
    try {
      const newVideos: string[] = [];
      for (const file of videoFiles.slice(0, remaining)) {
        if (file.size > MAX_VIDEO_SIZE) {
          showToast(`${file.name} excede 2MB`, 'error');
          continue;
        }
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
        });
        newVideos.push(base64);
      }
      if (newVideos.length > 0) {
        setFormData(prev => ({ ...prev, videos: [...prev.videos, ...newVideos] }));
        showToast(`${newVideos.length} video(s) subido(s)`, 'success');
      }
    } catch {
      showToast('Error al subir videos', 'error');
    }
  }, [formData.videos.length, showToast]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const removeVideo = (index: number) => {
    setFormData(prev => ({ ...prev, videos: prev.videos.filter((_, i) => i !== index) }));
  };

  const renderStars = (interactive = false, onChange?: (r: number) => void) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onChange && onChange(star)}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          disabled={!interactive}
        >
          <Star className={`w-8 h-8 ${star <= formData.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-300 dark:text-zinc-600'}`} />
        </button>
      ))}
    </div>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productId) {
      showToast('Selecciona un producto', 'error');
      return;
    }
    if (!formData.userName || !formData.userLastName) {
      showToast('Ingresa tu nombre completo', 'error');
      return;
    }
    if (!formData.comment || formData.comment.length < 10) {
      showToast('Escribe una reseña de al menos 10 caracteres', 'error');
      return;
    }

    addReview(formData.productId, {
      ...formData,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
    });

    setStep('success');
  };

  const handleClose = () => {
    setStep('form');
    setFormData({
      productId: productId || '',
      userName: '',
      userLastName: '',
      email: '',
      phone: '',
      rating: 5,
      comment: '',
      images: [],
      videos: [],
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[95vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 lg:p-6 border-b border-zinc-100 dark:border-zinc-800 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-zinc-900 dark:text-white">Escribe tu Reseña</h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Tu opinión nos importa</p>
                </div>
              </div>
              <button onClick={handleClose} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6">
              {step === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
                    <Check className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2">¡Reseña Enviada!</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mb-6">
                    Gracias por tu opinión. Tu reseña será revisada y publicada pronto.
                  </p>
                  <button
                    onClick={handleClose}
                    className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors"
                  >
                    Cerrar
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Product Selection */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                      Producto *
                    </label>
                    {productId && productName ? (
                      <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                        {productImage && (
                          <img src={productImage} alt="" className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                        )}
                        <div>
                          <p className="text-sm font-bold text-zinc-900 dark:text-white">{productName}</p>
                          <p className="text-xs text-zinc-500">Producto seleccionado</p>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <div
                          onClick={() => setShowProductSearch(!showProductSearch)}
                          className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm cursor-pointer flex items-center justify-between"
                        >
                          <span className={formData.productId ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}>
                            {selectedProduct?.name || 'Buscar producto...'}
                          </span>
                          <Camera className="w-4 h-4 text-zinc-400" />
                        </div>
                        {showProductSearch && (
                          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                            <div className="p-2 border-b border-zinc-100 dark:border-zinc-700">
                              <input
                                type="text"
                                placeholder="Buscar producto..."
                                value={productSearchQuery}
                                onChange={(e) => setProductSearchQuery(e.target.value)}
                                autoFocus
                                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg text-sm outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                              />
                            </div>
                            <div className="max-h-48 overflow-y-auto">
                              {filteredProducts.length === 0 ? (
                                <p className="p-4 text-sm text-zinc-500 text-center">Sin resultados</p>
                              ) : (
                                filteredProducts.map(p => (
                                  <div
                                    key={p.id}
                                    onClick={() => {
                                      setFormData({ ...formData, productId: p.id });
                                      setShowProductSearch(false);
                                      setProductSearchQuery('');
                                    }}
                                    className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700 ${formData.productId === p.id ? 'bg-primary/10' : ''}`}
                                  >
                                    <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{p.name}</p>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                        Nombre *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                          type="text"
                          value={formData.userName}
                          onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 text-zinc-900 dark:text-white"
                          placeholder="Tu nombre"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                        Apellido *
                      </label>
                      <input
                        type="text"
                        value={formData.userLastName}
                        onChange={(e) => setFormData({ ...formData, userLastName: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 text-zinc-900 dark:text-white"
                        placeholder="Tu apellido"
                        required
                      />
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                        <Mail className="w-3 h-3 inline mr-1" />
                        Email (opcional)
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 text-zinc-900 dark:text-white"
                        placeholder="tu@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                        <Phone className="w-3 h-3 inline mr-1" />
                        WhatsApp (opcional)
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 text-zinc-900 dark:text-white"
                        placeholder="+57 300 123 4567"
                      />
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                      Tu calificación *
                    </label>
                    <div className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                      {renderStars(true, (r) => setFormData({ ...formData, rating: r }))}
                      <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400">
                        {formData.rating === 5 ? 'Excelente' : formData.rating === 4 ? 'Muy bueno' : formData.rating === 3 ? 'Bueno' : formData.rating === 2 ? 'Regular' : 'Malo'}
                      </span>
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                      Tu reseña *
                    </label>
                    <textarea
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none text-zinc-900 dark:text-white"
                      rows={4}
                      placeholder="Cuéntanos tu experiencia con el producto..."
                      required
                      minLength={10}
                    />
                    <p className="text-xs text-zinc-400 mt-1">{formData.comment.length}/10 caracteres mínimo</p>
                  </div>

                  {/* Media Upload */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-3">
                      Fotos y Videos del Producto (opcional)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        onDrop={handleDrop}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                          isDragging ? 'border-primary bg-primary/10' : 'border-zinc-300 dark:border-zinc-700 hover:border-primary hover:bg-primary/5'
                        }`}
                      >
                        <input type="file" ref={fileInputRef} onChange={(e) => handleImageUpload(e.target.files)} accept="image/*" multiple className="hidden" />
                        <Image className="w-6 h-6 mx-auto mb-2 text-zinc-400" />
                        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                          {formData.images.length}/{MAX_IMAGES} fotos
                        </p>
                      </div>
                      <div
                        onClick={() => videoInputRef.current?.click()}
                        className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-4 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                      >
                        <input type="file" ref={videoInputRef} onChange={(e) => handleVideoUpload(e.target.files)} accept="video/*" multiple className="hidden" />
                        <Video className="w-6 h-6 mx-auto mb-2 text-zinc-400" />
                        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                          {formData.videos.length}/{MAX_VIDEOS} videos
                        </p>
                      </div>
                    </div>
                    
                    {/* Image Preview */}
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 mt-3">
                        {formData.images.map((img, i) => (
                          <div key={i} className="relative group aspect-square">
                            <img src={img} alt="" className="w-full h-full rounded-lg object-cover" referrerPolicy="no-referrer" />
                            <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Video Preview */}
                    {formData.videos.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        {formData.videos.map((video, i) => (
                          <div key={i} className="relative group aspect-video rounded-lg overflow-hidden">
                            <video src={video} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Play className="w-6 h-6 text-white" fill="white" />
                            </div>
                            <button type="button" onClick={() => removeVideo(i)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full py-4 bg-primary text-white rounded-xl font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Enviar Reseña
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
