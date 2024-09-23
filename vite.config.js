import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000', // Your backend server
        changeOrigin: true,
        secure: false, // If your backend uses HTTPS, set this to true
      }
    }
    
  }
})
