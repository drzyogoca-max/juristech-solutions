// vite.config.ts
import { defineConfig } from "file:///C:/Users/pc2/Downloads/project/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/pc2/Downloads/project/node_modules/@vitejs/plugin-react/dist/index.js";
import { compression } from "file:///C:/Users/pc2/Downloads/project/node_modules/vite-plugin-compression2/dist/index.mjs";
import { ViteImageOptimizer } from "file:///C:/Users/pc2/Downloads/project/node_modules/vite-plugin-image-optimizer/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      webp: {
        quality: 80
      },
      png: {
        quality: 80
      },
      jpeg: {
        quality: 80
      }
    }),
    compression({
      algorithm: "gzip",
      include: /\.(js|css|html|svg|json)$/,
      threshold: 512,
      deleteOriginalAssets: false
    }),
    compression({
      algorithm: "brotliCompress",
      include: /\.(js|css|html|svg|json)$/,
      threshold: 512,
      deleteOriginalAssets: false
    })
  ],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
        manualChunks(id) {
          if (id.includes("erpIntegrationService") || id.includes("adCampaignApiConnectors")) {
            return "vendor-erp";
          }
          if (id.includes("swiftVaultService") || id.includes("securityAuditEngine")) {
            return "vendor-crypto";
          }
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom") || id.includes("node_modules/react-router") || id.includes("node_modules/react-router-dom")) {
            return "vendor-react";
          }
          if (id.includes("node_modules/i18next") || id.includes("node_modules/react-i18next")) {
            return "vendor-i18n";
          }
          if (id.includes("node_modules/@supabase")) {
            return "vendor-supabase";
          }
          if (id.includes("node_modules/lucide-react")) {
            return "vendor-icons";
          }
          if (id.includes("node_modules/docx") || id.includes("node_modules/pdf-lib") || id.includes("node_modules/pdfjs-dist") || id.includes("node_modules/jspdf") || id.includes("node_modules/html2canvas")) {
            return "vendor-docs";
          }
          if (id.includes("node_modules/recharts") || id.includes("node_modules/d3") || id.includes("node_modules/victory")) {
            return "vendor-charts";
          }
          if (id.includes("node_modules/react-helmet")) {
            return "vendor-seo";
          }
          if (id.includes("node_modules/dompurify") || id.includes("node_modules/marked") || id.includes("node_modules/isomorphic-dompurify")) {
            return "vendor-sanitize";
          }
          if (id.includes("/pages/admin/") || id.includes("AdminDashboard") || id.includes("AdminAnalytics")) {
            return "page-admin";
          }
          if (id.includes("VaultPage")) {
            return "page-vault";
          }
          if (id.includes("VideoHubPage")) {
            return "page-video-hub";
          }
          if (id.includes("PaymentPage") || id.includes("BinancePay")) {
            return "page-payment";
          }
          if (id.includes("LeadRadarPage") || id.includes("SmartRadarDashboard")) {
            return "page-radar";
          }
          if (id.includes("TemplatesPage") || id.includes("ContractLibraryGate")) {
            return "page-templates";
          }
          if (id.includes("NegotiationPage")) {
            return "page-negotiation";
          }
          if (id.includes("EnterpriseAuditPage") || id.includes("ragEnterpriseAgent")) {
            return "page-enterprise-audit";
          }
          if (id.includes("SocialMarketingPage") || id.includes("socialMarketing") || id.includes("marketingTracker")) {
            return "page-marketing";
          }
          if (id.includes("ContractsPage")) {
            return "page-contracts";
          }
        }
      }
    },
    chunkSizeWarningLimit: 1200,
    assetsInlineLimit: 8192,
    sourcemap: false,
    target: "es2020"
  },
  // ── Dev server with baseline security headers
  server: {
    port: 3e3,
    strictPort: false,
    headers: {
      "Cache-Control": "no-store",
      "X-XSS-Protection": "1; mode=block",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    }
  },
  // ── Preview (production-like) with CDN-ready security headers
  preview: {
    port: 4173,
    headers: {
      // HSTS — enforce HTTPS for 1 year across all subdomains
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
      // Clickjacking protection
      "X-Frame-Options": "DENY",
      // Prevent MIME sniffing
      "X-Content-Type-Options": "nosniff",
      // XSS Protection
      "X-XSS-Protection": "1; mode=block",
      // Referrer Policy
      "Referrer-Policy": "strict-origin-when-cross-origin",
      // Permissions Policy (disable camera/mic for third parties)
      "Permissions-Policy": "camera=(), microphone=(), geolocation=(self)",
      // Content Security Policy
      "Content-Security-Policy": [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: blob: https:",
        "connect-src 'self' https://*.supabase.co https://ipapi.co https://api.openai.com https://wa.me",
        "frame-ancestors 'none'"
      ].join("; "),
      // CDN long-term caching for hashed static assets (1 year immutable)
      "Cache-Control": "public, max-age=31536000, immutable",
      // Prefer modern image formats (WebP / AVIF)
      "Accept": "image/avif,image/webp,image/png,image/svg+xml,image/*,*/*;q=0.8"
    }
  },
  // ── Optimise deps pre-bundling
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "i18next", "react-i18next", "lucide-react"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxwYzJcXFxcRG93bmxvYWRzXFxcXHByb2plY3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHBjMlxcXFxEb3dubG9hZHNcXFxccHJvamVjdFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvcGMyL0Rvd25sb2Fkcy9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHsgY29tcHJlc3Npb24gfSBmcm9tICd2aXRlLXBsdWdpbi1jb21wcmVzc2lvbjInO1xuaW1wb3J0IHsgVml0ZUltYWdlT3B0aW1pemVyIH0gZnJvbSAndml0ZS1wbHVnaW4taW1hZ2Utb3B0aW1pemVyJztcblxuLyoqXG4gKiBWaXRlIFByb2R1Y3Rpb24gQ29uZmlnIFx1MjAxNCBKdXJpc1RlY2ggU29sdXRpb25zIHY5LjBcbiAqXG4gKiBPcHRpbWl6YXRpb25zOlxuICogIFx1MjAyMiBNYW51YWwgY2h1bmsgc3BsaXR0aW5nIFx1MjE5MiBlbGltaW5hdGVzIDEuM01CIG1vbm9saXRoaWMgYnVuZGxlXG4gKiAgXHUyMDIyIENvbnRlbnQtaGFzaCBmaWxlbmFtZXMgXHUyMTkyIHVuaXF1ZSBoYXNoIG9uIGV2ZXJ5IGJ1aWxkIFx1MjE5MiBmb3JjZSBjYWNoZSBidXN0XG4gKiAgXHUyMDIyIFNvdXJjZSBtYXBzIGRpc2FibGVkIGluIHByb2QgXHUyMTkyIHNtYWxsZXIgb3V0cHV0ICsgc2VjdXJpdHlcbiAqICBcdTIwMjIgQXNzZXQgaW5saW5pbmcgdGhyZXNob2xkIFx1MjE5MiByZWR1Y2VzIEhUVFAgcmVxdWVzdHNcbiAqICBcdTIwMjIgQ2h1bmsgc2l6ZSB3YXJuaW5nIGJ1bXBlZCB0byA2MDBrQiBmb3IgbW9uaXRvcmluZ1xuICogIFx1MjAyMiBDRE4tcmVhZHkgc2VjdXJpdHkgaGVhZGVycyAoQ1NQLCBIU1RTLCBYLUZyYW1lLU9wdGlvbnMsIFJlZmVycmVyIFBvbGljeSlcbiAqICBcdTIwMjIgV2ViUCAvIEFWSUYgYXNzZXQgb3B0aW1pemF0aW9uIGhpbnRzXG4gKiAgXHUyMDIyIEd6aXAgYW5kIEJyb3RsaSBjb21wcmVzc2lvblxuICovXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBWaXRlSW1hZ2VPcHRpbWl6ZXIoe1xuICAgICAgd2VicDoge1xuICAgICAgICBxdWFsaXR5OiA4MCxcbiAgICAgIH0sXG4gICAgICBwbmc6IHtcbiAgICAgICAgcXVhbGl0eTogODAsXG4gICAgICB9LFxuICAgICAganBlZzoge1xuICAgICAgICBxdWFsaXR5OiA4MCxcbiAgICAgIH1cbiAgICB9KSxcbiAgICBjb21wcmVzc2lvbih7XG4gICAgICBhbGdvcml0aG06ICdnemlwJyxcbiAgICAgIGluY2x1ZGU6IC9cXC4oanN8Y3NzfGh0bWx8c3ZnfGpzb24pJC8sXG4gICAgICB0aHJlc2hvbGQ6IDUxMixcbiAgICAgIGRlbGV0ZU9yaWdpbmFsQXNzZXRzOiBmYWxzZSxcbiAgICB9KSxcbiAgICBjb21wcmVzc2lvbih7XG4gICAgICBhbGdvcml0aG06ICdicm90bGlDb21wcmVzcycsXG4gICAgICBpbmNsdWRlOiAvXFwuKGpzfGNzc3xodG1sfHN2Z3xqc29uKSQvLFxuICAgICAgdGhyZXNob2xkOiA1MTIsXG4gICAgICBkZWxldGVPcmlnaW5hbEFzc2V0czogZmFsc2UsXG4gICAgfSksXG4gIF0sXG5cbiAgYnVpbGQ6IHtcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6ICAgJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLmpzJyxcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICAgJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLmpzJyxcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICAgJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdW2V4dG5hbWVdJyxcblxuICAgICAgICBtYW51YWxDaHVua3MoaWQpIHtcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ2VycEludGVncmF0aW9uU2VydmljZScpIHx8IGlkLmluY2x1ZGVzKCdhZENhbXBhaWduQXBpQ29ubmVjdG9ycycpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3ZlbmRvci1lcnAnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ3N3aWZ0VmF1bHRTZXJ2aWNlJykgfHwgaWQuaW5jbHVkZXMoJ3NlY3VyaXR5QXVkaXRFbmdpbmUnKSkge1xuICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3ItY3J5cHRvJztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvcmVhY3QnKSB8fFxuICAgICAgICAgICAgICBpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL3JlYWN0LWRvbScpIHx8XG4gICAgICAgICAgICAgIGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvcmVhY3Qtcm91dGVyJykgfHxcbiAgICAgICAgICAgICAgaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9yZWFjdC1yb3V0ZXItZG9tJykpIHtcbiAgICAgICAgICAgIHJldHVybiAndmVuZG9yLXJlYWN0JztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvaTE4bmV4dCcpIHx8XG4gICAgICAgICAgICAgIGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvcmVhY3QtaTE4bmV4dCcpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3ZlbmRvci1pMThuJztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvQHN1cGFiYXNlJykpIHtcbiAgICAgICAgICAgIHJldHVybiAndmVuZG9yLXN1cGFiYXNlJztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvbHVjaWRlLXJlYWN0JykpIHtcbiAgICAgICAgICAgIHJldHVybiAndmVuZG9yLWljb25zJztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvZG9jeCcpIHx8XG4gICAgICAgICAgICAgIGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvcGRmLWxpYicpIHx8XG4gICAgICAgICAgICAgIGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvcGRmanMtZGlzdCcpIHx8XG4gICAgICAgICAgICAgIGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvanNwZGYnKSB8fFxuICAgICAgICAgICAgICBpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL2h0bWwyY2FudmFzJykpIHtcbiAgICAgICAgICAgIHJldHVybiAndmVuZG9yLWRvY3MnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL3JlY2hhcnRzJykgfHxcbiAgICAgICAgICAgICAgaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9kMycpIHx8XG4gICAgICAgICAgICAgIGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvdmljdG9yeScpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3ZlbmRvci1jaGFydHMnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9yZWFjdC1oZWxtZXQnKSkge1xuICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3Itc2VvJztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvZG9tcHVyaWZ5JykgfHxcbiAgICAgICAgICAgICAgaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9tYXJrZWQnKSB8fFxuICAgICAgICAgICAgICBpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL2lzb21vcnBoaWMtZG9tcHVyaWZ5JykpIHtcbiAgICAgICAgICAgIHJldHVybiAndmVuZG9yLXNhbml0aXplJztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCcvcGFnZXMvYWRtaW4vJykgfHwgaWQuaW5jbHVkZXMoJ0FkbWluRGFzaGJvYXJkJykgfHwgaWQuaW5jbHVkZXMoJ0FkbWluQW5hbHl0aWNzJykpIHtcbiAgICAgICAgICAgIHJldHVybiAncGFnZS1hZG1pbic7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnVmF1bHRQYWdlJykpIHtcbiAgICAgICAgICAgIHJldHVybiAncGFnZS12YXVsdCc7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnVmlkZW9IdWJQYWdlJykpIHtcbiAgICAgICAgICAgIHJldHVybiAncGFnZS12aWRlby1odWInO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ1BheW1lbnRQYWdlJykgfHwgaWQuaW5jbHVkZXMoJ0JpbmFuY2VQYXknKSkge1xuICAgICAgICAgICAgcmV0dXJuICdwYWdlLXBheW1lbnQnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ0xlYWRSYWRhclBhZ2UnKSB8fCBpZC5pbmNsdWRlcygnU21hcnRSYWRhckRhc2hib2FyZCcpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3BhZ2UtcmFkYXInO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ1RlbXBsYXRlc1BhZ2UnKSB8fCBpZC5pbmNsdWRlcygnQ29udHJhY3RMaWJyYXJ5R2F0ZScpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3BhZ2UtdGVtcGxhdGVzJztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdOZWdvdGlhdGlvblBhZ2UnKSkge1xuICAgICAgICAgICAgcmV0dXJuICdwYWdlLW5lZ290aWF0aW9uJztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdFbnRlcnByaXNlQXVkaXRQYWdlJykgfHwgaWQuaW5jbHVkZXMoJ3JhZ0VudGVycHJpc2VBZ2VudCcpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3BhZ2UtZW50ZXJwcmlzZS1hdWRpdCc7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnU29jaWFsTWFya2V0aW5nUGFnZScpIHx8IGlkLmluY2x1ZGVzKCdzb2NpYWxNYXJrZXRpbmcnKSB8fCBpZC5pbmNsdWRlcygnbWFya2V0aW5nVHJhY2tlcicpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3BhZ2UtbWFya2V0aW5nJztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdDb250cmFjdHNQYWdlJykpIHtcbiAgICAgICAgICAgIHJldHVybiAncGFnZS1jb250cmFjdHMnO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcblxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMTIwMCxcbiAgICBhc3NldHNJbmxpbmVMaW1pdDogODE5MixcbiAgICBzb3VyY2VtYXA6IGZhbHNlLFxuICAgIHRhcmdldDogJ2VzMjAyMCcsXG4gIH0sXG5cbiAgLy8gXHUyNTAwXHUyNTAwIERldiBzZXJ2ZXIgd2l0aCBiYXNlbGluZSBzZWN1cml0eSBoZWFkZXJzXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDMwMDAsXG4gICAgc3RyaWN0UG9ydDogZmFsc2UsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0NhY2hlLUNvbnRyb2wnOiAnbm8tc3RvcmUnLFxuICAgICAgJ1gtWFNTLVByb3RlY3Rpb24nOiAnMTsgbW9kZT1ibG9jaycsXG4gICAgICAnWC1Db250ZW50LVR5cGUtT3B0aW9ucyc6ICdub3NuaWZmJyxcbiAgICAgICdYLUZyYW1lLU9wdGlvbnMnOiAnREVOWScsXG4gICAgICAnUmVmZXJyZXItUG9saWN5JzogJ3N0cmljdC1vcmlnaW4td2hlbi1jcm9zcy1vcmlnaW4nLFxuICAgIH0sXG4gIH0sXG5cbiAgLy8gXHUyNTAwXHUyNTAwIFByZXZpZXcgKHByb2R1Y3Rpb24tbGlrZSkgd2l0aCBDRE4tcmVhZHkgc2VjdXJpdHkgaGVhZGVyc1xuICBwcmV2aWV3OiB7XG4gICAgcG9ydDogNDE3MyxcbiAgICBoZWFkZXJzOiB7XG4gICAgICAvLyBIU1RTIFx1MjAxNCBlbmZvcmNlIEhUVFBTIGZvciAxIHllYXIgYWNyb3NzIGFsbCBzdWJkb21haW5zXG4gICAgICAnU3RyaWN0LVRyYW5zcG9ydC1TZWN1cml0eSc6ICdtYXgtYWdlPTMxNTM2MDAwOyBpbmNsdWRlU3ViRG9tYWluczsgcHJlbG9hZCcsXG4gICAgICAvLyBDbGlja2phY2tpbmcgcHJvdGVjdGlvblxuICAgICAgJ1gtRnJhbWUtT3B0aW9ucyc6ICdERU5ZJyxcbiAgICAgIC8vIFByZXZlbnQgTUlNRSBzbmlmZmluZ1xuICAgICAgJ1gtQ29udGVudC1UeXBlLU9wdGlvbnMnOiAnbm9zbmlmZicsXG4gICAgICAvLyBYU1MgUHJvdGVjdGlvblxuICAgICAgJ1gtWFNTLVByb3RlY3Rpb24nOiAnMTsgbW9kZT1ibG9jaycsXG4gICAgICAvLyBSZWZlcnJlciBQb2xpY3lcbiAgICAgICdSZWZlcnJlci1Qb2xpY3knOiAnc3RyaWN0LW9yaWdpbi13aGVuLWNyb3NzLW9yaWdpbicsXG4gICAgICAvLyBQZXJtaXNzaW9ucyBQb2xpY3kgKGRpc2FibGUgY2FtZXJhL21pYyBmb3IgdGhpcmQgcGFydGllcylcbiAgICAgICdQZXJtaXNzaW9ucy1Qb2xpY3knOiAnY2FtZXJhPSgpLCBtaWNyb3Bob25lPSgpLCBnZW9sb2NhdGlvbj0oc2VsZiknLFxuICAgICAgLy8gQ29udGVudCBTZWN1cml0eSBQb2xpY3lcbiAgICAgICdDb250ZW50LVNlY3VyaXR5LVBvbGljeSc6IFtcbiAgICAgICAgXCJkZWZhdWx0LXNyYyAnc2VsZidcIixcbiAgICAgICAgXCJzY3JpcHQtc3JjICdzZWxmJyAndW5zYWZlLWlubGluZScgJ3Vuc2FmZS1ldmFsJyBodHRwczovL2Nkbi5qc2RlbGl2ci5uZXRcIixcbiAgICAgICAgXCJzdHlsZS1zcmMgJ3NlbGYnICd1bnNhZmUtaW5saW5lJyBodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tXCIsXG4gICAgICAgIFwiZm9udC1zcmMgJ3NlbGYnIGh0dHBzOi8vZm9udHMuZ3N0YXRpYy5jb21cIixcbiAgICAgICAgXCJpbWctc3JjICdzZWxmJyBkYXRhOiBibG9iOiBodHRwczpcIixcbiAgICAgICAgXCJjb25uZWN0LXNyYyAnc2VsZicgaHR0cHM6Ly8qLnN1cGFiYXNlLmNvIGh0dHBzOi8vaXBhcGkuY28gaHR0cHM6Ly9hcGkub3BlbmFpLmNvbSBodHRwczovL3dhLm1lXCIsXG4gICAgICAgIFwiZnJhbWUtYW5jZXN0b3JzICdub25lJ1wiLFxuICAgICAgXS5qb2luKCc7ICcpLFxuICAgICAgLy8gQ0ROIGxvbmctdGVybSBjYWNoaW5nIGZvciBoYXNoZWQgc3RhdGljIGFzc2V0cyAoMSB5ZWFyIGltbXV0YWJsZSlcbiAgICAgICdDYWNoZS1Db250cm9sJzogJ3B1YmxpYywgbWF4LWFnZT0zMTUzNjAwMCwgaW1tdXRhYmxlJyxcbiAgICAgIC8vIFByZWZlciBtb2Rlcm4gaW1hZ2UgZm9ybWF0cyAoV2ViUCAvIEFWSUYpXG4gICAgICAnQWNjZXB0JzogJ2ltYWdlL2F2aWYsaW1hZ2Uvd2VicCxpbWFnZS9wbmcsaW1hZ2Uvc3ZnK3htbCxpbWFnZS8qLCovKjtxPTAuOCcsXG4gICAgfSxcbiAgfSxcblxuICAvLyBcdTI1MDBcdTI1MDAgT3B0aW1pc2UgZGVwcyBwcmUtYnVuZGxpbmdcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogWydyZWFjdCcsICdyZWFjdC1kb20nLCAncmVhY3Qtcm91dGVyLWRvbScsICdpMThuZXh0JywgJ3JlYWN0LWkxOG5leHQnLCAnbHVjaWRlLXJlYWN0J10sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc1IsU0FBUyxvQkFBb0I7QUFDblQsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsbUJBQW1CO0FBQzVCLFNBQVMsMEJBQTBCO0FBZW5DLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLG1CQUFtQjtBQUFBLE1BQ2pCLE1BQU07QUFBQSxRQUNKLFNBQVM7QUFBQSxNQUNYO0FBQUEsTUFDQSxLQUFLO0FBQUEsUUFDSCxTQUFTO0FBQUEsTUFDWDtBQUFBLE1BQ0EsTUFBTTtBQUFBLFFBQ0osU0FBUztBQUFBLE1BQ1g7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELFlBQVk7QUFBQSxNQUNWLFdBQVc7QUFBQSxNQUNYLFNBQVM7QUFBQSxNQUNULFdBQVc7QUFBQSxNQUNYLHNCQUFzQjtBQUFBLElBQ3hCLENBQUM7QUFBQSxJQUNELFlBQVk7QUFBQSxNQUNWLFdBQVc7QUFBQSxNQUNYLFNBQVM7QUFBQSxNQUNULFdBQVc7QUFBQSxNQUNYLHNCQUFzQjtBQUFBLElBQ3hCLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFFQSxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixnQkFBa0I7QUFBQSxRQUNsQixnQkFBa0I7QUFBQSxRQUNsQixnQkFBa0I7QUFBQSxRQUVsQixhQUFhLElBQUk7QUFDZixjQUFJLEdBQUcsU0FBUyx1QkFBdUIsS0FBSyxHQUFHLFNBQVMseUJBQXlCLEdBQUc7QUFDbEYsbUJBQU87QUFBQSxVQUNUO0FBQ0EsY0FBSSxHQUFHLFNBQVMsbUJBQW1CLEtBQUssR0FBRyxTQUFTLHFCQUFxQixHQUFHO0FBQzFFLG1CQUFPO0FB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
