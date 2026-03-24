import React, { createContext, useContext, useState, useEffect } from 'react';
import { Coupon } from '../types';
import { supabase } from '../lib/supabase';

interface CouponContextType {
  coupons: Coupon[];
  loading: boolean;
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usedCount'>) => Promise<void>;
  updateCoupon: (id: string, coupon: Partial<Coupon>) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
  toggleCouponStatus: (id: string) => Promise<void>;
  validateCoupon: (code: string, subtotal: number) => { valid: boolean; discount: number; message: string };
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export const CouponProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { data, error } = await supabase
          .from('coupons')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (data) {
          setCoupons(data.map(c => ({
            ...c,
            minPurchase: c.min_purchase,
            maxDiscount: c.max_discount,
            maxUses: c.max_uses,
            usedCount: c.used_count,
            validFrom: c.valid_from,
            validUntil: c.valid_until,
            isActive: c.is_active,
          })));
        }
      } catch (error) {
        console.error('Error fetching coupons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const addCoupon = async (couponData: Omit<Coupon, 'id' | 'usedCount'>) => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .insert([{
          code: couponData.code,
          type: couponData.type,
          value: couponData.value,
          min_purchase: couponData.minPurchase,
          max_discount: couponData.maxDiscount,
          max_uses: couponData.maxUses,
          valid_from: couponData.validFrom,
          valid_until: couponData.validUntil,
          is_active: couponData.isActive,
          description: couponData.description,
        }])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        const newCoupon: Coupon = {
          ...data,
          minPurchase: data.min_purchase,
          maxDiscount: data.max_discount,
          maxUses: data.max_uses,
          usedCount: data.used_count,
          validFrom: data.valid_from,
          validUntil: data.valid_until,
          isActive: data.is_active,
        };
        setCoupons(prev => [...prev, newCoupon]);
      }
    } catch (error: any) {
      console.error('Error adding coupon:', error);
      alert('Error: ' + error.message);
    }
  };

  const updateCoupon = async (id: string, couponData: Partial<Coupon>) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({
          code: couponData.code,
          type: couponData.type,
          value: couponData.value,
          min_purchase: couponData.minPurchase,
          max_discount: couponData.maxDiscount,
          max_uses: couponData.maxUses,
          valid_from: couponData.validFrom,
          valid_until: couponData.validUntil,
          is_active: couponData.isActive,
          description: couponData.description,
        })
        .eq('id', id);

      if (error) throw error;
      setCoupons(prev => prev.map(c => c.id === id ? { ...c, ...couponData } : c));
    } catch (error: any) {
      console.error('Error updating coupon:', error);
    }
  };

  const deleteCoupon = async (id: string) => {
    try {
      const { error } = await supabase.from('coupons').delete().eq('id', id);
      if (error) throw error;
      setCoupons(prev => prev.filter(c => c.id !== id));
    } catch (error: any) {
      console.error('Error deleting coupon:', error);
    }
  };

  const toggleCouponStatus = async (id: string) => {
    const coupon = coupons.find(c => c.id === id);
    if (coupon) {
      await updateCoupon(id, { isActive: !coupon.isActive });
    }
  };

  const validateCoupon = (code: string, subtotal: number) => {
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    
    if (!coupon) {
      return { valid: false, discount: 0, message: 'Cupón no encontrado' };
    }
    
    if (!coupon.isActive) {
      return { valid: false, discount: 0, message: 'Este cupón está desactivado' };
    }
    
    const now = new Date();
    const until = new Date(coupon.validUntil);
    
    if (now > until) {
      return { valid: false, discount: 0, message: 'Este cupón ha expirado' };
    }
    
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return { valid: false, discount: 0, message: 'Este cupón ha alcanzado su límite de usos' };
    }
    
    if (coupon.minPurchase && subtotal < coupon.minPurchase) {
      return { valid: false, discount: 0, message: `Necesitas un mínimo de $${coupon.minPurchase.toLocaleString('es-CO')} COP para usar este cupón` };
    }
    
    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (subtotal * coupon.value) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      discount = coupon.value;
    }
    
    return { valid: true, discount, message: 'Cupón aplicado correctamente' };
  };

  return (
    <CouponContext.Provider value={{ coupons, loading, addCoupon, updateCoupon, deleteCoupon, toggleCouponStatus, validateCoupon }}>
      {children}
    </CouponContext.Provider>
  );
};

export const useCoupons = () => {
  const context = useContext(CouponContext);
  if (context === undefined) {
    throw new Error('useCoupons must be used within a CouponProvider');
  }
  return context;
};
