import React, { createContext, useContext, useState, useEffect } from 'react';
import { Coupon } from '../types';
import { getUserData, setUserData, getUserDataParsed } from '../lib/userData';

interface CouponContextType {
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usedCount'>) => void;
  updateCoupon: (id: string, coupon: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  toggleCouponStatus: (id: string) => void;
  validateCoupon: (code: string, subtotal: number) => { valid: boolean; discount: number; message: string };
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export const CouponProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    return getUserDataParsed('coupons') || [];
  });

  useEffect(() => {
    const saved = getUserDataParsed('coupons');
    if (saved && saved.length > 0) {
      setCoupons(saved);
    } else {
      const sampleCoupons: Coupon[] = [
        { id: '1', code: 'BIENVENIDO10', type: 'percentage', value: 10, minPurchase: 50000, maxDiscount: 20000, maxUses: 100, usedCount: 15, validFrom: new Date().toISOString().split('T')[0], validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], isActive: true, description: '10% de descuento' },
        { id: '2', code: 'ENVIOGRATIS', type: 'fixed', value: 14500, minPurchase: 95000, maxUses: 50, usedCount: 8, validFrom: new Date().toISOString().split('T')[0], validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], isActive: true, description: 'Envío gratis' },
        { id: '3', code: 'VERANO20', type: 'percentage', value: 20, minPurchase: 100000, maxDiscount: 50000, maxUses: 200, usedCount: 0, validFrom: new Date().toISOString().split('T')[0], validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], isActive: true, description: '20% de descuento' },
      ];
      setCoupons(sampleCoupons);
      setUserData('coupons', sampleCoupons);
    }
  }, []);

  const saveCoupons = (updated: Coupon[]) => {
    setCoupons(updated);
    setUserData('coupons', updated);
  };

  const addCoupon = (couponData: Omit<Coupon, 'id' | 'usedCount'>) => {
    const newCoupon: Coupon = { ...couponData, id: Date.now().toString(), usedCount: 0 };
    saveCoupons([...coupons, newCoupon]);
  };

  const updateCoupon = (id: string, couponData: Partial<Coupon>) => {
    const updated = coupons.map(c => c.id === id ? { ...c, ...couponData } : c);
    saveCoupons(updated);
  };

  const deleteCoupon = (id: string) => {
    const updated = coupons.filter(c => c.id !== id);
    saveCoupons(updated);
  };

  const toggleCouponStatus = (id: string) => {
    const updated = coupons.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c);
    saveCoupons(updated);
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
    const from = new Date(coupon.validFrom);
    const until = new Date(coupon.validUntil);
    
    if (now < from) {
      return { valid: false, discount: 0, message: 'Este cupón aún no está vigente' };
    }
    
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
    <CouponContext.Provider value={{ coupons, addCoupon, updateCoupon, deleteCoupon, toggleCouponStatus, validateCoupon }}>
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
