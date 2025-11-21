import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const wadeUiPath = env.WADE_UI_PATH || '../../shared/shared-ui'

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      hmr: {
        clientPort: 443,
      },
    },
    resolve: {
      alias: {
        '@wade/ui': fileURLToPath(new URL(wadeUiPath, import.meta.url)),
      },
    },
  }
})