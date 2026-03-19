import { Product } from './types';

export const CATEGORIES = [
  { id: '1', name: 'Ropa', count: '1,240', image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=200&q=80' },
  { id: '2', name: 'Accesorios', count: '629', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80' },
  { id: '3', name: 'Hogar', count: '318', image: 'https://images.unsplash.com/photo-1513507766391-aa3a70359f4a?auto=format&fit=crop&w=200&q=80' },
  { id: '4', name: 'Tech', count: '452', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=200&q=80' },
  { id: '5', name: 'Arte', count: '150', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=200&q=80' },
];

export const PRODUCTS: Product[] = [
  { 
    id: '1', 
    name: 'Zapatilla Pro-Lite', 
    price: 89.00, 
    oldPrice: 120.00, 
    discount: '-30%', 
    category: 'Calzado', 
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', 
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Comodidad y estilo para el día a día urbano. Fabricadas con materiales reciclados de alta calidad.',
    sizes: ['38', '39', '40', '41', '42', '43'],
    stock: 15,
    rating: 4.8,
    reviewsCount: 124,
    reviews: [
      {
        id: 'r1',
        userName: 'Juan Pérez',
        rating: 5,
        comment: 'Increíble calidad. El envío fue súper rápido y el empaque premium me sorprendió. Definitivamente volveré a comprar.',
        date: 'Hace 2 días',
        avatar: 'JP'
      },
      {
        id: 'r2',
        userName: 'María García',
        rating: 4,
        comment: 'Muy cómodas, aunque la talla viene un poco pequeña. Recomiendo pedir una talla más.',
        date: 'Hace 1 semana',
        avatar: 'MG'
      }
    ]
  },
  { 
    id: '2', 
    name: 'Gafas Dark-Edge', 
    price: 45.00, 
    oldPrice: 55.00, 
    discount: '-15%', 
    category: 'Accesorios', 
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=400&q=80', 
    description: 'Protección UV con diseño minimalista premium. Ideales para cualquier ocasión.',
    sizes: ['Única'],
    stock: 8,
    rating: 4.5,
    reviewsCount: 89
  },
  { 
    id: '3', 
    name: 'Camiseta Essential', 
    price: 22.00, 
    category: 'Ropa', 
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80',
    description: 'Básico indispensable en algodón 100% orgánico.',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 45,
    rating: 4.9,
    reviewsCount: 256
  },
  { 
    id: '4', 
    name: 'Bolso Cuero Minimal', 
    price: 120.00, 
    category: 'Accesorios', 
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=400&q=80',
    description: 'Cuero genuino con acabados artesanales.',
    sizes: ['Única'],
    stock: 5,
    rating: 4.7,
    reviewsCount: 42
  },
  { 
    id: '5', 
    name: 'Lentes Sol Wood', 
    price: 55.00, 
    category: 'Accesorios', 
    image: 'https://images.unsplash.com/photo-1511499767390-903390e6fbc4?auto=format&fit=crop&w=400&q=80',
    description: 'Montura de madera sostenible con lentes polarizadas.',
    sizes: ['Única'],
    stock: 12,
    rating: 4.6,
    reviewsCount: 67
  },
  { 
    id: '6', 
    name: 'Cinturón Classic', 
    price: 35.00, 
    category: 'Accesorios', 
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80',
    description: 'Elegancia atemporal en cuero negro.',
    sizes: ['85', '90', '95', '100'],
    stock: 20,
    rating: 4.4,
    reviewsCount: 34
  },
];

export const ORDERS = [
  { id: '10294', customer: 'Juan Pérez', date: '24 Oct 2023', time: '14:30', status: 'Pendiente', location: 'Bogotá, D.C.', phone: '310 123 4567' },
  { id: '10295', customer: 'María García', date: '23 Oct 2023', time: '09:15', status: 'Enviado', location: 'Medellín', phone: '315 987 6543' },
  { id: '10296', customer: 'Carlos Ruiz', date: '22 Oct 2023', time: '17:45', status: 'Entregado', location: 'Cali', phone: '320 456 7890' },
  { id: '10297', customer: 'Elena Martínez', date: '22 Oct 2023', time: '11:20', status: 'Pendiente', location: 'Barranquilla', phone: '301 222 3333' },
];
