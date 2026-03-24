import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Package, Truck, CheckCircle, Clock, XCircle, MoreVertical, Plus, Trash2, Save, Pencil, ChevronDown } from 'lucide-react';
import { AdminNavigation } from '../../components/AdminNavigation';
import { useOrders } from '../../context/OrderContext';
import { useProducts } from '../../context/ProductContext';
import { Order, OrderStatus, OrderItem } from '../../types';
import { formatPriceCOP } from '../../lib/utils';
import { useToast } from '../../context/ToastContext';
import { useLoading } from '../../context/LoadingContext';
import { useTheme } from '../../context/ThemeContext';
import { COLOMBIAN_DEPARTMENTS, getCitiesByDepartment } from '../../data/colombiaData';

type FilterStatus = OrderStatus | 'all';

const STATUS_CONFIG = {
  pending: { label: 'Pendiente', color: 'bg-amber-500', textColor: 'text-amber-500', icon: Clock, nextStatuses: ['processing'] },
  processing: { label: 'Procesando', color: 'bg-blue-500', textColor: 'text-blue-500', icon: Package, nextStatuses: ['shipped'] },
  shipped: { label: 'Enviado', color: 'bg-purple-500', textColor: 'text-purple-500', icon: Truck, nextStatuses: ['delivered'] },
  delivered: { label: 'Entregado', color: 'bg-emerald-500', textColor: 'text-emerald-500', icon: CheckCircle, nextStatuses: [] },
  cancelled: { label: 'Cancelado', color: 'bg-red-500', textColor: 'text-red-500', icon: XCircle, nextStatuses: [] },
};

const PAYMENT_LABELS = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
  contraentrega: 'Contraentrega',
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const EMPTY_ORDER_FORM = {
  customer: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  department: '',
  paymentMethod: 'efectivo' as 'efectivo' | 'transferencia' | 'contraentrega',
  items: [] as OrderItem[],
  notes: '',
};

