import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const repoRoot = path.resolve(fileURLToPath(new URL('../..', import.meta.url)))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, repoRoot, '')
  const port = Number(env.WEB_DEV_PORT || 5273)

  return {
    envDir: repoRoot,
    plugins: [react(), tailwindcss()],
    optimizeDeps: {
      include: [
        'streamdown',
        '@streamdown/code',
        '@streamdown/mermaid',
        '@streamdown/math',
      ],
    },
    server: {
      port,
      strictPort: true,
      proxy: {
        '/api': 'http://localhost:3000',
        '/health': 'http://localhost:3000',
      },
    },
  }
})
