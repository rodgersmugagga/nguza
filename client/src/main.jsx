import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { persistor, store } from './redux/store.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { HelmetProvider } from 'react-helmet-async';
import { prefetchHome, prefetchSearch, prefetchCategory, prefetchProduct, prefetchAddProduct, prefetchProfile } from './utils/prefetchRoutes';

// Pre-fill cache for common routes
const initPrefetch = () => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      prefetchHome();
      prefetchSearch();
      prefetchCategory();
      prefetchProduct();
      prefetchAddProduct();
      prefetchProfile();
    });
  }
};

initPrefetch();

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </PersistGate>
  </Provider>
);