export const AdminOrdersScreen = () => {
  const { orders, addOrder, updateOrder, updateOrderStatus, deleteOrder, getStats } = useOrders();
  const { products } = useProducts();
  const { showToast } = useToast();
  const { showLoading } = useLoading();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const stats = getStats();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [newOrderForm, setNewOrderForm] = useState(EMPTY_ORDER_FORM);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [selectedNewStatus, setSelectedNewStatus] = useState<OrderStatus | ''>('');
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editOrderForm, setEditOrderForm] = useState<typeof EMPTY_ORDER_FORM | null>(null);

  const filteredOrders = useMemo(() => {
    let result = orders;
    
    if (statusFilter !== 'all') {
      result = result.filter(o => o.status === statusFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(o => 
        o.id.toLowerCase().includes(query) ||
        o.customer.toLowerCase().includes(query) ||
        o.email.toLowerCase().includes(query) ||
        o.phone.includes(query) ||
        o.city.toLowerCase().includes(query)
      );
    }
    
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, statusFilter, searchQuery]);

  const filteredProducts = useMemo(() => {
    let result = products;
    
    if (productCategoryFilter !== 'all') {
      result = result.filter(p => p.category.toLowerCase() === productCategoryFilter.toLowerCase());
    }
    
    if (productSearchQuery) {
      const query = productSearchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.sku?.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [products, productCategoryFilter, productSearchQuery]);

  const uniqueCategories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))];
    return cats.sort();
  }, [products]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    showLoading('Actualizando estado...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    updateOrderStatus(orderId, newStatus);
    setSelectedOrder(null);
    setSelectedNewStatus('');
    showToast(`Estado actualizado a ${STATUS_CONFIG[newStatus].label}`, 'success');
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm('¿Estás seguro de eliminar este pedido?')) {
      deleteOrder(orderId);
      setSelectedOrder(null);
      showToast('Pedido eliminado', 'success');
    }
  };

  const handleStartEditOrder = (order: Order) => {
    if (order.status !== 'pending') {
      showToast('Solo puedes editar pedidos en estado Pendiente', 'error');
      return;
    }
    setEditingOrderId(order.id);
    setEditOrderForm({
      customer: order.customer,
      email: order.email,
      phone: order.phone,
      address: order.address,
      city: order.city,
      department: order.department,
      paymentMethod: order.paymentMethod,
      items: [...order.items],
      notes: order.notes || '',
    });
    setSelectedOrder(null);
  };

  const handleCancelEditOrder = () => {
    setEditingOrderId(null);
    setEditOrderForm(null);
  };

  const handleSaveEditOrder = async () => {
    if (!editingOrderId || !editOrderForm) return;
    
    if (!editOrderForm.customer || !editOrderForm.email || editOrderForm.items.length === 0) {
      showToast('Completa los datos del cliente y añade productos', 'error');
      return;
    }

    showLoading('Guardando pedido...');
    await new Promise(resolve => setTimeout(resolve, 500));

    const subtotal = editOrderForm.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = subtotal >= 350000 ? 0 : 15000;

    updateOrder(editingOrderId, {
      customer: editOrderForm.customer,
      email: editOrderForm.email,
      phone: editOrderForm.phone,
      address: editOrderForm.address,
      city: editOrderForm.city,
      department: editOrderForm.department,
      items: editOrderForm.items,
      subtotal,
      shipping,
      total: subtotal + shipping,
      paymentMethod: editOrderForm.paymentMethod,
      notes: editOrderForm.notes,
      updatedAt: new Date().toISOString(),
    });

    setEditingOrderId(null);
    setEditOrderForm(null);
    showToast('Pedido actualizado', 'success');
  };

  const handleAddProductToOrder = (product: typeof products[0], formType: 'new' | 'edit') => {
    const existingItems = formType === 'new' ? newOrderForm.items : (editOrderForm?.items || []);
    const setForm = formType === 'new' ? setNewOrderForm : setEditOrderForm;
    
    const existingIndex = existingItems.findIndex(item => item.productId === product.id);
    if (existingIndex >= 0) {
      const updatedItems = [...existingItems];
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: updatedItems[existingIndex].quantity + 1,
      };
      setForm(prev => formType === 'new' ? { ...prev, items: updatedItems } : { ...prev!, items: updatedItems });
    } else {
      setForm(prev => formType === 'new' 
        ? { ...prev, items: [...prev.items, { productId: product.id, name: product.name, price: product.offerPrice || product.price, quantity: 1, size: product.sizes?.[0] || 'Única', image: product.image }] }
        : { ...prev!, items: [...prev!.items, { productId: product.id, name: product.name, price: product.offerPrice || product.price, quantity: 1, size: product.sizes?.[0] || 'Única', image: product.image }] }
      );
    }
    setShowProductSelector(false);
  };

  const handleRemoveItemFromOrder = (index: number, formType: 'new' | 'edit') => {
    const setForm = formType === 'new' ? setNewOrderForm : setEditOrderForm;
    setForm(prev => formType === 'new' 
      ? { ...prev, items: prev.items.filter((_, i) => i !== index) }
      : { ...prev!, items: prev!.items.filter((_, i) => i !== index) }
    );
  };

  const handleUpdateItemQuantity = (index: number, quantity: number, formType: 'new' | 'edit') => {
    if (quantity < 1) return;
    const setForm = formType === 'new' ? setNewOrderForm : setEditOrderForm;
    const items = formType === 'new' ? newOrderForm.items : (editOrderForm?.items || []);
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], quantity };
    setForm(prev => formType === 'new' ? { ...prev, items: updatedItems } : { ...prev!, items: updatedItems });
  };

  const handleCreateOrder = async () => {
    if (!newOrderForm.customer || !newOrderForm.email || newOrderForm.items.length === 0) {
      showToast('Completa los datos del cliente y añade productos', 'error');
      return;
    }

    showLoading('Creando pedido...');
    await new Promise(resolve => setTimeout(resolve, 500));

    const subtotal = newOrderForm.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = subtotal >= 350000 ? 0 : 15000;

    addOrder({
      customer: newOrderForm.customer,
      email: newOrderForm.email,
      phone: newOrderForm.phone,
      address: newOrderForm.address,
      city: newOrderForm.city,
      department: newOrderForm.department,
      items: newOrderForm.items,
      subtotal,
      shipping,
      total: subtotal + shipping,
      status: 'pending',
      paymentMethod: newOrderForm.paymentMethod,
      notes: newOrderForm.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setShowNewOrderModal(false);
    setNewOrderForm(EMPTY_ORDER_FORM);
    showToast('Pedido creado exitosamente', 'success');
  };

  const getOrderTotal = (form: typeof EMPTY_ORDER_FORM) => {
    const subtotal = form.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = subtotal >= 350000 ? 0 : 15000;
    return subtotal + shipping;
  };

  return (
    <div className={`pb-24 lg:pb-10 flex flex-col lg:flex-row min-h-screen ${isDark ? 'bg-zinc-950' : 'bg-zinc-50/50'}`}>
      <AdminNavigation />
      <div className="flex-1">
        <header className={`sticky top-0 z-40 backdrop-blur-xl h-14 lg:h-20 flex items-center px-4 lg:px-8 ${
          isDark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-zinc-100'
        } border-b`}>
          <div className="flex items-center justify-between w-full">
            <h2 className="text-primary text-lg lg:text-2xl font-black tracking-tighter uppercase">
              PEDIDOS
            </h2>
            <div className="flex items-center gap-3">
              <span className={`text-xs lg:text-sm font-bold ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {stats.total} pedidos
              </span>
              <button
                onClick={() => setShowNewOrderModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 bg-primary text-white rounded-lg lg:rounded-xl text-xs font-bold hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden lg:inline">Nuevo Pedido</span>
              </button>
            </div>
          </div>
        </header>

        <main className="py-3 lg:py-8 px-4 lg:px-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
            <div className="bg-amber-500 p-2 lg:p-4 rounded-xl text-center">
              <p className="text-white/70 text-[8px] lg:text-[10px] font-black uppercase tracking-widest mb-0.5">Pendientes</p>
              <p className="text-white text-sm lg:text-2xl font-black">{stats.pending}</p>
            </div>
            <div className="bg-blue-500 p-2 lg:p-4 rounded-xl text-center">
              <p className="text-white/70 text-[8px] lg:text-[10px] font-black uppercase tracking-widest mb-0.5">Procesando</p>
              <p className="text-white text-sm lg:text-2xl font-black">{stats.processing}</p>
            </div>
            <div className="bg-purple-500 p-2 lg:p-4 rounded-xl text-center">
              <p className="text-white/70 text-[8px] lg:text-[10px] font-black uppercase tracking-widest mb-0.5">Enviados</p>
              <p className="text-white text-sm lg:text-2xl font-black">{stats.shipped}</p>
            </div>
            <div className="bg-emerald-500 p-2 lg:p-4 rounded-xl text-center">
              <p className="text-white/70 text-[8px] lg:text-[10px] font-black uppercase tracking-widest mb-0.5">Entregados</p>
              <p className="text-white text-sm lg:text-2xl font-black">{stats.delivered}</p>
            </div>
          </div>

          {/* Revenue Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 lg:p-6 rounded-xl">
              <p className="text-white/70 text-xs font-black uppercase tracking-widest mb-1">Ingresos Entregados</p>
              <p className="text-white text-2xl lg:text-4xl font-black">${formatPriceCOP(stats.totalRevenue)}</p>
            </div>
            <div className="bg-gradient-to-r from-primary to-orange-600 p-4 lg:p-6 rounded-xl">
              <p className="text-white/70 text-xs font-black uppercase tracking-widest mb-1">Ingresos Pendientes</p>
              <p className="text-white text-2xl lg:text-4xl font-black">${formatPriceCOP(stats.pendingRevenue)}</p>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 lg:gap-6 mb-4 lg:mb-10">
            <div className="relative flex-1 max-w-md">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
              <input 
                type="text" 
                placeholder="Buscar por ID, cliente, email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full border rounded-xl py-2 lg:py-3 pl-9 lg:pl-12 pr-4 text-[9px] lg:text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all shadow-sm ${
                  isDark ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500' : 'bg-white border-zinc-200 text-zinc-900'
                }`}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
              {[
                { key: 'all', label: 'Todos' },
                { key: 'pending', label: 'Pendientes' },
                { key: 'processing', label: 'Procesando' },
                { key: 'shipped', label: 'Enviados' },
                { key: 'delivered', label: 'Entregados' },
                { key: 'cancelled', label: 'Cancelados' },
              ].map((tab) => (
                <button 
                  key={tab.key}
                  onClick={() => setStatusFilter(tab.key as FilterStatus)}
                  className={`px-3 py-1.5 lg:px-6 lg:py-2.5 rounded-full text-[8px] lg:text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                    statusFilter === tab.key 
                      ? isDark ? 'bg-primary text-white' : 'bg-zinc-900 text-white shadow-lg' 
                      : isDark ? 'bg-zinc-800 text-zinc-400 border border-zinc-700' : 'bg-white text-zinc-500 border border-zinc-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Grid */}
          <h3 className={`text-[9px] lg:text-lg font-black uppercase tracking-widest mb-3 lg:mb-6 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            {filteredOrders.length} pedido{filteredOrders.length !== 1 ? 's' : ''}
          </h3>
          
          {filteredOrders.length === 0 ? (
            <div className="text-center py-20">
              <Package className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-zinc-700' : 'text-zinc-300'}`} />
              <p className={`text-lg ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>No se encontraron pedidos</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {filteredOrders.map((order, i) => {
                const statusConfig = STATUS_CONFIG[order.status];
                const StatusIcon = statusConfig.icon;
                
                return (
                  <motion.div 
                    key={order.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className={`p-4 lg:p-6 rounded-xl lg:rounded-2xl shadow-sm hover:shadow-md transition-all ${
                      isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-zinc-100'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] lg:text-sm font-black uppercase ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>#{order.id}</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] lg:text-[10px] font-black uppercase ${statusConfig.color} text-white`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.label}
                          </span>
                        </div>
                        <p className={`text-sm lg:text-lg font-black ${isDark ? 'text-white' : 'text-zinc-900'}`}>{order.customer}</p>
                        <p className={`text-[10px] lg:text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>{order.email}</p>
                      </div>
                      <div className="flex gap-1">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleStartEditOrder(order)}
                            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'}`}
                            title="Editar pedido"
                          >
                            <Pencil className={`w-4 h-4 ${isDark ? 'text-zinc-400' : ''}`} />
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'}`}
                        >
                          <MoreVertical className={`w-5 h-5 ${isDark ? 'text-zinc-400' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Items Preview */}
                    <div className="flex items-center gap-2 mb-4 overflow-hidden">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-lg overflow-hidden flex-shrink-0 ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-lg flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                          <span className={`text-[10px] font-black ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>+{order.items.length - 3}</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0 ml-2">
                        <p className={`text-[10px] lg:text-xs truncate ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
                          {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className={`flex items-center justify-between pt-4 ${isDark ? 'border-t border-zinc-800' : 'border-t border-zinc-100'}`}>
                      <div className="flex items-center gap-4">
                        <span className={`text-[10px] lg:text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                          {formatDate(order.createdAt)}
                        </span>
                        <span className={`text-[10px] lg:text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                          {PAYMENT_LABELS[order.paymentMethod]}
                        </span>
                      </div>
                      <p className="text-sm lg:text-lg font-black text-primary">
                        ${formatPriceCOP(order.total)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteOrder}
            selectedNewStatus={selectedNewStatus}
            setSelectedNewStatus={setSelectedNewStatus}
            isDark={isDark}
          />
        )}
      </AnimatePresence>

      {/* New Order Modal */}
      <AnimatePresence>
        {showNewOrderModal && (
          <OrderFormModal
            title="Nuevo Pedido"
            form={newOrderForm}
            setForm={setNewOrderForm}
            onSubmit={handleCreateOrder}
            onClose={() => {
              setShowNewOrderModal(false);
              setNewOrderForm(EMPTY_ORDER_FORM);
            }}
            showProductSelector={showProductSelector}
            setShowProductSelector={setShowProductSelector}
            onAddProduct={(product) => handleAddProductToOrder(product, 'new')}
            onRemoveItem={(i) => handleRemoveItemFromOrder(i, 'new')}
            onUpdateQuantity={(i, q) => handleUpdateItemQuantity(i, q, 'new')}
            getTotal={() => getOrderTotal(newOrderForm)}
          />
        )}
      </AnimatePresence>

      {/* Edit Order Modal */}
      <AnimatePresence>
        {editingOrderId && editOrderForm && (
          <OrderFormModal
            title="Editar Pedido"
            form={editOrderForm}
            setForm={setEditOrderForm}
            onSubmit={handleSaveEditOrder}
            onClose={handleCancelEditOrder}
            showProductSelector={showProductSelector}
            setShowProductSelector={setShowProductSelector}
            onAddProduct={(product) => handleAddProductToOrder(product, 'edit')}
            onRemoveItem={(i) => handleRemoveItemFromOrder(i, 'edit')}
            onUpdateQuantity={(i, q) => handleUpdateItemQuantity(i, q, 'edit')}
            getTotal={() => getOrderTotal(editOrderForm)}
          />
        )}
      </AnimatePresence>

      {/* Product Selector Modal */}
      <AnimatePresence>
        {showProductSelector && (
          <ProductSelectorModal
            products={filteredProducts}
            uniqueCategories={uniqueCategories}
            searchQuery={productSearchQuery}
            setSearchQuery={setProductSearchQuery}
            categoryFilter={productCategoryFilter}
            setCategoryFilter={setProductCategoryFilter}
            onSelect={(product) => {
              const targetForm = editingOrderId ? 'edit' : 'new';
              handleAddProductToOrder(product, targetForm);
            }}
            onClose={() => {
              setShowProductSelector(false);
              setProductSearchQuery('');
              setProductCategoryFilter('all');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Order Detail Modal Component
const OrderDetailModal = ({ order, onClose, onStatusChange, onDelete, selectedNewStatus, setSelectedNewStatus, isDark }: {
  order: Order;
  onClose: () => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
  onDelete: (id: string) => void;
  selectedNewStatus: OrderStatus | '';
  setSelectedNewStatus: (status: OrderStatus | '') => void;
  isDark: boolean;
}) => {
  const statusConfig = STATUS_CONFIG[order.status];
  const StatusIcon = statusConfig.icon;
  const nextStatuses = statusConfig.nextStatuses;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`relative rounded-3xl p-6 lg:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl ${isDark ? 'bg-zinc-900' : 'bg-white'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'}`}>
              <X className={`w-5 h-5 ${isDark ? 'text-zinc-400' : ''}`} />
            </button>
            <h2 className={`text-xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Pedido #{order.id}
            </h2>
          </div>
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase ${statusConfig.color} text-white`}>
            {React.createElement(StatusIcon, { className: 'w-4 h-4' })}
            {statusConfig.label}
          </span>
        </div>

        {/* Customer Info */}
        <div className={`rounded-xl p-4 mb-6 ${isDark ? 'bg-zinc-800' : 'bg-zinc-50'}`}>
          <h3 className={`text-xs font-black uppercase tracking-widest mb-3 ${isDark ? 'text-zinc-400' : 'text-zinc-400'}`}>Cliente</h3>
          <div className="space-y-2">
            <p className={`font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{order.customer}</p>
            <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{order.email}</p>
            <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{order.phone}</p>
            <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{order.address}</p>
            <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{order.city}, {order.department}</p>
          </div>
        </div>

        {/* Items */}
        <div className="mb-6">
          <h3 className={`text-xs font-black uppercase tracking-widest mb-3 ${isDark ? 'text-zinc-400' : 'text-zinc-400'}`}>Productos</h3>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className={`flex items-center gap-4 p-3 rounded-xl ${isDark ? 'bg-zinc-800' : 'bg-zinc-50'}`}>
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" referrerPolicy="no-referrer" />
                <div className="flex-1">
                  <p className={`font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{item.name}</p>
                  <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>Talla: {item.size} | Cantidad: {item.quantity}</p>
                </div>
                <p className="font-black text-primary">${formatPriceCOP(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className={`rounded-xl p-4 mb-6 ${isDark ? 'bg-zinc-800' : 'bg-zinc-50'}`}>
          <div className={`flex justify-between text-sm mb-2 ${isDark ? 'text-zinc-400' : ''}`}>
            <span className={isDark ? 'text-zinc-400' : 'text-zinc-500'}>Subtotal</span>
            <span className={`font-bold ${isDark ? 'text-white' : ''}`}>${formatPriceCOP(order.subtotal)}</span>
          </div>
          <div className={`flex justify-between text-sm mb-2 ${isDark ? 'text-zinc-400' : ''}`}>
            <span className={isDark ? 'text-zinc-400' : 'text-zinc-500'}>Envío</span>
            <span className={`font-bold ${isDark ? 'text-white' : ''}`}>{order.shipping === 0 ? 'Gratis' : `$${formatPriceCOP(order.shipping)}`}</span>
          </div>
          <div className={`flex justify-between text-lg pt-2 border-t ${isDark ? 'border-zinc-700' : 'border-zinc-200'}`}>
            <span className={`font-black ${isDark ? 'text-white' : 'text-zinc-900'}`}>Total</span>
            <span className="font-black text-primary">${formatPriceCOP(order.total)}</span>
          </div>
          <div className={`mt-3 pt-3 border-t ${isDark ? 'border-zinc-700' : 'border-zinc-200'}`}>
            <span className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>Método de pago: </span>
            <span className={`text-xs font-bold ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{PAYMENT_LABELS[order.paymentMethod]}</span>
          </div>
        </div>

        {/* Status Actions */}
        {nextStatuses.length > 0 && (
          <div className="mb-6">
            <h3 className={`text-xs font-black uppercase tracking-widest mb-3 ${isDark ? 'text-zinc-400' : 'text-zinc-400'}`}>Actualizar Estado</h3>
            <div className="relative">
              <select
                value={selectedNewStatus}
                onChange={(e) => setSelectedNewStatus(e.target.value as OrderStatus)}
                className={`w-full px-4 py-3 border-2 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none cursor-pointer ${
                  isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-zinc-200'
                }`}
              >
                <option value="">Seleccionar nuevo estado...</option>
                {nextStatuses.map((status) => (
                  <option key={status} value={status}>{STATUS_CONFIG[status].label}</option>
                ))}
              </select>
              <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${isDark ? 'text-zinc-400' : 'text-zinc-400'}`} />
            </div>
            {selectedNewStatus && (
              <button
                onClick={() => onStatusChange(order.id, selectedNewStatus)}
                className="mt-3 w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Confirmar: {STATUS_CONFIG[selectedNewStatus].label}</span>
              </button>
            )}
          </div>
        )}

        {order.status === 'pending' && (
          <div className="mb-6">
            <h3 className={`text-xs font-black uppercase tracking-widest mb-3 ${isDark ? 'text-zinc-400' : 'text-zinc-400'}`}>Cancelar Pedido</h3>
            <button
              onClick={() => onStatusChange(order.id, 'cancelled')}
              className={`w-full py-3 rounded-xl font-bold transition-colors ${
                isDark ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-50 text-red-500 hover:bg-red-100'
              }`}
            >
              Cancelar Pedido
            </button>
          </div>
        )}

        {/* Notes */}
        {order.notes && (
          <div className={`rounded-xl p-4 mb-6 ${isDark ? 'bg-amber-900/20 border border-amber-800' : 'bg-amber-50 border border-amber-200'}`}>
            <h3 className={`text-xs font-black uppercase tracking-widest mb-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>Notas</h3>
            <p className={`text-sm ${isDark ? 'text-amber-200' : 'text-amber-800'}`}>{order.notes}</p>
          </div>
        )}

        {/* Timestamps */}
        <div className={`text-[10px] space-y-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
          <p>Creado: {formatDateTime(order.createdAt)}</p>
          <p>Actualizado: {formatDateTime(order.updatedAt)}</p>
        </div>

        {/* Actions */}
        <div className={`flex gap-3 pt-6 mt-6 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
          <button onClick={onClose} className={`flex-1 py-3 rounded-xl font-bold transition-colors ${isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}>
            Cerrar
          </button>
          <button onClick={() => onDelete(order.id)} className={`flex-1 py-3 rounded-xl font-bold transition-colors ${isDark ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-50 text-red-500 hover:bg-red-100'}`}>
            Eliminar
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Order Form Modal Component
const OrderFormModal = ({ title, form, setForm, onSubmit, onClose, showProductSelector, setShowProductSelector, onAddProduct, onRemoveItem, onUpdateQuantity, getTotal }: {
  title: string;
  form: typeof EMPTY_ORDER_FORM;
  setForm: React.Dispatch<React.SetStateAction<typeof EMPTY_ORDER_FORM>>;
  onSubmit: () => void;
  onClose: () => void;
  showProductSelector: boolean;
  setShowProductSelector: (s: boolean) => void;
  onAddProduct: (product: any) => void;
  onRemoveItem: (index: number) => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
  getTotal: () => number;
}) => {
  const cities = form.department ? getCitiesByDepartment(form.department) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-3xl p-6 lg:p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-tight">{title}</h2>
          </div>
        </div>

        {/* Customer Info */}
        <div className="space-y-4 mb-6">
          <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Datos del Cliente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-zinc-500 mb-1">Nombre Completo *</label>
              <input
                type="text"
                value={form.customer}
                onChange={(e) => setForm(prev => ({ ...prev, customer: e.target.value }))}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="Nombre del cliente"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-zinc-500 mb-1">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="email@ejemplo.com"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-zinc-500 mb-1">Teléfono</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="300 123 4567"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-zinc-500 mb-1">Método de Pago</label>
              <select
                value={form.paymentMethod}
                onChange={(e) => setForm(prev => ({ ...prev, paymentMethod: e.target.value as any }))}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              >
                <option value="efectivo">Efectivo</option>
                <option value="transferencia">Transferencia</option>
                <option value="contraentrega">Contraentrega</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-zinc-500 mb-1">Dirección</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="Calle, número, apartamento"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-zinc-500 mb-1">Departamento</label>
              <div className="relative">
                <select
                  value={form.department}
                  onChange={(e) => setForm(prev => ({ ...prev, department: e.target.value, city: '' }))}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none"
                >
                  <option value="">Seleccionar...</option>
                  {COLOMBIAN_DEPARTMENTS.map((dept) => (
                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-zinc-500 mb-1">Ciudad</label>
              <div className="relative">
                <select
                  value={form.city}
                  onChange={(e) => setForm(prev => ({ ...prev, city: e.target.value }))}
                  disabled={!form.department}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none disabled:bg-zinc-100 disabled:cursor-not-allowed"
                >
                  <option value="">{form.department ? "Seleccionar..." : "Selecciona departamento primero"}</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Productos</h3>
            <button
              onClick={() => setShowProductSelector(true)}
              className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Añadir
            </button>
          </div>
          
          {form.items.length === 0 ? (
            <div className="text-center py-8 bg-zinc-50 rounded-xl border-2 border-dashed border-zinc-200">
              <Package className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
              <p className="text-sm text-zinc-500">No hay productos añadidos</p>
            </div>
          ) : (
            <div className="space-y-2">
              {form.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-zinc-900 truncate">{item.name}</p>
                    <p className="text-xs text-zinc-500">${formatPriceCOP(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg bg-zinc-200 text-zinc-600 font-bold hover:bg-zinc-300"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-zinc-200 text-zinc-600 font-bold hover:bg-zinc-300"
                    >
                      +
                    </button>
                  </div>
                  <button onClick={() => onRemoveItem(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">Notas</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
            rows={2}
            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
            placeholder="Notas adicionales..."
          />
        </div>

        {/* Total */}
        <div className="bg-zinc-50 rounded-xl p-4 mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-zinc-500">Subtotal</span>
            <span className="font-bold">${formatPriceCOP(form.items.reduce((acc, item) => acc + (item.price * item.quantity), 0))}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-zinc-500">Envío</span>
            <span className="font-bold">
              {getTotal() - form.items.reduce((acc, item) => acc + (item.price * item.quantity), 0) === 0 ? 'Gratis' : `$${formatPriceCOP(getTotal() - form.items.reduce((acc, item) => acc + (item.price * item.quantity), 0))}`}
            </span>
          </div>
          <div className="flex justify-between text-lg pt-2 border-t border-zinc-200">
            <span className="font-black text-zinc-900">Total</span>
            <span className="font-black text-primary">${formatPriceCOP(getTotal())}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 bg-zinc-100 text-zinc-600 rounded-xl font-bold hover:bg-zinc-200 transition-colors">
            Cancelar
          </button>
          <button onClick={onSubmit} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
            <Save className="w-5 h-5" />
            {title}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Product Selector Modal Component
const ProductSelectorModal = ({ products, uniqueCategories, searchQuery, setSearchQuery, categoryFilter, setCategoryFilter, onSelect, onClose }: {
  products: any[];
  uniqueCategories: string[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  categoryFilter: string;
  setCategoryFilter: (c: string) => void;
  onSelect: (product: any) => void;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
    />
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="relative bg-white rounded-3xl p-6 lg:p-8 w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-zinc-900 uppercase tracking-tight">Seleccionar Producto</h2>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${categoryFilter === 'all' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}
          >
            Todos
          </button>
          {uniqueCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${categoryFilter === cat ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-zinc-500 mb-3">{products.length} producto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}</p>

      <div className="flex-1 overflow-y-auto">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
            <p className="text-zinc-500">No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => onSelect(product)}
                className="flex items-center gap-3 p-3 bg-zinc-50 hover:bg-zinc-100 rounded-xl transition-colors text-left"
              >
                <img src={product.image} alt={product.name} className="w-14 h-14 rounded-lg object-cover" referrerPolicy="no-referrer" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-zinc-900 truncate">{product.name}</p>
                  <p className="text-xs text-zinc-500">{product.category} | Stock: {product.stock || 0}</p>
                  <p className="text-sm font-black text-primary">${formatPriceCOP(product.offerPrice || product.price)}</p>
                </div>
                <Plus className="w-5 h-5 text-zinc-400" />
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  </div>
);
