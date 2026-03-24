export interface Review {
  id: string;
  productId: string;
  userName: string;
  userLastName: string;
  email?: string;
  phone?: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
  images?: string[];
  videos?: string[];
  status: 'pending' | 'approved' | 'rejected';
}

export interface ProductFeature {
  name: string;
  value: string;
}

export interface ProductVariation {
  id: string;
  name: string;
  value: string;
  stock: number;
  price?: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  images?: string[];
  video?: string;
  discount?: string;
  oldPrice?: number;
  offerPrice?: number;
  offerEndDate?: string;
  description?: string;
  features?: ProductFeature[];
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  variations?: ProductVariation[];
  stock?: number;
  rating?: number;
  reviewsCount?: number;
  reviews?: Review[];
  isNew?: boolean;
  isTrending?: boolean;
  sizeGuideType?: 'shoes' | 'clothing' | 'accessories';
  weight?: string;
  dimensions?: string;
  material?: string;
  brand?: string;
  sku?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedVariations?: Record<string, string>;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  department: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount?: number;
  couponCode?: string;
  total: number;
  status: OrderStatus;
  paymentMethod: 'efectivo' | 'transferencia' | 'contraentrega';
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  maxUses?: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  description?: string;
}
