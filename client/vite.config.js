import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': { 
        target: 'http://localhost:3000', 
        changeOrigin: true,
        secure: false,
      },
    },
    // Ensure sw.js is served as JavaScript, not HTML
    fs: {
      allow: ['..'],
    },
  },
  plugins: [react()],
  build: {
    // Code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
          'redux': ['redux', 'react-redux', '@reduxjs/toolkit'],
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/storage'],
          'ui': ['tailwindcss'],
        },
      },
    },
    // Minify CSS, JS
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true,
      },
    },
    // CSS code splitting
    cssCodeSplit: true,
    // Source maps for debugging (optional, remove for smaller bundles)
    sourcemap: false,
    // Chunk size warning threshold (bytes)
    chunkSizeWarningLimit: 500,
  },
  optimizeDeps: {
    // Prebundle commonly used dependencies
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-redux',
      '@reduxjs/toolkit',
      'react-helmet-async',
    ],
  },
})
