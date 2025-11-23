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
      allowedHosts: true,
      hmr: {
        clientPort: 443,
      },
      // Add this to help Vite find the dependency
      fs: {
        allow: ['..'],
      },
    },
    resolve: {
      alias: {
        '@wade/ui': fileURLToPath(new URL(wadeUiPath, import.meta.url)),
        '@wade/auth': fileURLToPath(new URL(wadeAuthPath, import.meta.url)),
        
        // --- THE FIX IS HERE ---
        // Force @directus/sdk to resolve to the local node_modules, not the shared folder
        '@directus/sdk': fileURLToPath(new URL('./node_modules/@directus/sdk', import.meta.url)),
      },
    },
    // Ensure Vite optimizes this dependency even though it's inside a linked folder
    optimizeDeps: {
      include: ['@directus/sdk'],
    },
  }
})