import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], // We only need the React plugin here. Tailwind v3 loads via PostCSS.
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})