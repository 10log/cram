#!/usr/bin/env node
/**
 * Pre-bundles @jscad/modeling with esbuild to properly handle its CommonJS circular dependencies.
 * esbuild handles CommonJS circular dependencies better than Rollup/Vite.
 *
 * This script outputs a single ESM file that can be imported by CRAM's modeling module.
 */

import * as esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function prebundle() {
  console.log('Pre-bundling @jscad/modeling with esbuild...');

  try {
    await esbuild.build({
      entryPoints: [path.join(rootDir, 'node_modules/@jscad/modeling/src/index.js')],
      bundle: true,
      format: 'esm',
      outfile: path.join(rootDir, 'src/compute/modeling/jscad-modeling-bundle.js'),
      platform: 'browser',
      target: 'es2020',
      // Don't externalize anything - bundle everything into one file
      external: [],
      // Handle CommonJS properly
      mainFields: ['main', 'module'],
      // Generate sourcemap for debugging
      sourcemap: true,
      // Minify to reduce size
      minify: false,
      // Keep names for better debugging
      keepNames: true,
    });

    console.log('Successfully pre-bundled @jscad/modeling to src/compute/modeling/jscad-modeling-bundle.js');
  } catch (error) {
    console.error('Failed to pre-bundle @jscad/modeling:', error);
    process.exit(1);
  }
}

prebundle();
