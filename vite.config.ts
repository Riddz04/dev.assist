import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    server: {
      proxy: {
        // Proxy npm registry to avoid CORS
        '/api/npm': {
          target: 'https://registry.npmjs.org',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/npm/, '')
        },
        // Proxy MDN API to avoid CORS
        '/api/mdn': {
          target: 'https://developer.mozilla.org',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/mdn/, '')
        },
        // Proxy Dev.to API to avoid CORS
        '/api/devto': {
          target: 'https://dev.to',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/devto/, '')
        }
      }
    },
    define: {
      // Make env variables available to the app
      __APP_ENV__: JSON.stringify(env),
    },
  };
});
