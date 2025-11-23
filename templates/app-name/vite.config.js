import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const wadeUiPath = env.WADE_UI_PATH || '../../shared/shared-ui'
  const wadeAuthPath = env.WADE_AUTH_PATH || '../../shared/auth/src/index.js'

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      // 1. Fix for the "www" blockage (Optional locally, but good to keep consistent)
      allowedHosts: true, 
      hmr: {
        clientPort: 443, // If you use HTTPS locally via Caddy, keep this. If localhost:5173, remove or adjust.
      },
      // 2. Fix for accessing files outside /app
      fs: {
        allow: ['..'],
      },
    },
    resolve: {
      alias: {
        '@wade/ui': fileURLToPath(new URL(wadeUiPath, import.meta.url)),
        '@wade/auth': fileURLToPath(new URL(wadeAuthPath, import.meta.url)),
        
        // 3. CRITICAL FIX: Force Shared to use the App's node_modules
        '@directus/sdk': fileURLToPath(new URL('./node_modules/@directus/sdk', import.meta.url)),
      },
    },
    optimizeDeps: {
      include: ['@directus/sdk'],
    },
  }
})