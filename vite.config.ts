import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deploys under https://<user>.github.io/coopdle/, so production builds
// need a matching base path. Dev server stays at root.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/coopdle/' : '/',
}))
