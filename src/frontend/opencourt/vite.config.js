import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/games': {
          target: `http://${env.VITE_SERVER_HOST}:${env.VITE_SERVER_PORT}`,
          changeOrigin: true,
        },
        '/users': {
          target: `http://${env.VITE_SERVER_HOST}:${env.VITE_SERVER_PORT}`,
          changeOrigin: true,
        },
        '/locations': {
          target: `http://${env.VITE_SERVER_HOST}:${env.VITE_SERVER_PORT}`,
          changeOrigin: true,
        },
        '/games-users': {
          target: `http://${env.VITE_SERVER_HOST}:${env.VITE_SERVER_PORT}`,
          changeOrigin: true,
        }
      }
    }
  }
})