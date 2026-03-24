import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Files, Settings2, Plus, Tag, Clock, Zap, Calendar, X, Palette, Ruler, Image as ImageIcon, Video, Trash2, GripVertical, Check, Upload, Camera, Sparkles, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../../context/CategoryContext';
import { useProducts } from '../../context/ProductContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { ProductFeature, ProductVariation } from '../../types';
import { formatPriceCOP, parsePrice } from '../../lib/utils';
import { generateAIDescription, generateAIFeatures, generateVariations } from '../../utils/productGenerator';
import { compressImage, MAX_VIDEO_SIZE } from '../../utils/imageUtils';

export const AdminNewProductScreen = () => {
  const navigate = useNavigate();
  const { categories } = useCategories();
  const { addProduct } = useProducts();
  const { showToast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: 0,
    offerPrice: 0,
    stock: 10,
    image: '',
    images: [] as string[],
    video: '',
    sizes: [] as string[],
    colors: [] as { name: string; hex: string }[],
    features: [] as ProductFeature[],
    variations: [] as ProductVariation[],
    isNew: false,
    sizeGuideType: 'shoes' as 'shoes' | 'clothing' | 'accessories',
    weight: '',
    dimensions: '',
    material: '',
    brand: '',
    sku: '',
  });

  const [hasOffer, setHasOffer] = useState(false);
  const [offerDuration, setOfferDuration] = useState<number>(24);
  const [offerUnit, setOfferUnit] = useState<'hours' | 'days' | 'weeks' | 'months'>('hours');
  const [calculatedEndDate, setCalculatedEndDate] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingField, setGeneratingField] = useState<'description' | 'features' | null>(null);
  
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');
  const [newSizeName, setNewSizeName] = useState('');
  const [newFeatureName, setNewFeatureName] = useState('');
  const [newFeatureValue, setNewFeatureValue] = useState('');
  
  const mainImageRef = useRef<HTMLInputElement>(null);
  const galleryImageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const handleGenerateWithAI = async (field: 'description' | 'features') => {
    if (!formData.name) {
      showToast('Primero ingresa el nombre del producto', 'error');
      return;
    }

    setIsGenerating(true);
    setGeneratingField(field);

    await new Promise(resolve => setTimeout(resolve, 500));

    if (field === 'description') {
      const description = generateAIDescription(formData.name);
      setFormData(prev => ({ ...prev, description }));
      showToast('Descripción generada', 'success');
    } else {
      const features = generateAIFeatures(formData.name, formData.features);
      setFormData(prev => ({ ...prev, features }));
      showToast('Características generadas', 'success');
    }

    setIsGenerating(false);
    setGeneratingField(null);
  };

  const handleUpdateVariation = (id: string, field: keyof ProductVariation, value: any) => {
    setFormData(prev => ({
      ...prev,
      variations: prev.variations.map(v => 
        v.id === id ? { ...v, [field]: value } : v
      )
    }));
  };

  const handleRemoveVariation = (id: string) => {
    setFormData(prev => ({
      ...prev,
      variations: prev.variations.filter(v => v.id !== id)
    }));
  };

  const [newVariationName, setNewVariationName] = useState('');
  const [newVariationValue, setNewVariationValue] = useState('');

  const handleAddVariation = () => {
    if (newVariationName.trim() && newVariationValue.trim()) {
      const newVariation: ProductVariation = {
        id: `var_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: newVariationName.trim(),
        value: newVariationValue.trim(),
        stock: 10,
        isActive: true
      };
      setFormData(prev => ({
        ...prev,
        variations: [...prev.variations, newVariation]
      }));
      setNewVariationName('');
      setNewVariationValue('');
      showToast('Variación añadida', 'success');
    }
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        showToast('Comprimiendo imagen...', 'info');
        const base64 = await compressImage(file);
        setFormData(prev => ({ ...prev, image: base64 }));
        showToast('Imagen subida correctamente', 'success');
      } catch (error) {
        showToast('Error al subir imagen', 'error');
      }
    }
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      try {
        showToast('Comprimiendo imágenes...', 'info');
        const newImages: string[] = [];
        for (let i = 0; i < files.length; i++) {
          const base64 = await compressImage(files[i]);
          newImages.push(base64);
        }
        if (newImages.length > 0) {
          setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
          showToast(`${newImages.length} imagen(es) subida(s)`, 'success');
        }
      } catch (error) {
        showToast('Error al subir imágenes', 'error');
      }
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_VIDEO_SIZE) {
        showToast('El video es muy grande (máx 2MB)', 'error');
        return;
      }
      try {
        const reader = new FileReader();
        reader.onload = () => {
          setFormData(prev => ({ ...prev, video: reader.result as string }));
          showToast('Video subido correctamente', 'success');
        };
        reader.onerror = () => showToast('Error al subir video', 'error');
        reader.readAsDataURL(file);
      } catch (error) {
        showToast('Error al subir video', 'error');
      }
    }
  };

  useEffect(() => {
    if (hasOffer) {
      const now = new Date();
      const endDate = new Date(now);
      
      switch (offerUnit) {
        case 'hours':
          endDate.setHours(endDate.getHours() + offerDuration);
          break;
        case 'days':
          endDate.setDate(endDate.getDate() + offerDuration);
          break;
        case 'weeks':
          endDate.setDate(endDate.getDate() + (offerDuration * 7));
          break;
        case 'months':
          endDate.setMonth(endDate.getMonth() + offerDuration);
          break;
      }
      
      setCalculatedEndDate(endDate.toISOString());
    }
  }, [hasOffer, offerDuration, offerUnit]);

  const formatEndDate = () => {
    if (!calculatedEndDate) return '';
    const date = new Date(calculatedEndDate);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleRemoveVideo = () => {
    setFormData(prev => ({ ...prev, video: '' }));
  };

  const handleAddColor = () => {
    if (newColorName.trim()) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, { name: newColorName.trim(), hex: newColorHex }]
      }));
      setNewColorName('');
    }
  };

  const handleRemoveColor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const handleAddSize = () => {
    if (newSizeName.trim()) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, newSizeName.trim()]
      }));
      setNewSizeName('');
    }
  };

  const handleRemoveSize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  const handleAddFeature = () => {
    if (newFeatureName.trim() && newFeatureValue.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, { name: newFeatureName.trim(), value: newFeatureValue.trim() }]
      }));
      setNewFeatureName('');
      setNewFeatureValue('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.price) {
      showToast('Por favor completa los campos requeridos', 'error');
      return;
    }

    try {
      const product = {
        ...formData,
        offerEndDate: hasOffer ? calculatedEndDate : undefined,
        offerPrice: hasOffer && formData.offerPrice > 0 ? formData.offerPrice : undefined,
        image: formData.image || (formData.images[0] || ''),
      };

      addProduct(product);
      showToast('Producto creado exitosamente', 'success');
      navigate('/admin/inventory');
    } catch (error) {
      showToast('Error al crear producto', 'error');
    }
  };

  return (
    <div className={`pb-32 lg:pb-10 min-h-screen ${isDark ? 'bg-zinc-950' : 'bg-zinc-50'}`}>
      <header className={`sticky top-0 z-50 backdrop-blur-xl h-14 lg:h-20 flex items-center px-4 lg:px-8 border-b ${
        isDark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-zinc-100'
      }`}>
        <div className="flex items-center gap-3 w-full">
          <button 
            onClick={() => navigate('/admin/inventory')} 
            className={`p-1.5 rounded-full transition-colors ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'}`}
          >
            <ArrowLeft className={`w-5 h-5 ${isDark ? 'text-zinc-400' : 'text-zinc-900'}`} />
          </button>
          <h1 className={`text-lg lg:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>Nuevo Producto</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <main className="py-4 lg:py-12 px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-12">
              <div className="lg:col-span-2 space-y-4 lg:space-y-10">
                {/* Basic Info */}
                <section className={`p-4 lg:p-8 rounded-xl lg:rounded-3xl border shadow-sm space-y-4 lg:space-y-8 ${
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'
                }`}>
                  <h2 className={`text-[10px] lg:text-lg font-black uppercase tracking-widest flex items-center gap-2 lg:gap-3 ${
                    isDark ? 'text-white' : 'text-zinc-900'
                  }`}>
                    <Files className="w-3.5 h-3.5 lg:w-5 lg:h-5 text-primary" />
                    Información General
                  </h2>
                  
                  <div className="space-y-3 lg:space-y-6">
                    <div className="space-y-1">
                      <label className={`text-[7px] lg:text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Nombre del Producto *</label>
                      <input 
                        className={`w-full border rounded-xl h-10 lg:h-16 px-4 lg:px-6 font-bold text-[10px] lg:text-base focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
                          isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                        }`}
                        placeholder="Ej. Jean Slim Fit Azul Profundo" 
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className={`text-[7px] lg:text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Descripción Detallada</label>
                        <button
                          type="button"
                          onClick={() => handleGenerateWithAI('description')}
                          disabled={isGenerating}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] lg:text-xs font-bold transition-all ${
                            isDark 
                              ? 'bg-primary/20 text-primary hover:bg-primary/30' 
                              : 'bg-primary/10 text-primary hover:bg-primary/20'
                          }`}
                        >
                          {isGenerating && generatingField === 'description' ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Sparkles className="w-3 h-3" />
                          )}
                          <span>IA</span>
                        </button>
                      </div>
                      <textarea 
                        className={`w-full border rounded-xl p-3 lg:p-6 font-medium text-[10px] lg:text-base focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none ${
                          isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-600'
                        }`}
                        placeholder="Describe los materiales, ajuste y detalles técnicos..." 
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                  </div>
                </section>

                {/* Category & Price */}
                <section className={`p-4 lg:p-8 rounded-xl lg:rounded-3xl border shadow-sm space-y-4 lg:space-y-8 ${
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'
                }`}>
                  <h2 className={`text-[10px] lg:text-lg font-black uppercase tracking-widest flex items-center gap-2 lg:gap-3 ${
                    isDark ? 'text-white' : 'text-zinc-900'
                  }`}>
                    <Settings2 className="w-3.5 h-3.5 lg:w-5 lg:h-5 text-primary" />
                    Categorización y Precio
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-8">
                    <div className="space-y-1">
                      <label className={`text-[7px] lg:text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Categoría *</label>
                      <select 
                        className={`w-full border rounded-xl h-10 lg:h-16 px-4 lg:px-6 font-bold text-[10px] lg:text-base focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none ${
                          isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                        }`}
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        required
                      >
                        <option value="">Seleccionar categoría</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-1">
                      <label className={`text-[7px] lg:text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Precio de Venta (COP) *</label>
                      <div className="relative">
                        <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-black ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>$</span>
                        <input 
                          className={`w-full border rounded-xl h-10 lg:h-16 pl-8 pr-4 font-black text-[10px] lg:text-base focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
                            isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                          }`}
                          placeholder="0" 
                          type="text"
                          value={formData.price ? formatPriceCOP(formData.price) : ''}
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/\./g, '').replace(',', '.');
                            const numValue = parseFloat(rawValue) || 0;
                            setFormData(prev => ({ ...prev, price: numValue }));
                          }}
                          onFocus={(e) => {
                            if (formData.price === 0) {
                              e.target.select();
                            }
                          }}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className={`text-[7px] lg:text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Marca</label>
                      <input 
                        className={`w-full border rounded-xl h-10 px-4 font-medium text-[10px] lg:text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none ${
                          isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                        }`}
                        placeholder="Marca"
                        value={formData.brand}
                        onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={`text-[7px] lg:text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>SKU</label>
                      <input 
                        className={`w-full border rounded-xl h-10 px-4 font-medium text-[10px] lg:text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none ${
                          isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                        }`}
                        placeholder="SKU-001"
                        value={formData.sku}
                        onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={`text-[7px] lg:text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Peso</label>
                      <input 
                        className={`w-full border rounded-xl h-10 px-4 font-medium text-[10px] lg:text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none ${
                          isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                        }`}
                        placeholder="250g"
                        value={formData.weight}
                        onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={`text-[7px] lg:text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Dimensiones</label>
                      <input 
                        className={`w-full border rounded-xl h-10 px-4 font-medium text-[10px] lg:text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none ${
                          isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                        }`}
                        placeholder="30x20x5cm"
                        value={formData.dimensions}
                        onChange={(e) => setFormData(prev => ({ ...prev, dimensions: e.target.value }))}
                      />
                    </div>
                  </div>
                </section>

                {/* Features */}
                <section className={`p-4 lg:p-8 rounded-xl lg:rounded-3xl border shadow-sm space-y-4 lg:space-y-8 ${
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'
                }`}>
                  <div className="flex items-center justify-between">
                    <h2 className={`text-[10px] lg:text-lg font-black uppercase tracking-widest flex items-center gap-2 lg:gap-3 ${
                      isDark ? 'text-white' : 'text-zinc-900'
                    }`}>
                      <Settings2 className="w-3.5 h-3.5 lg:w-5 lg:h-5 text-primary" />
                      Características del Producto
                    </h2>
                    <button
                      type="button"
                      onClick={() => handleGenerateWithAI('features')}
                      disabled={isGenerating}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[9px] lg:text-xs font-bold transition-all ${
                        isDark 
                          ? 'bg-primary/20 text-primary hover:bg-primary/30' 
                          : 'bg-primary/10 text-primary hover:bg-primary/20'
                      }`}
                    >
                      {isGenerating && generatingField === 'features' ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3" />
                      )}
                      <span>Generar con IA</span>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {formData.features.map((feature, index) => (
                      <div key={index} className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-zinc-800' : 'bg-zinc-50'}`}>
                        <GripVertical className="w-4 h-4 text-zinc-500" />
                        <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-zinc-900'}`}>{feature.name}:</span>
                        <span className={`flex-1 text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{feature.value}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
                          className={`p-1 rounded-lg hover:bg-red-100 transition-colors ${isDark ? 'text-zinc-400 hover:text-red-400' : 'text-zinc-400 hover:text-red-500'}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newFeatureName}
                        onChange={(e) => setNewFeatureName(e.target.value)}
                        placeholder="Nombre (ej. Material)"
                        className={`flex-1 px-3 py-2 border rounded-xl text-[10px] lg:text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none ${
                          isDark ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                        }`}
                      />
                      <input
                        type="text"
                        value={newFeatureValue}
                        onChange={(e) => setNewFeatureValue(e.target.value)}
                        placeholder="Valor (ej. Algodón 100%)"
                        className={`flex-1 px-3 py-2 border rounded-xl text-[10px] lg:text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none ${
                          isDark ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={handleAddFeature}
                        className="px-4 py-2 bg-primary text-white rounded-xl text-[10px] lg:text-sm font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </section>

                {/* Variations */}
                <section className={`p-4 lg:p-8 rounded-xl lg:rounded-3xl border shadow-sm space-y-6 lg:space-y-8 ${
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'
                }`}>
                  <h2 className={`text-[10px] lg:text-lg font-black uppercase tracking-widest flex items-center gap-2 lg:gap-3 ${
                    isDark ? 'text-white' : 'text-zinc-900'
                  }`}>
                    <Palette className="w-3.5 h-3.5 lg:w-5 lg:h-5 text-primary" />
                    Variaciones del Producto
                  </h2>
                  
                  {/* Colors */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Palette className={`w-4 h-4 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
                      <label className={`text-[10px] lg:text-sm font-black uppercase tracking-widest ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Colores</label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.colors.map((color, index) => (
                        <div 
                          key={index}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl border group hover:border-primary transition-all ${
                            isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-100'
                          }`}
                        >
                          <div 
                            className="w-5 h-5 rounded-full border border-zinc-300" 
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className={`text-[10px] lg:text-xs font-bold ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{color.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveColor(index)}
                            className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                              isDark ? 'bg-zinc-700 text-zinc-400 hover:bg-red-900 hover:text-red-400' : 'bg-zinc-100 text-zinc-400 hover:bg-red-100 hover:text-red-500'
                            }`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <input
                        type="text"
                        value={newColorName}
                        onChange={(e) => setNewColorName(e.target.value)}
                        placeholder="Nombre del color"
                        className={`px-3 py-2 rounded-lg border text-[10px] lg:text-xs font-medium focus:outline-none focus:border-primary w-32 ${
                          isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                        }`}
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={newColorHex}
                          onChange={(e) => setNewColorHex(e.target.value)}
                          className={`w-10 h-10 rounded-lg cursor-pointer border ${isDark ? 'border-zinc-600' : 'border-zinc-200'}`}
                        />
                        <button
                          type="button"
                          onClick={handleAddColor}
                          className="px-3 py-2 bg-primary text-white rounded-lg text-[10px] lg:text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors"
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Sizes */}
                  <div className={`space-y-4 pt-4 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
                    <div className="flex items-center gap-2">
                      <Ruler className={`w-4 h-4 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
                      <label className={`text-[10px] lg:text-sm font-black uppercase tracking-widest ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Tallas</label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.sizes.map((size, index) => (
                        <div 
                          key={index}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl border group hover:border-primary transition-all ${
                            isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-100'
                          }`}
                        >
                          <span className={`text-[10px] lg:text-xs font-bold ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{size}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSize(index)}
                            className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                              isDark ? 'bg-zinc-700 text-zinc-400 hover:bg-red-900 hover:text-red-400' : 'bg-zinc-100 text-zinc-400 hover:bg-red-100 hover:text-red-500'
                            }`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSizeName}
                        onChange={(e) => setNewSizeName(e.target.value)}
                        placeholder="Ej. 45, XL, M"
                        className={`px-3 py-2 rounded-lg border text-[10px] lg:text-xs font-medium focus:outline-none focus:border-primary w-32 ${
                          isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={handleAddSize}
                        className="px-3 py-2 bg-primary text-white rounded-lg text-[10px] lg:text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors"
                      >
                        Agregar
                      </button>
                    </div>
                    
                    {/* Size Guide Type */}
                    <div className={`grid grid-cols-2 gap-4 pt-4 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
                      <div className="space-y-1">
                        <label className={`text-[7px] lg:text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Stock</label>
                        <input 
                          type="number"
                          value={formData.stock}
                          onChange={(e) => setFormData(prev => ({ ...prev, stock: Math.max(0, parseInt(e.target.value) || 0) }))}
                          className={`w-full border rounded-xl h-10 lg:h-12 px-4 font-bold text-[10px] lg:text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none ${
                            isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                          }`} 
                          min="0"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className={`text-[7px] lg:text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Tipo de Guía</label>
                        <select
                          value={formData.sizeGuideType}
                          onChange={(e) => setFormData(prev => ({ ...prev, sizeGuideType: e.target.value as 'shoes' | 'clothing' | 'accessories' }))}
                          className={`w-full border rounded-xl h-10 lg:h-12 px-4 font-bold text-[10px] lg:text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none ${
                            isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                          }`}
                        >
                          <option value="shoes">Zapatos</option>
                          <option value="clothing">Ropa</option>
                          <option value="accessories">Accesorios</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Variations Table */}
                  <div className={`pt-4 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <label className={`text-[10px] lg:text-sm font-black uppercase tracking-widest ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                        Variaciones ({formData.variations.length})
                      </label>
                    </div>
                    
                    {/* Add Variation Form */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <input
                        type="text"
                        value={newVariationName}
                        onChange={(e) => setNewVariationName(e.target.value)}
                        placeholder="Nombre (ej. Modelo, Peso, Talla)"
                        className={`flex-1 min-w-32 px-3 py-2 border rounded-lg text-xs font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none ${
                          isDark ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                        }`}
                      />
                      <input
                        type="text"
                        value={newVariationValue}
                        onChange={(e) => setNewVariationValue(e.target.value)}
                        placeholder="Valor (ej. XL, 500g, Premium)"
                        className={`flex-1 min-w-32 px-3 py-2 border rounded-lg text-xs font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none ${
                          isDark ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={handleAddVariation}
                        className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {formData.variations.length > 0 ? (
                      <div className="space-y-2">
                        {formData.variations.map((variation) => (
                          <div key={variation.id} className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-zinc-800' : 'bg-zinc-50'}`}>
                            <button
                              type="button"
                              onClick={() => handleUpdateVariation(variation.id, 'isActive', !variation.isActive)}
                              className={`w-10 h-6 rounded-full transition-all relative ${
                                variation.isActive ? 'bg-primary' : 'bg-zinc-600'
                              }`}
                            >
                              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                                variation.isActive ? 'left-5' : 'left-1'
                              }`} />
                            </button>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{variation.name}</span>
                                <span className={`text-sm ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>:</span>
                                <span className={`text-sm ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{variation.value}</span>
                                {!variation.isActive && (
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-zinc-700 text-zinc-500' : 'bg-zinc-200 text-zinc-400'}`}>
                                    Inactivo
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={variation.stock}
                                onChange={(e) => handleUpdateVariation(variation.id, 'stock', Math.max(0, parseInt(e.target.value) || 0))}
                                className={`w-16 px-2 py-1 border rounded-lg text-center text-xs ${
                                  isDark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-200 text-zinc-900'
                                }`}
                                min="0"
                                placeholder="Stock"
                              />
                              <input
                                type="text"
                                value={variation.price ? formatPriceCOP(variation.price) : ''}
                                onChange={(e) => {
                                  const rawValue = e.target.value.replace(/\./g, '').replace(',', '.');
                                  const numValue = parseFloat(rawValue) || undefined;
                                  handleUpdateVariation(variation.id, 'price', numValue);
                                }}
                                className={`w-20 px-2 py-1 border rounded-lg text-xs ${
                                  isDark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-200 text-zinc-900'
                                }`}
                                placeholder="Precio"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveVariation(variation.id)}
                                className={`p-1.5 rounded-lg hover:bg-red-100 transition-colors ${isDark ? 'text-zinc-500 hover:text-red-400' : 'text-zinc-400 hover:text-red-500'}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`text-center py-6 rounded-xl ${isDark ? 'bg-zinc-800/50' : 'bg-zinc-50'}`}>
                        <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                          Añade variaciones como Modelo, Peso, Talla, etc.
                        </p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Offer Section */}
                <section className={`p-4 lg:p-8 rounded-xl lg:rounded-3xl border shadow-sm space-y-4 lg:space-y-8 transition-all ${
                  hasOffer 
                    ? 'bg-gradient-to-br from-primary/5 to-orange-500/5 border-primary/20' 
                    : isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-100'
                }`}>
                  <h2 className={`text-[10px] lg:text-lg font-black uppercase tracking-widest flex items-center gap-2 lg:gap-3 ${
                    hasOffer ? 'text-primary' : isDark ? 'text-zinc-400' : 'text-zinc-400'
                  }`}>
                    <Zap className="w-3.5 h-3.5 lg:w-5 lg:h-5" />
                    Configurar Oferta
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setHasOffer(!hasOffer)}
                        className={`relative w-12 h-7 rounded-full transition-all ${
                          hasOffer ? 'bg-primary' : isDark ? 'bg-zinc-700' : 'bg-zinc-300'
                        }`}
                      >
                        <span 
                          className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all ${
                            hasOffer ? 'left-6' : 'left-1'
                          }`} 
                        />
                      </button>
                      <label className={`text-[10px] lg:text-sm font-bold ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                        {hasOffer ? 'Oferta activada' : 'Activar oferta para este producto'}
                      </label>
                    </div>

                    {hasOffer && (
                      <div className="space-y-6 animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-6">
                          <div className="space-y-1">
                            <label className={`text-[7px] lg:text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                              <Tag className="w-3 h-3" />
                              Precio en Oferta (COP)
                            </label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-primary">$</span>
                              <input 
                                className={`w-full border-2 border-primary/20 rounded-xl h-10 lg:h-14 pl-8 pr-4 font-black text-primary text-[10px] lg:text-base focus:border-primary focus:ring-0 transition-all outline-none ${
                                  isDark ? 'bg-zinc-800' : 'bg-white'
                                }`}
                                placeholder="0" 
                                type="text"
                                value={formData.offerPrice ? formatPriceCOP(formData.offerPrice) : ''}
                                onChange={(e) => {
                                  const rawValue = e.target.value.replace(/\./g, '').replace(',', '.');
                                  const numValue = parseFloat(rawValue) || 0;
                                  setFormData(prev => ({ ...prev, offerPrice: numValue }));
                                }}
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className={`text-[7px] lg:text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                              <Clock className="w-3 h-3" />
                              Duración de la Oferta
                            </label>
                            <div className="flex gap-2">
                              <input 
                                className={`w-20 border-2 border-primary/20 rounded-xl h-10 lg:h-14 px-3 font-black text-[10px] lg:text-base focus:border-primary focus:ring-0 transition-all outline-none ${
                                  isDark ? 'bg-zinc-800 text-white' : 'bg-white text-zinc-900'
                                }`}
                                type="number"
                                min="1"
                                value={offerDuration}
                                onChange={(e) => setOfferDuration(Math.max(1, parseInt(e.target.value) || 1))}
                              />
                              <select 
                                value={offerUnit}
                                onChange={(e) => setOfferUnit(e.target.value as typeof offerUnit)}
                                className={`flex-1 border-2 border-primary/20 rounded-xl h-10 lg:h-14 px-3 font-medium text-[10px] lg:text-sm focus:border-primary focus:ring-0 transition-all outline-none appearance-none ${
                                  isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-white text-zinc-700'
                                }`}
                              >
                                <option value="hours">Horas</option>
                                <option value="days">Días</option>
                                <option value="weeks">Semanas</option>
                                <option value="months">Meses</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {calculatedEndDate && (
                          <div className={`rounded-xl p-4 border border-primary/10 ${isDark ? 'bg-zinc-800' : 'bg-white'}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-4 h-4 text-primary" />
                              <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                La oferta expirará el:
                              </span>
                            </div>
                            <p className="text-lg font-black text-primary">
                              {formatEndDate()}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* Sidebar */}
              <div className="space-y-4 lg:space-y-8">
                {/* Images */}
                <section className={`p-4 lg:p-8 rounded-xl lg:rounded-3xl border shadow-sm space-y-3 lg:space-y-6 ${
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'
                }`}>
                  <h2 className={`text-[9px] lg:text-sm font-black uppercase tracking-widest flex items-center gap-2 ${
                    isDark ? 'text-white' : 'text-zinc-900'
                  }`}>
                    <ImageIcon className="w-4 h-4 text-primary" />
                    Imágenes
                  </h2>
                  
                  {/* Main Image */}
                  <div className="space-y-2">
                    <label className={`text-[7px] lg:text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Imagen Principal</label>
                    <input
                      type="file"
                      ref={mainImageRef}
                      accept="image/*"
                      onChange={handleMainImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => mainImageRef.current?.click()}
                      className={`w-full py-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors ${
                        isDark ? 'border-zinc-700' : 'border-zinc-200'
                      }`}
                    >
                      {formData.image ? (
                        <div className="w-full aspect-video rounded-lg overflow-hidden">
                          <img src={formData.image} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <>
                          <Camera className={`w-8 h-8 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
                          <span className={`text-xs font-bold ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Subir imagen</span>
                          <span className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>PNG, JPG, WEBP</span>
                        </>
                      )}
                    </button>
                    {formData.image && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                        className={`w-full py-2 rounded-lg text-xs font-bold transition-colors ${
                          isDark ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-50 text-red-500 hover:bg-red-100'
                        }`}
                      >
                        Eliminar imagen
                      </button>
                    )}
                  </div>

                  {/* Additional Images */}
                  <div className={`space-y-2 pt-4 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
                    <label className={`text-[7px] lg:text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Galería de Imágenes ({formData.images.length})</label>
                    <div className="grid grid-cols-3 gap-2">
                      {formData.images.map((img, i) => (
                        <div key={i} className={`relative aspect-square rounded-lg overflow-hidden group ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(i)}
                            className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <input
                        type="file"
                        ref={galleryImageRef}
                        accept="image/*"
                        multiple
                        onChange={handleGalleryImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => galleryImageRef.current?.click()}
                        className={`aspect-square rounded-lg border-2 border-dashed flex items-center justify-center transition-colors ${
                          isDark ? 'border-zinc-700 text-zinc-500 hover:border-primary hover:text-primary' : 'border-zinc-200 text-zinc-300 hover:border-primary hover:text-primary'
                        }`}
                      >
                        <Plus className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </section>

                {/* Video */}
                <section className={`p-4 lg:p-8 rounded-xl lg:rounded-3xl border shadow-sm space-y-3 lg:space-y-6 ${
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'
                }`}>
                  <h2 className={`text-[9px] lg:text-sm font-black uppercase tracking-widest flex items-center gap-2 ${
                    isDark ? 'text-white' : 'text-zinc-900'
                  }`}>
                    <Video className="w-4 h-4 text-primary" />
                    Video del Producto
                  </h2>
                  
                  <input
                    type="file"
                    ref={videoRef}
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                  
                  {formData.video ? (
                    <div className="space-y-3">
                      <div className={`relative aspect-video rounded-xl overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                        <video 
                          src={formData.video} 
                          controls 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveVideo}
                        className={`w-full py-2 rounded-xl text-[10px] lg:text-sm font-bold transition-colors flex items-center justify-center gap-2 ${
                          isDark ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-50 text-red-500 hover:bg-red-100'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar Video
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => videoRef.current?.click()}
                      className={`w-full py-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors ${
                        isDark ? 'border-zinc-700' : 'border-zinc-200'
                      }`}
                    >
                      <Upload className={`w-8 h-8 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
                      <span className={`text-xs font-bold ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Subir Video</span>
                      <span className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>MP4, MOV, WEBP</span>
                    </button>
                  )}
                </section>

                {/* Badge Toggle */}
                <section className={`p-4 lg:p-8 rounded-xl lg:rounded-3xl border shadow-sm ${
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'
                }`}>
                  <label className={`flex items-center gap-3 cursor-pointer ${isDark ? 'text-white' : 'text-zinc-700'}`}>
                    <input
                      type="checkbox"
                      checked={formData.isNew}
                      onChange={(e) => setFormData(prev => ({ ...prev, isNew: e.target.checked }))}
                      className="w-5 h-5 rounded border-zinc-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-bold">Marcar como Producto Nuevo</span>
                  </label>
                </section>

                {/* Actions */}
                <div className="flex flex-col gap-2 lg:gap-4">
                  <button 
                    type="submit"
                    className="w-full h-10 lg:h-16 bg-primary text-white rounded-xl text-[9px] lg:text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-zinc-900 transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Guardar Producto
                  </button>
                  <button 
                    type="button"
                    onClick={() => navigate('/admin/inventory')} 
                    className={`w-full h-10 lg:h-16 rounded-xl text-[9px] lg:text-sm font-black uppercase tracking-widest transition-all ${
                      isDark ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                    }`}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
        </main>
      </form>
    </div>
  );
};
