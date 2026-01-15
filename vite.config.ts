import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Support React Native Web (kept from webpack config)
      'react-native': 'react-native-web',
    },
  },
  // Treat shader files as static assets that can be imported with ?raw
  assetsInclude: ['**/*.vert', '**/*.frag'],
  build: {
    outDir: 'build',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Match the old webpack output structure
        entryFileNames: 'static/js/[name].[hash].js',
        chunkFileNames: 'static/js/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || '';
          if (name.endsWith('.css')) {
            return 'static/css/[name].[hash][extname]';
          }
          return 'static/media/[name].[hash][extname]';
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  // Define process.env for browser compatibility (some libs expect it)
  define: {
    'process.env': {},
  },
});
