import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const authToken = env.VITE_TAKE_HOME_API_TOKEN || env.TAKE_HOME_API_TOKEN

  return {
    define: {
      'import.meta.env.VITE_TAKE_HOME_API_TOKEN': JSON.stringify(authToken),
    },
    plugins: [react(), tailwindcss()],
  }
})
