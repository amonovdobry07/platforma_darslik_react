import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'favicon.svg',
        'apple-touch-icon.png',
        'logo.svg',
        'logo-text.svg'
      ],
      manifest: {
        name: 'Darslik Platforma',
        short_name: 'Darslik',
        description: "Online ta'lim platformasi - Bilim olishning yangi yo'li",
        theme_color: '#10b981',
        background_color: '#0a0a0a',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        lang: 'uz',
        categories: ['education', 'productivity'],
        icons: [
          {
            src: '/web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  
  // ============ BUILD OPTIMIZATSIYA ============
  build: {
    // Chunk hajmini cheklash
    chunkSizeWarningLimit: 1000,
    
    rollupOptions: {
      output: {
        // Manual chunk splitting — kutubxonalarni ajratish
        manualChunks: {
          // React asoslari
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // UI kutubxonalar
          'ui-vendor': ['framer-motion', 'lucide-react', 'sonner'],
          
          // Charts
          'charts-vendor': ['recharts'],
          
          // Forms
          'forms-vendor': ['react-hook-form', 'zod', '@hookform/resolvers'],
          
          // State
          'state-vendor': ['zustand', 'axios'],
        }
      }
    },
    
    // Minify yaxshiroq
    minify: 'esbuild',
    
    // Source map o'chirish (production'da)
    sourcemap: false,
    
    // CSS code split
    cssCodeSplit: true,
  },
  
  server: {
    port: 5173,
    host: true
  }
})