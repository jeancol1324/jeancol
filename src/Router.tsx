import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Skeleton } from './components/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load pages
const HomeScreen = lazy(() => import('./pages/HomeScreen').then(m => ({ default: m.HomeScreen })));
const CategoriesScreen = lazy(() => import('./pages/CategoriesScreen').then(m => ({ default: m.CategoriesScreen })));
const OffersScreen = lazy(() => import('./pages/OffersScreen').then(m => ({ default: m.OffersScreen })));
const CartScreen = lazy(() => import('./pages/CartScreen').then(m => ({ default: m.CartScreen })));
const CheckoutScreen = lazy(() => import('./pages/CheckoutScreen').then(m => ({ default: m.CheckoutScreen })));
const ProductDetailScreen = lazy(() => import('./pages/ProductDetailScreen').then(m => ({ default: m.ProductDetailScreen })));

// Admin Pages
const AdminDashboardScreen = lazy(() => import('./pages/Admin/AdminDashboardScreen').then(m => ({ default: m.AdminDashboardScreen })));
const AdminInventoryScreen = lazy(() => import('./pages/Admin/AdminInventoryScreen').then(m => ({ default: m.AdminInventoryScreen })));
const AdminNewProductScreen = lazy(() => import('./pages/Admin/AdminNewProductScreen').then(m => ({ default: m.AdminNewProductScreen })));
const AdminOrdersScreen = lazy(() => import('./pages/Admin/AdminOrdersScreen').then(m => ({ default: m.AdminOrdersScreen })));
const AdminSettingsScreen = lazy(() => import('./pages/Admin/AdminSettingsScreen').then(m => ({ default: m.AdminSettingsScreen })));
const AdminAnalyticsScreen = lazy(() => import('./pages/Admin/AdminAnalyticsScreen').then(m => ({ default: m.AdminAnalyticsScreen })));
const AdminNotificationsScreen = lazy(() => import('./pages/Admin/AdminNotificationsScreen').then(m => ({ default: m.AdminNotificationsScreen })));
const AdminProfileScreen = lazy(() => import('./pages/Admin/AdminProfileScreen').then(m => ({ default: m.AdminProfileScreen })));

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
            <Route path="/admin" element={
              <motion.div key="admin-dash" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                <AdminDashboardScreen />
              </motion.div>
            } />
            <Route path="/admin/inventory" element={
              <motion.div key="admin-inv" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                <AdminInventoryScreen />
              </motion.div>
            } />
            <Route path="/admin/new-product" element={
              <motion.div key="admin-new" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                <AdminNewProductScreen />
              </motion.div>
            } />
            <Route path="/admin/orders" element={
              <motion.div key="admin-orders" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                <AdminOrdersScreen />
              </motion.div>
            } />
            <Route path="/admin/settings" element={
              <motion.div key="admin-settings" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                <AdminSettingsScreen />
              </motion.div>
            } />
            <Route path="/admin/analytics" element={
              <motion.div key="admin-analytics" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                <AdminAnalyticsScreen />
              </motion.div>
            } />
            <Route path="/admin/notifications" element={
              <motion.div key="admin-notify" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                <AdminNotificationsScreen />
              </motion.div>
            } />
            <Route path="/admin/profile" element={
              <motion.div key="admin-profile" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                <AdminProfileScreen />
              </motion.div>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </Layout>
  );
};
