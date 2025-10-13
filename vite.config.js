import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-cname',
      closeBundle() {
        copyFileSync('CNAME', 'dist/CNAME')
      }
    }
  ],
  base: './', // Use relative paths for GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    proxy: {
      // Proxy Blogger RSS feed to avoid CORS in development
      '/api/blogger': {
        target: 'https://blog.romangarms.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/blogger/, '/feeds/posts/default'),
        secure: true
      }
    }
  }
})
