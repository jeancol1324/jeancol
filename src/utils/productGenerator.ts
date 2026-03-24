import { ProductFeature } from '../types';

const COLOR_DESCRIPTIONS: Record<string, string[]> = {
  negro: ['elegante y versátil', 'clásico y sofisticado', 'formal y distinguido'],
  azul: ['versátil y fresco', 'moderno y juvenil', 'casual y relajado'],
  blanco: ['limpio y minimalista', 'fresco y luminoso', 'clásico y elegante'],
  rojo: ['audaz y vibrante', 'llamativo y energético', 'pasional y Bold'],
  verde: ['natural y fresco', 'versátil y moderno', 'tranquilo y elegante'],
  gris: ['neutro y sofisticado', 'discreto y elegante', 'moderno y versátil'],
  cafe: ['cálido y terroso', 'natural y auténtico', 'clásico y resistente'],
  rosa: ['femenino y suave', 'romántico y delicado', 'moderno y juvenil'],
  morado: ['creativo y único', 'elegante y misterioso', 'artístico y Bold'],
  naranja: ['dinámico y energético', 'vibrante y juvenil', 'optimista y moderno'],
  amarillo: ['luminoso y alegre', 'optimista y vibrante', 'fresco y juvenil']
};

function detectColor(productName: string): string | null {
  const lowerName = productName.toLowerCase();
  for (const color of Object.keys(COLOR_DESCRIPTIONS)) {
    if (lowerName.includes(color)) {
      return color;
    }
  }
  return null;
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function getColorDescription(color: string): string {
  const descriptions = COLOR_DESCRIPTIONS[color] || ['versátil y elegante'];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

const DESCRIPTIONS: Record<string, string[]> = {
  jeans: [
    'Pantalón denim de alta calidad con corte moderno y elegante. Perfecto para cualquier ocasión, desde looks casuales hasta eventos semi-formales. Su tela resistente y suave al tacto lo convierte en un básico indispensable de tu guardarropa.',
    'Jean diseñado para ofrecer máxima comodidad y estilo. Con tela de mezclilla premium y acabados de precisión, es ideal para el uso diario. Un pantalón que combina durabilidad con diseño contemporáneo.',
    'Pantalón jeans con acabados premium y costuras reforzadas. Un básico del guardarropa que nunca pasa de moda. Su corte moderno se adapta perfectamente a tu estilo.'
  ],
  camisa: [
    'Camisa de corte clássico con tela premium de alta transpirabilidad. Perfecta para ocasiones formales o semi-formales, ofreciendo elegancia y comodidad excepcional durante todo el día.',
    'Camisa versátil con diseño moderno y ajuste perfecto. Ideal para crear looks profesionales o casuales sofisticados. Confeccionada con materiales de primera calidad.',
    'Camisa con acabados de alta calidad y tela transpirable. Comfort excepcional para todo el día. Un diseño atemporal que complementa cualquier outfit.'
  ],
  zapato: [
    'Zapatos de cuero genuino con diseño elegante y suela cómoda. Perfectos para el trabajo o eventos especiales. Construcción artesanal que garantiza durabilidad y estilo.',
    'Calzado con construcción premium y materiales de primera calidad. Combina estilo clásico con confort moderno. Diseñado para quienes buscan elegancia sin comprometer comodidad.',
    'Zapatos formales con acabados impecables y diseño atemporal. Elegancia que no sacrifica comodidad. El complemento perfecto para tu outfit más elegante.'
  ],
  reloj: [
    'Reloj de diseño sofisticado con movimiento de precisión. Accesorio esencial que combina funcionalidad y estilo. Perfecto para cualquier ocasión, desde lo casual hasta lo formal.',
    'Reloj con estética moderna y acabados premium. Perfecto para complementar cualquier outfit, casual o formal. Un accesorio que define tu estilo personal.',
    'Reloj elegante con correa cómoda y visor claro. Incluye resistencia al agua para uso diario. Diseño que combina tradición con innovación.'
  ],
  bolso: [
    'Bolso de diseño único con amplio espacio interior y múltiples compartimentos. Perfecto para el día a día o ocasiones especiales. Combina practicidad con un diseño sofisticado.',
    'Accesorio elegante con acabados de primera calidad y espacio suficiente para todos tus essentials. Ideal para el trabajo, viajes o eventos especiales.',
    'Bolso versátil con múltiples compartimentos y materiales premium. Combina practicidad con un diseño sofisticado que llama la atención.'
  ],
  herramienta: [
    'Herramienta de alta potencia diseñada para trabajos exigentes. Rendimiento profesional con seguridad garantizada. Ideal para profesionales y uso doméstico intensivo.',
    'Equipo robusto con motor de alta eficiencia y construcción reforzada. Ideal para proyectos grandes y trabajos precisos. Durabilidad que se nota en cada uso.',
    'Diseño ergonómico que reduce fatiga en uso prolongado con calidad profesional. Rendimiento excepcional para trabajos exigentes con máxima seguridad.'
  ],
  electronico: [
    'Tecnología de última generación con especificaciones premium. Rendimiento óptimo para trabajo y entretenimiento. Diseñado para memenuhi todas tus necesidades digitales.',
    'Dispositivo con características avanzadas y diseño moderno y elegante. Conectividad completa para tu estilo de vida digital con la última tecnología.',
    'Producto tecnológico con materiales de primera y acabados impecables. Funcionalidad que supera expectativas con interfaz intuitiva y fácil de usar.'
  ],
  general: [
    'Producto de alta calidad con materiales premium cuidadosamente seleccionados. Diseño moderno que se adapta a tus necesidades y estilo de vida.',
    'Artículo versátil con acabados profesionales perfecto para uso cotidiano. Ideal para quienes buscan calidad y funcionalidad en un solo producto.',
    'Opción excelente que combina calidad premium y funcionalidad excepcional. Diseñado pensando en cada detalle para tu completa satisfacción.'
  ]
};

const FEATURES: Record<string, ProductFeature[]> = {
  jeans: [
    { name: 'Material', value: '98% Algodón Ringspun, 2% Elastano' },
    { name: 'Tejido', value: 'Denim de 12 oz con weave de sarga' },
    { name: 'Cierre', value: 'Botón de cobre YKK con cremallera YKK' },
    { name: 'Bolsillos', value: '5 bolsillos funcionales con remaches' },
    { name: 'Costuras', value: 'Costura de seguridad en todas las uniones' },
    { name: 'Cintura', value: 'Pretina de 5cm de ancho' },
    { name: 'Lavado', value: 'Pre-encogido y pre-lavado' },
    { name: 'Origen', value: 'Manufacturado en Colombia' },
    { name: 'Garantía', value: '90 días por defectos de fabricación' },
    { name: 'Cuidado', value: 'Lavar al revés en agua fría' }
  ],
  camisa: [
    { name: 'Material', value: '100% Algodón de fibra larga' },
    { name: 'Tejido', value: 'Popelín con trama compacta' },
    { name: 'Cuello', value: 'Cuello semientallado con refuerzos' },
    { name: 'Manga', value: 'Manga larga con puño redondeado' },
    { name: 'Botones', value: 'Botones de nácar cosidos a mano' },
    { name: 'Costuras', value: 'Doble puntada en bordes' },
    { name: 'Plancha', value: 'Fácil de planchar, anti-arrugas' },
    { name: 'Origen', value: 'Confeccionado en Colombia' },
    { name: 'Garantía', value: '60 días por defectos de fabricación' },
    { name: 'Cuidado', value: 'Lavar en ciclo suave' }
  ],
  zapato: [
    { name: 'Material Exterior', value: 'Cuero vacuno genuino' },
    { name: 'Forro', value: 'Cuero de cabra suave' },
    { name: 'Suela', value: 'Goma vulcanizada antideslizante' },
    { name: 'Plantilla', value: 'Memory foam con soporte de arco' },
    { name: 'Cierre', value: 'Cordones de algodón encerado' },
    { name: 'Construcción', value: 'Pegado y cosido Goodyear' },
    { name: 'Amortiguación', value: 'Tecnología en talón' },
    { name: 'Origen', value: 'Fabricado en Colombia' },
    { name: 'Garantía', value: '90 días por defectos de fabricación' },
    { name: 'Cuidado', value: 'Limpiar con crema para cuero' }
  ],
  reloj: [
    { name: 'Movimiento', value: 'Cuarzo de precisión' },
    { name: 'Caja', value: 'Acero inoxidable 316L' },
    { name: 'Cristal', value: 'Zafiro sintético anti-reflejo' },
    { name: 'Correa', value: 'Cuero genuino con costuras' },
    { name: 'Resistencia al Agua', value: '50 metros (5 ATM)' },
    { name: 'Funciones', value: 'Hora, minutos, segundos, calendario' },
    { name: 'Diámetro', value: '40mm' },
    { name: 'Origen', value: 'Ensamblado en Colombia' },
    { name: 'Garantía', value: '2 años por defectos de maquinaria' },
    { name: 'Cuidado', value: 'Evitar inmersión prolongada' }
  ],
  bolso: [
    { name: 'Material Exterior', value: 'Cuero sintético premium' },
    { name: 'Material Interior', value: 'Tela nylon 210D impermeable' },
    { name: 'Bolsillos', value: 'Principal + frontal + interno' },
    { name: 'Cierre', value: 'Zipper de metal YKK' },
    { name: 'Asas', value: 'Asas de cuero con refuerzos' },
    { name: 'Dimensiones', value: '35cm x 25cm x 12cm' },
    { name: 'Capacidad', value: '20 litros' },
    { name: 'Origen', value: 'Diseñado en Colombia' },
    { name: 'Garantía', value: '90 días por defectos de fabricación' },
    { name: 'Cuidado', value: 'Limpiar con paño húmedo' }
  ],
  herramienta: [
    { name: 'Potencia', value: 'Motor de alta eficiencia' },
    { name: 'Material', value: 'Acero reforzado y plástico industrial' },
    { name: 'Seguridad', value: 'Sistema de frenado instantáneo' },
    { name: 'Ergonomía', value: 'Empuñadura antideslizante' },
    { name: 'Peso', value: 'Diseño equilibrado' },
    { name: 'Temperatura', value: 'Rango óptimo de operación' },
    { name: 'Certificaciones', value: 'Normas de seguridad aplicables' },
    { name: 'Origen', value: 'Fabricado con estándares internacionales' },
    { name: 'Garantía', value: '1 año por defectos de fábrica' },
    { name: 'Mantenimiento', value: 'Guía de mantenimiento incluida' }
  ],
  electronico: [
    { name: 'Procesador', value: 'Chip de última generación' },
    { name: 'Pantalla', value: 'Alta resolución' },
    { name: 'Batería', value: 'Larga duración con carga rápida' },
    { name: 'Conectividad', value: 'WiFi, Bluetooth' },
    { name: 'Almacenamiento', value: 'Espacio ampliable' },
    { name: 'Cámara', value: 'Alta resolución' },
    { name: 'Sistema Operativo', value: 'Última versión' },
    { name: 'Resistencia', value: 'Construcción robusta' },
    { name: 'Origen', value: 'Diseño con estándares globales' },
    { name: 'Garantía', value: '12 meses por defectos de fábrica' }
  ],
  general: [
    { name: 'Material', value: 'Materiales de primera calidad' },
    { name: 'Acabado', value: 'Acabado profesional' },
    { name: 'Diseño', value: 'Diseño moderno y funcional' },
    { name: 'Calidad', value: 'Estándares de calidad export' },
    { name: 'Origen', value: 'Producto con respaldo local' },
    { name: 'Garantía', value: '90 días por defectos de fabricación' },
    { name: 'Empaque', value: 'Empaque seguro para protección' },
    { name: 'Uso', value: 'Adecuado para uso cotidiano' }
  ]
};

function detectProductType(productName: string): string {
  const lower = productName.toLowerCase();
  
  if (lower.includes('jean') || lower.includes('denim')) return 'jeans';
  if (lower.includes('camisa') || lower.includes('shirt') || lower.includes('blusa') || lower.includes('polo')) return 'camisa';
  if (lower.includes('camiseta') || lower.includes('tshirt')) return 'camisa';
  if (lower.includes('zapato') || lower.includes('tennis') || lower.includes('shoes') || lower.includes('mocasín')) return 'zapato';
  if (lower.includes('bota')) return 'zapato';
  if (lower.includes('sandal')) return 'zapato';
  if (lower.includes('reloj') || lower.includes('watch')) return 'reloj';
  if (lower.includes('bolso') || lower.includes('bag') || lower.includes('cartera')) return 'bolso';
  if (lower.includes('mochila') || lower.includes('backpack')) return 'bolso';
  if (lower.includes('herramienta') || lower.includes('taladro') || lower.includes('sierra') || lower.includes('destornillador') || lower.includes('martillo')) return 'herramienta';
  if (lower.includes('celular') || lower.includes('phone') || lower.includes('laptop') || lower.includes('audifonos')) return 'electronico';
  if (lower.includes('licuadora') || lower.includes('tostadora') || lower.includes('olla')) return 'electronico';
  
  return 'general';
}

export function generateAIDescription(productName: string): string {
  const color = detectColor(productName);
  const type = detectProductType(productName);
  
  const templates = DESCRIPTIONS[type] || DESCRIPTIONS.general;
  let description = templates[Math.floor(Math.random() * templates.length)];
  
  if (color) {
    const colorDesc = getColorDescription(color);
    description = description.replace('con corte moderno', `en color ${color} ${colorDesc}`);
  }
  
  return capitalize(description);
}

export function generateAIFeatures(
  productName: string,
  existingFeatures?: ProductFeature[]
): ProductFeature[] {
  const type = detectProductType(productName);
  const color = detectColor(productName);
  
  let features = [...(FEATURES[type] || FEATURES.general)];
  
  if (color && !features.find(f => f.name === 'Color')) {
    features.unshift({ name: 'Color', value: capitalize(color) });
  }
  
  if (existingFeatures && existingFeatures.length > 0) {
    const existingNames = new Set(existingFeatures.map(f => f.name.toLowerCase()));
    const newFeatures = features.filter(f => !existingNames.has(f.name.toLowerCase()));
    return [...existingFeatures, ...newFeatures].slice(0, 10);
  }
  
  return features.slice(0, 10);
}

export function generateVariations(): any[] {
  return [];
}
