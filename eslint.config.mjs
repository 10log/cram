// Flat ESLint config (ESLint 9+). Replaces the legacy `eslintConfig` key in
// package.json and `.eslintignore`, which extended `eslint-config-react-app`.
// react-app is eslintrc-only and incompatible with flat config / ESLint 9+,
// so this rebuilds an equivalent setup from the maintained plugins.
//
// Philosophy matches the prior react-app setup: lint surfaces issues as
// WARNINGS (non-blocking) rather than errors, so the migration doesn't turn
// previously-tolerated findings into a wall of errors. Only a couple of
// genuinely-bug-level rules stay as errors. Lint is a local dev aid here; CI
// does not gate on it.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import importX from 'eslint-plugin-import-x';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';

// Collect every rule name enabled by the recommended presets and force it to
// 'warn'. Keeps full modern coverage while preserving react-app's lenient,
// non-blocking severity.
function downgradeToWarn(...configs) {
  const rules = {};
  for (const config of configs.flat()) {
    if (!config || !config.rules) continue;
    for (const name of Object.keys(config.rules)) rules[name] = 'warn';
  }
  return rules;
}

export default tseslint.config(
  // Global ignores (migrated from .eslintignore)
  {
    ignores: [
      '**/*.worker.ts',
      '**/test.ts',
      '**/line3d.ts',
      '**/striped-lodash.ts',
      '**/raytracer/ga/**/*.js',
      '**/raytracer/bvh/**/*.js',
      '**/OrbitControls.js',
      '**/TransformControls.js',
      '**/modified-grid-helper.js',
      'build/**',
      'dist/**',
      'coverage/**',
      'node_modules/**',
    ],
  },

  js.configs.recommended,
  tseslint.configs.recommended,

  {
    files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        ...globals.jest,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'import-x': importX,
      'unused-imports': unusedImports,
    },
    rules: {
      // Soften the recommended presets to warnings (react-app style).
      ...downgradeToWarn(js.configs.recommended, tseslint.configs.recommended),

      // eslint-plugin-react is not used: it does not support ESLint 10, and
      // its only active rule here was jsx-uses-vars, which feeds core
      // no-unused-vars (off below). unused-imports/no-unused-vars delegates
      // to @typescript-eslint/no-unused-vars, which counts JSX references.
      'react-hooks/exhaustive-deps': 'warn',

      // Genuinely bug-level — keep as errors.
      'react-hooks/rules-of-hooks': 'error',
      // eslint-plugin-import-x: maintained fork of eslint-plugin-import,
      // which does not support ESLint 10.
      'import-x/first': 'error',

      // --- Project overrides (migrated verbatim from the old eslintConfig) ---
      'no-unused-expressions': 'off',
      'no-restricted-globals': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'import-x/no-anonymous-default-export': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // --- Noise suppression: parity with react-app's lenient TS setup ---
      // Stylistic modernizers the legacy var-heavy code violates en masse and
      // react-app never enforced — would need a codemod, not lint findings.
      'no-var': 'off',
      'prefer-const': 'off',
      'no-undef': 'off', // TypeScript already resolves identifiers.
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
    },
  },
);
