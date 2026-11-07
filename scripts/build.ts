import { generateIcons } from './icons';
import { build } from 'esbuild';
import { cp, mkdir, rm } from 'node:fs/promises';
await generateIcons();
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await cp('public', 'dist', { recursive: true });
await build({ entryPoints: ['src/content.ts'], outfile: 'dist/content.js', bundle: true,
  format: 'iife', target: 'safari16', minify: true });
console.log('Extension tayyor: dist/');
