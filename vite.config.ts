import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 如果要兼容 GitHub Pages 子路径部署，请将 base 修改为：
  // base: './',
  server: {
    port: 5178,
    strictPort: false, // 设置为 false，端口被占用时自动尝试下一个可用端口
  }
})
