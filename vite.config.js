import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiOrigin = (env.VITE_API_URL || 'http://localhost:5000')
    .replace(/\/+$/, '')
    .replace(/\/api\/v1$/i, '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: apiOrigin,
          changeOrigin: true,
        },
        '/socket.io': {
          target: apiOrigin,
          changeOrigin: true,
          ws: true,
        },
      },
    },
  }
})
