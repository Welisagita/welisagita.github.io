import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/welisagita.github.io/', // GANTI INI DENGAN NAMA REPOSITORY ANDA
})