import { slideCatalog } from './build/catalog-plugin.ts';
import { privateNotes } from './build/private-notes-plugin.ts';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cloudflare } from '@cloudflare/vite-plugin';

export default defineConfig(({ command }) => ({
  cacheDir: process.env.PLAYWRIGHT_TEST ? 'node_modules/.vite-playwright'
    : command === 'build' ? 'node_modules/.vite-build' : 'node_modules/.vite-dev',
  server: { fs: { deny: [
    '**/.dev.vars', '**/.dev.vars.*', '**/.env', '**/.env.*', '**/*.{crt,pem}', '**/.git/**',
    '**/content/private/resume.{tex,pdf}',
    '**/dist/worker/**',
  ] } },
  plugins: [privateNotes(), slideCatalog(), react(), cloudflare({ viteEnvironment: { name: 'worker' } })],
  environments: {
    worker: { build: { sourcemap: true } },
  },
}));
