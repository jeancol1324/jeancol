import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { CategoryProvider } from './context/CategoryContext';
import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext';
import { LoadingProvider } from './context/LoadingContext';
import { StoreProvider } from './context/StoreContext';
import { ReviewProvider } from './context/ReviewContext';
import { CouponProvider } from './context/CouponContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <ThemeProvider>
          <StoreProvider>
            <LoadingProvider>
              <CartProvider>
                <ToastProvider>
                  <ProductProvider>
                    <CategoryProvider>
                      <OrderProvider>
                        <ReviewProvider>
                          <CouponProvider>
                            <App />
                          </CouponProvider>
                        </ReviewProvider>
                      </OrderProvider>
                    </CategoryProvider>
                  </ProductProvider>
                </ToastProvider>
              </CartProvider>
            </LoadingProvider>
          </StoreProvider>
        </ThemeProvider>
      </HelmetProvider>
    </BrowserRouter>
  </StrictMode>,
);
