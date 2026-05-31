import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './', // 这一行是为了修复 GitHub Pages 上白屏和路径 404 的问题
  plugins: [react()],
  server: {
    fs: {
      allow: ['..']
    }
  }
})
