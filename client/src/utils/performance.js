/**
 * Performance utilities for client-side caching and optimization
 * Includes IndexedDB wrapper and responsive image generation
 */

/**
 * IndexedDB Cache Manager
 * Persistent cache for API responses and images
 */
export class CacheManager {
  constructor(dbName = 'RodversCache', storeName = 'cache') {
    this.dbName = dbName;
    this.storeName = storeName;
    this.db = null;
  }

  /**
   * Initialize IndexedDB
   */
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'key' });
        }
      };
    });
  }

  /**
   * Store data in IndexedDB
   */
  async set(key, value, ttl = 3600000) { // Default 1 hour TTL
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);

      const data = {
        key,
        value,
        expiresAt: Date.now() + ttl,
      };

      const request = store.put(data);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(data);
    });
  }

  /**
   * Retrieve data from IndexedDB
   */
  async get(key) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result;

        // Check if cache expired
        if (result && result.expiresAt > Date.now()) {
          resolve(result.value);
        } else {
          // Remove expired cache
          if (result) this.delete(key);
          resolve(null);
        }
      };
    });
  }

  /**
   * Delete data from IndexedDB
   */
  async delete(key) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Clear all cache
   */
  async clear() {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

/**
 * Generate responsive image URLs for different screen sizes
 */
export function generateResponsiveImageSrc(cloudinaryPublicId) {
  if (!cloudinaryPublicId) return '';

  const cloudName = import.meta.env.VITE_CLOUDINARY_NAME || 'rodgers';
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;

  return `
    ${baseUrl}/w_400,h_300,c_fill,q_auto,f_auto/${cloudinaryPublicId} 400w,
    ${baseUrl}/w_600,h_450,c_fill,q_auto,f_auto/${cloudinaryPublicId} 600w,
    ${baseUrl}/w_800,h_600,c_fill,q_auto,f_auto/${cloudinaryPublicId} 800w,
    ${baseUrl}/w_1200,h_900,c_fill,q_auto,f_auto/${cloudinaryPublicId} 1200w
  `.trim();
}

/**
 * Prefetch listings data on app load for faster browsing
 */
export async function prefetchListings() {
  const cache = new CacheManager();
  await cache.init();

  try {
    // Check if we already have cached listings
    const cached = await cache.get('listings_home');
    if (cached) return; // Already cached

    // Fetch popular listings
    // Backend listing endpoint is GET /api/listing
    const response = await fetch('/api/listing?limit=10&sort=-createdAt');
    const data = await response.json();

    // Cache for 30 minutes
    await cache.set('listings_home', data, 1800000);
  } catch (error) {
    console.warn('Prefetch failed:', error);
  }
}

/**
 * Measure and log Core Web Vitals
 */
export function measureWebVitals() {
  // Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('🎨 LCP:', lastEntry.renderTime || lastEntry.loadTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Cumulative Layout Shift (CLS)
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        console.log('📍 CLS:', clsValue.toFixed(3));
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // First Input Delay (FID)
      const _fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log('⚡ FID:', entry.processingDuration);
        }
      });
      _fidObserver.observe({ entryTypes: ['first-input'] });
    } catch {
      console.warn('Web Vitals measurement not fully supported');
    }
  }

  // Basic Navigation Timing
  window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log('⏱️  Page Load Time:', pageLoadTime, 'ms');
  });
}

/**
 * Lazy load components with Suspense
 */
export function preloadComponent(componentPath) {
  return import(componentPath);
}

/**
 * Create lazy component with retry logic
 */
export function lazyWithRetry(componentImport) {
  return async () => {
    let retries = 0;
    const maxRetries = 3;

    while (retries < maxRetries) {
      try {
        return await componentImport();
      } catch (error) {
        retries++;
        if (retries === maxRetries) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      }
    }
  };
}

// Export singleton cache manager instance
export const cacheManager = new CacheManager();
