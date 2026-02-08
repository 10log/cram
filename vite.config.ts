import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

// Plugin to copy jscad-modeling-bundle.js as-is without processing
// Preserves the directory structure so relative imports work
function copyJscadModelingBundle() {
  return {
    name: 'copy-jscad-modeling-bundle',
    writeBundle() {
      const src = path.resolve(__dirname, 'src/compute/modeling/jscad-modeling-bundle.js');
      const destDir = path.resolve(__dirname, 'dist/compute/modeling');
      const dest = path.resolve(destDir, 'jscad-modeling-bundle.js');
      if (existsSync(src)) {
        // Create directory structure
        mkdirSync(destDir, { recursive: true });
        copyFileSync(src, dest);
        console.log('Copied jscad-modeling-bundle.js to dist/compute/modeling/');
      }
    }
  };
}

export default defineConfig(({ command, mode }) => {
  // Library build mode (npm run build:lib)
  if (mode === 'lib') {
    return {
      plugins: [react(), copyJscadModelingBundle()],
      resolve: {
        alias: {
          'react-native': 'react-native-web',
        },
      },
      assetsInclude: ['**/*.vert', '**/*.frag'],
      build: {
        // Use esnext to support top-level await for dynamic jscad import
        target: 'esnext',
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
        commonjsOptions: {
          // Handle circular dependencies in @jscad/modeling
          requireReturnsDefault: 'auto',
          ignoreDynamicRequires: true,
          // Wrap modules to preserve CommonJS circular dependency semantics
          strictRequires: true,
          // Also transform mixed ES/CommonJS modules
          transformMixedEsModules: true,
          // Explicitly include node_modules for CommonJS processing
          include: [/node_modules/],
          // Use named exports for all CommonJS modules
          defaultIsModuleExports: true,
        },
        rollupOptions: {
          // Externalize deps that shouldn't be bundled
          external: [
            // Mark jscad-modeling-bundle as external to preserve esbuild's __commonJS wrappers
            // The copy plugin will copy it to dist as-is
            /jscad-modeling-bundle/,
            'react',
            'react-dom',
            'react/jsx-runtime',
            // Externalize react-is to avoid Symbol mismatch when bundled (causes React #130)
            'react-is',
            'hoist-non-react-statics',
            'prop-types',
            // Use regex to match all @mui subpath imports (e.g., @mui/material/Box)
            /^@mui\/material/,
            /^@mui\/icons-material/,
            /^@mui\/x-tree-view/,
            /^@emotion\//,
            // Note: jscad-modeling-bundle.js is imported in modeling/v2.ts
            'zustand',
            'zustand/react/shallow',
            'styled-components',
            // Externalize FlexLayout (consuming app provides it)
            'flexlayout-react',
            /^flexlayout-react\//,
            // Externalize Blueprint UI (large)
            '@blueprintjs/core',
            '@blueprintjs/icons',
            '@blueprintjs/select',
            '@blueprintjs/table',
            // Externalize charting/visualization libs (large)
            // Use regex to match all subpath imports
            'plotly.js',
            'react-plotly.js',
            'd3',
            /^@visx\/axis/,
            /^@visx\/gradient/,
            /^@visx\/grid/,
            /^@visx\/group/,
            /^@visx\/legend/,
            /^@visx\/responsive/,
            /^@visx\/scale/,
            /^@visx\/shape/,
            /^@visx\/zoom/,
            // Externalize other heavy deps
            'chroma-js',
            'lodash',
            // Externalize three.js (consuming app provides it)
            'three',
            'three-mesh-bvh',
            'three.meshline',
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
