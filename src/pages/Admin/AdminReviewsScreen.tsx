import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, X, Pencil, Trash2, Star, Save, ArrowLeft, SlidersHorizontal, Play, Upload, Check, Clock, AlertCircle } from 'lucide-react';
import { AdminNavigation } from '../../components/AdminNavigation';
import { useReviews } from '../../context/ReviewContext';
import { useProducts } from '../../context/ProductContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { Review } from '../../types';

const MAX_IMAGE_SIZE = 500 * 1024;
const MAX_VIDEO_SIZE = 2 * 1024 * 1024;
const MAX_IMAGES = 6;
const MAX_VIDEOS = 2;

export const AdminReviewsScreen = () => {
  const { reviews, pendingReviews, approvedReviews, addReviewDirect, updateReviewDirect, deleteReviewDirect, approveReview, rejectReview } = useReviews();
  const { products } = useProducts();
  const { theme } = useTheme();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [previewMedia, setPreviewMedia] = useState<{ type: 'image' | 'video'; src: string } | null>(null);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    productId: '',
    userName: '',
    userLastName: '',
    rating: 5,
    comment: '',
    date: new Date().toISOString().split('T')[0],
    images: [] as string[],
    videos: [] as string[],
    status: 'approved' as 'pending' | 'approved' | 'rejected',
  });

  const displayedReviews = activeTab === 'pending' ? pendingReviews : approvedReviews;
  const selectedProduct = products.find(p => p.id === formData.productId);
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(productSearchQuery.toLowerCase()));

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

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(f => f.type.startsWith('image/'));
    const videoFiles = fileArray.filter(f => f.type.startsWith('video/'));

    if (imageFiles.length > 0) {
      const remaining = MAX_IMAGES - formData.images.length;
      if (remaining <= 0) {
        showToast(`Máximo ${MAX_IMAGES} imágenes`, 'error');
        return;
      }
      try {
        const newImages: string[] = [];
        for (const file of imageFiles.slice(0, remaining)) {
          if (file.size > 10 * MAX_IMAGE_SIZE) continue;
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
    }

    if (videoFiles.length > 0) {
      const remaining = MAX_VIDEOS - formData.videos.length;
      if (remaining <= 0) {
        showToast(`Máximo ${MAX_VIDEOS} videos`, 'error');
        return;
      }
      try {
        const newVideos: string[] = [];
        for (const file of videoFiles.slice(0, remaining)) {
          if (file.size > MAX_VIDEO_SIZE) continue;
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
    }
  }, [showToast, formData.images.length, formData.videos.length]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const removeVideo = (index: number) => {
    setFormData(prev => ({ ...prev, videos: prev.videos.filter((_, i) => i !== index) }));
  };

  const openModal = (review?: Review) => {
    if (review) {
      setEditingReview(review);
      setFormData({
        productId: review.productId,
        userName: review.userName,
        userLastName: review.userLastName,
        rating: review.rating,
        comment: review.comment,
        date: review.date,
        images: (review.images || []).filter(img => img && img.trim() !== ''),
        videos: (review.videos || []).filter(vid => vid && vid.trim() !== ''),
        status: review.status,
      });
    } else {
      setEditingReview(null);
      setFormData({
        productId: products[0]?.id || '',
        userName: '',
        userLastName: '',
        rating: 5,
        comment: '',
        date: new Date().toISOString().split('T')[0],
        images: [],
        videos: [],
        status: 'approved',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingReview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productId || !formData.userName || !formData.comment) {
      showToast('Completa los campos requeridos', 'error');
      return;
    }
    if (editingReview) {
      updateReviewDirect(editingReview.id, formData);
    } else {
      addReviewDirect(formData);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar esta reseña?')) {
      deleteReviewDirect(id);
    }
  };

  const renderStars = (rating: number, interactive = false, onChange?: (r: number) => void) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onChange && onChange(star)}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          disabled={!interactive}
        >
          <Star className={`w-5 h-5 lg:w-6 lg:h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-300 dark:text-zinc-600'}`} />
        </button>
      ))}
    </div>
  );

  const getProductName = (productId: string) => products.find(p => p.id === productId)?.name || 'Producto';
  const getProductImage = (productId: string) => products.find(p => p.id === productId)?.image || '';

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 h-16 lg:h-20 px-4 lg:px-8 flex items-center">
        <div className="w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => window.history.back()} className="p-2 -ml-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <ArrowLeft className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
            </button>
            <div>
              <h1 className="text-lg lg:text-2xl font-black text-zinc-900 dark:text-white">Reseñas</h1>
              <p className="text-xs lg:text-sm text-zinc-500 dark:text-zinc-400">
                {pendingReviews.length} pendientes • {approvedReviews.length} aprobadas
              </p>
            </div>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-primary text-white px-4 lg:px-5 py-2.5 lg:py-3 rounded-xl text-xs lg:text-sm font-bold shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
            <span className="hidden sm:inline">Nueva Reseña</span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-4 lg:px-8 pt-4">
        <div className="flex gap-2 bg-white dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 w-fit">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'pending'
                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            Pendientes
            {pendingReviews.length > 0 && (
              <span className="px-1.5 py-0.5 bg-amber-500 text-white text-xs rounded-full">
                {pendingReviews.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'approved'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Check className="w-4 h-4" />
            Aprobadas
          </button>
        </div>
      </div>

      <div className="p-4 lg:p-6 xl:p-8 pb-28 lg:pb-12">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl lg:rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm lg:shadow-xl overflow-hidden">
          {displayedReviews.length === 0 ? (
            <div className="p-12 lg:p-16 text-center">
              <div className="w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                {activeTab === 'pending' ? (
                  <Clock className="w-10 h-10 lg:w-12 lg:h-12 text-zinc-300 dark:text-zinc-600" />
                ) : (
                  <Star className="w-10 h-10 lg:w-12 lg:h-12 text-zinc-300 dark:text-zinc-600" />
                )}
              </div>
              <p className="text-lg lg:text-xl font-bold text-zinc-900 dark:text-white mb-1">
                {activeTab === 'pending' ? 'Sin reseñas pendientes' : 'Sin reseñas aprobadas'}
              </p>
              <p className="text-sm lg:text-base text-zinc-500 dark:text-zinc-400">
                {activeTab === 'pending' ? 'Las reseñas de clientes aparecerán aquí para aprobación' : 'Las reseñas aprobadas aparecerán aquí'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {displayedReviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 lg:p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                >
                  <div className="flex gap-3 lg:gap-4">
                    {getProductImage(review.productId) ? (
                      <img
                        src={getProductImage(review.productId)}
                        alt={getProductName(review.productId)}
                        className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl object-cover flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl bg-zinc-200 dark:bg-zinc-700 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="text-xs font-semibold text-primary mb-1">{getProductName(review.productId)}</p>
                          <div className="flex items-center gap-2 lg:gap-3">
                            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center font-bold text-xs lg:text-sm">
                              {review.userName.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-sm lg:text-base text-zinc-900 dark:text-white">
                                {review.userName} {review.userLastName}
                              </p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400">{review.date}</p>
                            </div>
                          </div>
                          {review.email && (
                            <p className="text-xs text-zinc-400 mt-1">📧 {review.email}</p>
                          )}
                          {review.phone && (
                            <p className="text-xs text-zinc-400">📱 {review.phone}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {renderStars(review.rating)}
                          <div className="flex gap-1">
                            {activeTab === 'pending' && (
                              <>
                                <button
                                  onClick={() => approveReview(review.id)}
                                  className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 hover:bg-green-500 hover:text-white transition-all"
                                  title="Aprobar"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => rejectReview(review.id)}
                                  className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                  title="Rechazar"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {activeTab === 'approved' && (
                              <>
                                <button onClick={() => openModal(review)} className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-primary hover:text-white transition-all">
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(review.id)} className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-red-500 hover:text-white transition-all">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm lg:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">{review.comment}</p>
                      
                      {(review.images?.filter(img => img && img.trim() !== '').length ?? 0) > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-1 mb-2">
                          {review.images?.filter(img => img && img.trim() !== '').map((img, i) => (
                            <button
                              key={i}
                              onClick={() => setPreviewMedia({ type: 'image', src: img })}
                              className="relative flex-shrink-0 group"
                            >
                              <img src={img} alt="" className="w-16 h-16 lg:w-20 lg:h-20 rounded-lg object-cover border-2 border-transparent group-hover:border-primary transition-all" referrerPolicy="no-referrer" />
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {(review.videos?.filter(v => v && v.trim() !== '').length ?? 0) > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {review.videos?.filter(v => v && v.trim() !== '').map((video, i) => (
                            <button
                              key={i}
                              onClick={() => setPreviewMedia({ type: 'video', src: video })}
                              className="relative flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden group"
                            >
                              <video src={video} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all flex items-center justify-center">
                                <Play className="w-8 h-8 text-white" fill="white" />
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
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
                  {editingReview ? 'Editar Reseña' : 'Nueva Reseña'}
                </h2>
                <button onClick={closeModal} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                  <X className="w-5 h-5 text-zinc-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-4 lg:space-y-5 overflow-y-auto flex-1">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Producto *</label>
                  <div className="relative">
                    <div
                      onClick={() => setShowProductDropdown(!showProductDropdown)}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 text-zinc-900 dark:text-zinc-100 cursor-pointer flex items-center justify-between"
                    >
                      <span className={formData.productId ? '' : 'text-zinc-400'}>
                        {selectedProduct?.name || 'Buscar producto...'}
                      </span>
                      <SlidersHorizontal className="w-4 h-4 text-zinc-400" />
                    </div>
                    {showProductDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                        <div className="p-2 border-b border-zinc-100 dark:border-zinc-700">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                              type="text"
                              placeholder="Buscar producto..."
                              value={productSearchQuery}
                              onChange={(e) => setProductSearchQuery(e.target.value)}
                              autoFocus
                              className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg text-sm outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                            />
                          </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {filteredProducts.length === 0 ? (
                            <p className="p-4 text-sm text-zinc-500 text-center">Sin resultados</p>
                          ) : (
                            filteredProducts.map(p => (
                              <div
                                key={p.id}
                                onClick={() => {
                                  setFormData({ ...formData, productId: p.id });
                                  setShowProductDropdown(false);
                                  setProductSearchQuery('');
                                }}
                                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700 ${formData.productId === p.id ? 'bg-primary/10' : ''}`}
                              >
                                {p.image && <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />}
                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{p.name}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Nombre *</label>
                    <input
                      type="text"
                      value={formData.userName}
                      onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 text-zinc-900 dark:text-zinc-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Apellido *</label>
                    <input
                      type="text"
                      value={formData.userLastName}
                      onChange={(e) => setFormData({ ...formData, userLastName: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 text-zinc-900 dark:text-zinc-100"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Calificación</label>
                  <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                    {renderStars(formData.rating, true, (r) => setFormData({ ...formData, rating: r }))}
                    <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400">{formData.rating}/5</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Comentario *</label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none text-zinc-900 dark:text-zinc-100"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Fecha</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="flex gap-3 pt-2 pb-2">
                  <button type="button" onClick={closeModal} className="flex-1 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 font-bold text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" className="flex-1 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                    <Save className="w-4 h-4" />
                    {editingReview ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {previewMedia && previewMedia.src && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setPreviewMedia(null)}
          >
            {previewMedia.type === 'image' ? (
              <motion.img initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} src={previewMedia.src} alt="" className="max-w-full max-h-full object-contain rounded-lg" referrerPolicy="no-referrer" />
            ) : (
              <motion.video initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} src={previewMedia.src} controls autoPlay className="max-w-full max-h-full rounded-lg" referrerPolicy="no-referrer" />
            )}
            <button onClick={() => setPreviewMedia(null)} className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
              <X className="w-6 h-6 text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminReviewsScreen;
