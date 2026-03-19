export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
  images?: string[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  images?: string[];
  discount?: string;
  oldPrice?: number;
  description?: string;
  sizes?: string[];
  stock?: number;
  rating?: number;
  reviewsCount?: number;
  reviews?: Review[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}
