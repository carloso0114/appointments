import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    // Configure esbuild to treat .js files with JSX as .jsx files
    loader: {
      '.js': 'jsx'
    }
  }
})