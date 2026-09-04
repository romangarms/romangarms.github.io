import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from romangarms.com/ar/ out of the ar/ folder of this repo's gh-pages branch.
export default defineConfig({
  plugins: [react()],
  base: '/ar/',
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
