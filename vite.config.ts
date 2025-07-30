import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist/ibsheet-vue',
    lib: {
      entry: path.resolve(__dirname, 'src/components/index.ts'),
      name: 'IBSheetVue',
      fileName: (format) => `ibsheet-vue.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' }
      }
    }
  }
})