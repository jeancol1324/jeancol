import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Skeleton } from './components/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load pages
const HomeScreen = lazy(() => import('./pages/HomeScreen').then(m => ({ default: m.HomeScreen })));
const CategoriesScreen = lazy(() => import('./pages/CategoriesScreen').then(m => ({ default: m.CategoriesScreen })));
const ProductsScreen = lazy(() => import('./pages/ProductsScreen').then(m => ({ default: m.ProductsScreen })));
const CategoryScreen = lazy(() => import('./pages/CategoryScreen').then(m => ({ default: m.CategoryScreen })));
const OffersScreen = lazy(() => import('./pages/OffersScreen').then(m => ({ default: m.OffersScreen })));
const CartScreen = lazy(() => import('./pages/CartScreen').then(m => ({ default: m.CartScreen })));
const CheckoutScreen = lazy(() => import('./pages/CheckoutScreen').then(m => ({ default: m.CheckoutScreen })));
const ProductDetailScreen = lazy(() => import('./pages/ProductDetailScreen').then(m => ({ default: m.ProductDetailScreen })));

// Admin Pages
const AdminDashboardScreen = lazy(() => import('./pages/Admin/AdminDashboardScreen').then(m => ({ default: m.AdminDashboardScreen })));
const AdminCategoriesScreen = lazy(() => import('./pages/Admin/AdminCategoriesScreen').then(m => ({ default: m.AdminCategoriesScreen })));
const AdminInventoryScreen = lazy(() => import('./pages/Admin/AdminInventoryScreen').then(m => ({ default: m.AdminInventoryScreen })));
const AdminNewProductScreen = lazy(() => import('./pages/Admin/AdminNewProductScreen').then(m => ({ default: m.AdminNewProductScreen })));
const AdminOrdersScreen = lazy(() => import('./pages/Admin/AdminOrdersScreen').then(m => ({ default: m.AdminOrdersScreen })));
const AdminSettingsScreen = lazy(() => import('./pages/Admin/AdminSettingsScreen').then(m => ({ default: m.AdminSettingsScreen })));
const AdminAnalyticsScreen = lazy(() => import('./pages/Admin/AdminAnalyticsScreen').then(m => ({ default: m.AdminAnalyticsScreen })));
const AdminNotificationsScreen = lazy(() => import('./pages/Admin/AdminNotificationsScreen').then(m => ({ default: m.AdminNotificationsScreen })));
const AdminProfileScreen = lazy(() => import('./pages/Admin/AdminProfileScreen').then(m => ({ default: m.AdminProfileScreen })));
const AdminThemeScreen = lazy(() => import('./pages/Admin/AdminThemeScreen').then(m => ({ default: m.AdminThemeScreen })));
const AdminReviewsScreen = lazy(() => import('./pages/Admin/AdminReviewsScreen').then(m => ({ default: m.AdminReviewsScreen })));
const AdminCouponsScreen = lazy(() => import('./pages/Admin/AdminCouponsScreen').then(m => ({ default: m.AdminCouponsScreen })));
const AdminHomeEditorScreen = lazy(() => import('./pages/Admin/AdminHomeEditorScreen').then(m => ({ default: m.AdminHomeEditorScreen })));
const AdminLoginScreen = lazy(() => import('./pages/Admin/AdminLoginScreen').then(m => ({ default: m.AdminLoginScreen })));

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem('adminAuthenticated');
    setIsAuthenticated(auth === 'true');
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

export const Router = () => {
  const location = useLocation();

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    duration: 0.4,
    ease: [0.22, 1, 0.36, 1]
  };

  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <Routes location={location}>
            {/* Store Routes */}
            <Route path="/" element={
              <motion.div key="home" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                <HomeScreen />
              </motion.div>
            } />
            <Route path="/categories" element={
              <motion.div key="categories" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                <CategoriesScreen />
              </motion.div>
            } />
            <Route path="/products" element={
              <motion.div key="products" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                <ProductsScreen />
              </motion.div>
            } />
            <Route path="/category/:categoryId" element={
              <motion.div key="category" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                <CategoryScreen />
              </motion.div>
            } />
            <Route path="/offers" element={
              <motion.div key="offers" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                <OffersScreen />
              </motion.div>
            } />
            <Route path="/cart" element={
              <motion.div key="cart" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                <CartScreen />
              </motion.div>
            } />
            <Route path="/checkout" element={
              <motion.div key="checkout" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                <CheckoutScreen />
              </motion.div>
            } />
            <Route path="/product/:id" element={
              <motion.div key="product" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                <ProductDetailScreen />
              </motion.div>
            } />

            {/* Admin Routes */}
            <Route path="/admin/login" element={
              <motion.div key="admin-login" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                <AdminLoginScreen />
              </motion.div>
            } />
            <Route path="/admin" element={
              <AdminProtectedRoute>
                <motion.div key="admin-dash" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                  <AdminDashboardScreen />
                </motion.div>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/categories" element={
              <AdminProtectedRoute>
                <motion.div key="admin-categories" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                  <AdminCategoriesScreen />
                </motion.div>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/inventory" element={
              <AdminProtectedRoute>
                <motion.div key="admin-inv" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                  <AdminInventoryScreen />
                </motion.div>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/new-product" element={
              <AdminProtectedRoute>
                <motion.div key="admin-new" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                  <AdminNewProductScreen />
                </motion.div>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/orders" element={
              <AdminProtectedRoute>
                <motion.div key="admin-orders" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                  <AdminOrdersScreen />
                </motion.div>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/reviews" element={
              <AdminProtectedRoute>
                <motion.div key="admin-reviews" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                  <AdminReviewsScreen />
                </motion.div>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/coupons" element={
              <AdminProtectedRoute>
                <motion.div key="admin-coupons" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                  <AdminCouponsScreen />
                </motion.div>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <AdminProtectedRoute>
                <motion.div key="admin-settings" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                  <AdminSettingsScreen />
                </motion.div>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/home-editor" element={
              <AdminProtectedRoute>
                <motion.div key="admin-home-editor" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                  <AdminHomeEditorScreen />
                </motion.div>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/analytics" element={
              <AdminProtectedRoute>
                <motion.div key="admin-analytics" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                  <AdminAnalyticsScreen />
                </motion.div>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/notifications" element={
              <AdminProtectedRoute>
                <motion.div key="admin-notify" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                  <AdminNotificationsScreen />
                </motion.div>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/profile" element={
              <AdminProtectedRoute>
                <motion.div key="admin-profile" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                  <AdminProfileScreen />
                </motion.div>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/theme" element={
              <AdminProtectedRoute>
                <motion.div key="admin-theme" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                  <AdminThemeScreen />
                </motion.div>
              </AdminProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </Layout>
  );
};
