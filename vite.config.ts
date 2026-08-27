import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { compression } from 'vite-plugin-compression2';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

/**
 * Vite Production Config — JurisTech Solutions v9.0
 *
 * Optimizations:
 *  • Manual chunk splitting → eliminates 1.3MB monolithic bundle
 *  • Content-hash filenames → unique hash on every build → force cache bust
 *  • Source maps disabled in prod → smaller output + security
 *  • Asset inlining threshold → reduces HTTP requests
 *  • Chunk size warning bumped to 600kB for monitoring
 *  • CDN-ready security headers (CSP, HSTS, X-Frame-Options, Referrer Policy)
 *  • WebP / AVIF asset optimization hints
 *  • Gzip and Brotli compression
 */
export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      webp: {
        quality: 80,
      },
      png: {
        quality: 80,
      },
      jpeg: {
        quality: 80,
      }
    }),
    compression({
      algorithm: 'gzip',
      include: /\.(js|css|html|svg|json)$/,
      threshold: 512,
      deleteOriginalAssets: false,
    }),
    compression({
      algorithm: 'brotliCompress',
      include: /\.(js|css|html|svg|json)$/,
      threshold: 512,
      deleteOriginalAssets: false,
    }),
  ],

  build: {
    rollupOptions: {
      output: {
        entryFileNames:   'assets/[name]-[hash].js',
        chunkFileNames:   'assets/[name]-[hash].js',
        assetFileNames:   'assets/[name]-[hash][extname]',

        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') ||
                id.includes('react-dom') ||
                id.includes('react-router') ||
                id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('i18next') ||
                id.includes('react-i18next')) {
              return 'vendor-i18n';
            }
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('docx')) {
              return 'vendor-docx';
            }
            if (id.includes('html2canvas')) {
              return 'vendor-html2canvas';
            }
            if (id.includes('recharts') ||
                id.includes('d3')) {
              return 'vendor-charts';
            }
            if (id.includes('dompurify') ||
                id.includes('marked')) {
              return 'vendor-sanitize';
            }
          }
        },
      },
    },

    chunkSizeWarningLimit: 1200,
    assetsInlineLimit: 8192,
    sourcemap: false,
    target: 'es2020',
    minify: 'esbuild',
    cssMinify: true,
  },

  esbuild: {
    drop: ['console', 'debugger'],
    legalComments: 'none',
  },

  // ── Dev server with baseline security headers
  server: {
    port: 3000,
    strictPort: false,
    headers: {
      'Cache-Control': 'no-store',
      'X-XSS-Protection': '1; mode=block',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },

  // ── Preview (production-like) with CDN-ready security headers
  preview: {
    port: 4173,
    headers: {
      // HSTS — enforce HTTPS for 1 year across all subdomains
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      // Clickjacking protection
      'X-Frame-Options': 'DENY',
      // Prevent MIME sniffing
      'X-Content-Type-Options': 'nosniff',
      // XSS Protection
      'X-XSS-Protection': '1; mode=block',
      // Referrer Policy
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      // Permissions Policy (disable camera/mic for third parties)
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
      // Content Security Policy
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: blob: https:",
        "connect-src 'self' https://*.supabase.co https://ipapi.co https://api.openai.com https://wa.me",
        "frame-ancestors 'none'",
      ].join('; '),
      // CDN long-term caching for hashed static assets (1 year immutable)
      'Cache-Control': 'public, max-age=31536000, immutable',
      // Prefer modern image formats (WebP / AVIF)
      'Accept': 'image/avif,image/webp,image/png,image/svg+xml,image/*,*/*;q=0.8',
    },
  },

  // ── Optimise deps pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'i18next', 'react-i18next', 'lucide-react'],
  },
});
