import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    include: [
      'src/**/__tests__/**/*.{js,jsx,ts,tsx}',
      'src/**/?(*.)(spec|test).{js,jsx,ts,tsx}',
    ],
    exclude: [
      'node_modules/**',
      'src/__tests__/utils/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/__fixtures__/**',
        'src/__tests__/utils/**',
      ],
      thresholds: {
        branches: 50,
        functions: 50,
        lines: 50,
        statements: 50,
      },
    },
    testTimeout: 10000,
    // Performance tests run separately
    typecheck: {
      enabled: false,
    },
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
  },
});
