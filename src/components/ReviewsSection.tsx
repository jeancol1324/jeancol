import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ThumbsUp, X, ChevronDown, ChevronUp, MessageSquare, Play, ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { Review } from '../types';

interface ReviewsSectionProps {
  reviews: Review[];
  productName?: string;
  onWriteReview?: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, productName, onWriteReview }) => {
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [previewMedia, setPreviewMedia] = useState<{ type: 'image' | 'video'; src: string; index: number; total: number } | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : '0.0';

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
  }));

  const toggleExpand = (id: string) => {
    setExpandedReviews(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  const getMediaFromReview = useCallback((review: Review) => {
    const media: { type: 'image' | 'video'; src: string }[] = [];
    if (review.images) {
      review.images.filter(img => img && img.trim() !== '').forEach(src => media.push({ type: 'image', src }));
    }
    if (review.videos) {
      review.videos.filter(vid => vid && vid.trim() !== '').forEach(src => media.push({ type: 'video', src }));
    }
    return media;
  }, []);

  const openPreview = (review: Review, mediaIndex: number) => {
    const media = getMediaFromReview(review);
    if (media.length > 0) {
      setPreviewMedia({ ...media[mediaIndex], index: mediaIndex, total: media.length });
    }
  };

  const navigateMedia = useCallback((direction: 'prev' | 'next') => {
    if (!previewMedia) return;
    const currentReview = reviews.find(r => 
      (r.images?.some(img => img === previewMedia.src) || r.videos?.some(vid => vid === previewMedia.src))
    );
    if (!currentReview) return;
    
    const media = getMediaFromReview(currentReview);
    const delta = direction === 'prev' ? -1 : 1;
    let newIndex = previewMedia.index + delta;
    
    if (newIndex < 0) newIndex = media.length - 1;
    if (newIndex >= media.length) newIndex = 0;
    
    setPreviewMedia({ ...media[newIndex], index: newIndex, total: media.length });
  }, [previewMedia, reviews, getMediaFromReview]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!previewMedia) return;
    if (e.key === 'ArrowLeft') navigateMedia('prev');
    if (e.key === 'ArrowRight') navigateMedia('next');
    if (e.key === 'Escape') setPreviewMedia(null);
  }, [previewMedia, navigateMedia]);

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="p-6 lg:p-8 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <span className="text-5xl lg:text-6xl font-black text-zinc-900 dark:text-white leading-none">
                {averageRating}
              </span>
              <div className="flex flex-col items-start">
                <div className="flex gap-0.5 mb-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i <= Math.round(parseFloat(averageRating)) 
                          ? 'text-amber-400 fill-amber-400' 
                          : 'text-zinc-200 dark:text-zinc-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}
                </span>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-6 ml-auto">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">{rating}★</span>
                  <div className="w-16 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 rounded-full" 
                      style={{ width: `${percentage}%` }} 
                    />
                  </div>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:hidden mt-4">
            <div className="flex gap-3 justify-center">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex flex-col items-center">
                  <span className="text-xs text-zinc-400 mb-1">{rating}★</span>
                  <div className="w-8 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 rounded-full" 
                      style={{ width: `${ratingDistribution.find(r => r.rating === rating)?.percentage || 0}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {onWriteReview && (
            <div className="mt-6 flex justify-center lg:justify-end">
              <button
                onClick={onWriteReview}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-xl"
              >
                <Pencil className="w-4 h-4" />
                Escribir Reseña
              </button>
            </div>
          )}
        </div>

        <div className="p-6 lg:p-8 pt-0">
          {reviews.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {displayedReviews.map((review, index) => {
                  const isExpanded = expandedReviews.has(review.id);
                  const shouldTruncate = review.comment.length > 100;
                  const media = getMediaFromReview(review);
                  
                  return (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.06 }}
                    >
                      <div className="h-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-700/50 hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
                            <span className="text-xs font-bold text-white">
                              {review.userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-zinc-900 dark:text-white truncate">
                              {review.userName}
                            </h4>
                            <p className="text-xs text-zinc-400 dark:text-zinc-500">
                              {formatDate(review.date)}
                            </p>
                          </div>
                          
                          <div className="flex gap-0.5 flex-shrink-0">
                            {[1, 2, 3, 4, 5].map(i => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i <= review.rating 
                                    ? 'text-amber-400 fill-amber-400' 
                                    : 'text-zinc-200 dark:text-zinc-700'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        
                        <p className={`text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed ${
                          !isExpanded && shouldTruncate ? 'line-clamp-2' : ''
                        }`}>
                          {review.comment}
                        </p>
                        
                        {shouldTruncate && (
                          <button
                            onClick={() => toggleExpand(review.id)}
                            className="flex items-center gap-1 mt-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                          >
                            {isExpanded ? (
                              <><span>Ver menos</span><ChevronUp className="w-3 h-3" /></>
                            ) : (
                              <><span>Ver más</span><ChevronDown className="w-3 h-3" /></>
                            )}
                          </button>
                        )}
                        
                        {review.images && review.images.filter(img => img && img.trim() !== '').length > 0 && (() => {
                          const validImages = review.images.filter(img => img && img.trim() !== '');
                          return (
                            <div className="mt-3 grid grid-cols-2 gap-2">
                              {validImages.slice(0, 4).map((img, i) => (
                                <button
                                  key={i}
                                  onClick={() => openPreview(review, i)}
                                  className="relative aspect-square rounded-xl overflow-hidden group"
                                >
                                  <img
                                    src={img}
                                    alt={`Review image ${i + 1}`}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                    <MessageSquare className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                  {i === 3 && validImages.length > 4 && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                      <span className="text-white font-bold text-lg">+{validImages.length - 4}</span>
                                    </div>
                                  )}
                                </button>
                              ))}
                            </div>
                          );
                        })()}
                        
                        {review.videos && review.videos.filter(v => v && v.trim() !== '').length > 0 && (() => {
                          const validVideos = review.videos.filter(v => v && v.trim() !== '');
                          const imageCount = review.images?.filter(img => img && img.trim() !== '').length || 0;
                          return (
                            <div className="mt-3 flex gap-2">
                            {validVideos.slice(0, 2).map((video, i) => (
                              <button
                                key={i}
                                onClick={() => openPreview(review, imageCount + i)}
                                className="relative w-24 h-24 rounded-xl overflow-hidden group"
                              >
                                <video 
                                  src={video} 
                                  className="w-full h-full object-cover"
                                  muted
                                  preload="metadata"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                  <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                                    <Play className="w-5 h-5 text-zinc-900 ml-0.5" fill="currentColor" />
                                  </div>
                                </div>
                              </button>
                            ))}
                            {validVideos.length > 2 && (
                              <div className="relative w-24 h-24 rounded-xl bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                                <span className="text-zinc-500 dark:text-zinc-400 font-bold">+{validVideos.length - 2}</span>
                              </div>
                            )}
                          </div>
                          );
                        })()}
                        
                        <div className="mt-3 pt-2 border-t border-zinc-200/50 dark:border-zinc-700/50">
                          <button className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 hover:text-primary dark:hover:text-primary transition-colors">
                            <ThumbsUp className="w-3 h-3" />
                            <span>¿Útil?</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {reviews.length > 3 && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-lg"
                  >
                    {showAllReviews ? (
                      <><span>Mostrar menos</span><ChevronUp className="w-4 h-4" /></>
                    ) : (
                      <><span>Ver todas las {reviews.length} reseñas</span><ChevronDown className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <Star className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                Aún no hay reseñas
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mb-4">
                Este{productName ? ` ${productName}` : ''} aún no ha sido evaluado. ¡Sé el primero en compartir tu experiencia!
              </p>
              {onWriteReview && (
                <button
                  onClick={onWriteReview}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  <Pencil className="w-4 h-4" />
                  Escribir Primera Reseña
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {previewMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-8"
          >
            <button
              onClick={() => setPreviewMedia(null)}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            
            {previewMedia.total > 1 && (
              <>
                <button
                  onClick={() => navigateMedia('prev')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={() => navigateMedia('next')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 rounded-full z-10">
                  <span className="text-white text-sm font-medium">{previewMedia.index + 1} / {previewMedia.total}</span>
                </div>
              </>
            )}
            
            <div 
              className="cursor-zoom-out" 
              onClick={() => setPreviewMedia(null)}
            >
              {previewMedia.type === 'image' ? (
                <motion.img
                  key={previewMedia.src}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  src={previewMedia.src}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                  referrerPolicy="no-referrer"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <motion.video
                  key={previewMedia.src}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  src={previewMedia.src}
                  controls
                  autoPlay
                  className="max-w-full max-h-full rounded-2xl shadow-2xl"
                  referrerPolicy="no-referrer"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReviewsSection;
