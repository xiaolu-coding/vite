import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// 引入 path 包注意两点:
// 1. 为避免类型报错，你需要通过 `pnpm i @types/node -D` 安装类型
// 2. tsconfig.json 中设置 `allowSyntheticDefaultImports: true`，以允许下面的 default 导入方式
// import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // root: path.join(__dirname, 'src'),
  build: {
    manifest: true
  }
})
