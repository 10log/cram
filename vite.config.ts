import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ command, mode }) => {
  // Library build mode (npm run build:lib)
  if (mode === 'lib') {
    return {
      plugins: [react()],
      resolve: {
        alias: {
          'react-native': 'react-native-web',
        },
      },
      assetsInclude: ['**/*.vert', '**/*.frag'],
      build: {
        lib: {
          entry: {
            index: path.resolve(__dirname, 'src/lib/index.ts'),
            styles: path.resolve(__dirname, 'src/css/index.ts'),
          },
          formats: ['es'],
          fileName: (format, entryName) => `${entryName}.js`,
        },
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
          // Externalize deps that shouldn't be bundled
          external: [
            'react',
            'react-dom',
            'react/jsx-runtime',
            '@mui/material',
            '@mui/icons-material',
            '@emotion/react',
            '@emotion/styled',
            // Externalize three.js and related packages to avoid conflicts
            // with host app (e.g., Autodesk Forge viewer has its own THREE)
            'three',
            'three-mesh-bvh',
            'three.meshline',
            'zustand',
            'styled-components',
          ],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
            },
          },
        },
      },
      define: {
        'process.env': {},
      },
    };
  }

  // Default: standalone app build
  return {
    plugins: [react()],
    resolve: {
      alias: {
        'react-native': 'react-native-web',
      },
    },
    assetsInclude: ['**/*.vert', '**/*.frag'],
    build: {
      outDir: 'build',
      sourcemap: false,
      rollupOptions: {
        output: {
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
    define: {
      'process.env': {},
    },
  };
});
