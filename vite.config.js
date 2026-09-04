import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'

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
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    proxy: {
      // The leaderboard API has no CORS headers and is plain HTTP, so dev traffic goes through Vite.
      '/api': {
        target: 'http://mini.romangarms.com:8321',
        changeOrigin: true,
      }
    }
  }
})
