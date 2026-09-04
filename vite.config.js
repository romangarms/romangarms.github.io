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
      // Dev traffic to the leaderboard API goes through Vite so the API origin never sees localhost.
      '/api': {
        target: 'https://autox.romangarms.com',
        changeOrigin: true,
      }
    }
  }
})
