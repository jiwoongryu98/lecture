import { slideCatalog } from './build/catalog-plugin.ts';
import { privateNotes } from './build/private-notes-plugin.ts';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  cacheDir: process.env.PLAYWRIGHT_TEST ? 'node_modules/.vite-playwright'
    : command === 'build' ? 'node_modules/.vite-build' : 'node_modules/.vite-dev',
  appType: 'mpa',
  server: { fs: { deny: [
    '**/.dev.vars', '**/.dev.vars.*', '**/.env', '**/.env.*', '**/*.{crt,pem}', '**/.git/**',
    '**/content/private/**', '**/notes/**', '**/Notes/**',
  ] } },
  plugins: [privateNotes(), slideCatalog(), react()],
}));
