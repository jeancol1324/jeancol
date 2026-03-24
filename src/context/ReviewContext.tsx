import React, { createContext, useContext, useState, useEffect } from 'react';
import { Review } from '../types';
import { supabase } from '../lib/supabase';

interface ReviewContextType {
  reviews: Review[];
  loading: boolean;
  pendingReviews: Review[];
  approvedReviews: Review[];
  addReview: (productId: string, review: Omit<Review, 'id'>) => Promise<void>;
  updateReview: (productId: string, reviewId: string, review: Partial<Review>) => Promise<void>;
  deleteReview: (productId: string, reviewId: string) => Promise<void>;
  getReviewsByProduct: (productId: string) => Review[];
  addReviewDirect: (review: Omit<Review, 'id'>) => Promise<void>;
  updateReviewDirect: (reviewId: string, review: Partial<Review>) => Promise<void>;
  deleteReviewDirect: (reviewId: string) => Promise<void>;
  approveReview: (reviewId: string) => Promise<void>;
  rejectReview: (reviewId: string) => Promise<void>;
  getPendingCount: () => number;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

const sampleReviews: Review[] = [
  { id: '1', productId: '1', userName: 'María', userLastName: 'García', rating: 5, comment: 'Excelente producto, muy buena calidad.', date: '2024-01-15', images: [], videos: [], status: 'approved' },
  { id: '2', productId: '1', userName: 'Carlos', userLastName: 'López', rating: 4, comment: 'Buen producto, llegó rápido.', date: '2024-01-14', images: [], videos: [], status: 'approved' },
  { id: '3', productId: '2', userName: 'Ana', userLastName: 'Martínez', rating: 5, comment: 'Superó mis expectativas.', date: '2024-01-13', images: [], videos: [], status: 'approved' },
];

export const ReviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>(sampleReviews);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) {
          setReviews(data.map(r => ({
            ...r,
            productId: r.product_id,
            userName: r.user_name,
            userLastName: r.user_last_name,
          })));
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const pendingReviews = reviews.filter(r => r.status === 'pending');
  const approvedReviews = reviews.filter(r => r.status === 'approved');

  const getPendingCount = () => pendingReviews.length;

  const addReviewDirect = async (review: Omit<Review, 'id'>) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .insert([{
          product_id: review.productId,
          user_name: review.userName,
          user_last_name: review.userLastName,
          email: review.email,
          phone: review.phone,
          rating: review.rating,
          comment: review.comment,
          status: review.status || 'pending',
        }]);

      if (error) throw error;
      const newReview: Review = { ...review, id: Date.now().toString() };
      setReviews(prev => [newReview, ...prev]);
    } catch (error) {
      console.error('Error adding review:', error);
      const newReview: Review = { ...review, id: Date.now().toString() };
      setReviews(prev => [newReview, ...prev]);
    }
  };

  const updateReviewDirect = async (reviewId: string, reviewData: Partial<Review>) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({
          rating: reviewData.rating,
          comment: reviewData.comment,
          status: reviewData.status,
        })
        .eq('id', reviewId);

      if (error) throw error;
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, ...reviewData } : r));
    } catch (error) {
      console.error('Error updating review:', error);
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, ...reviewData } : r));
    }
  };

  const deleteReviewDirect = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    }
  };

  const approveReview = async (reviewId: string) => {
    await updateReviewDirect(reviewId, { status: 'approved' });
  };

  const rejectReview = async (reviewId: string) => {
    await deleteReviewDirect(reviewId);
  };

  const addReview = async (productId: string, review: Omit<Review, 'id'>) => {
    const newReview: Review = { ...review, id: `${productId}-${Date.now()}`, status: 'pending' as const };
    await addReviewDirect(newReview);
  };

  const updateReview = async (productId: string, reviewId: string, reviewData: Partial<Review>) => {
    await updateReviewDirect(reviewId, reviewData);
  };

  const deleteReview = async (productId: string, reviewId: string) => {
    await deleteReviewDirect(reviewId);
  };

  const getReviewsByProduct = (productId: string) => {
    return reviews.filter(r => r.productId === productId && r.status === 'approved');
  };

  return (
    <ReviewContext.Provider value={{ 
      reviews,
      loading,
      pendingReviews,
      approvedReviews,
      addReview, 
      updateReview, 
      deleteReview, 
      getReviewsByProduct,
      addReviewDirect,
      updateReviewDirect,
      deleteReviewDirect,
      approveReview,
      rejectReview,
      getPendingCount,
    }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
};
