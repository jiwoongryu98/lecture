import { readFile } from 'node:fs/promises';
import { slideCatalog } from './build/catalog-plugin.ts';
import { defineConfig } from 'vitest/config';
import { cloudflareTest } from '@cloudflare/vitest-plugin';

export default defineConfig({
  plugins: [slideCatalog(), cloudflareTest(async () => ({
    wrangler: { configPath: './wrangler.jsonc' },
    miniflare: {
      bindings: {
        PRESENTER_KEY: 'test-presenter-key',
        COMMENT_PASSWORD: 'test-comment-password',
        TEST_SCHEMA: await readFile(new URL('./schema.sql', import.meta.url), 'utf8'),
      },
    },
  }))],
  test: { include: ['test/**/*.test.ts'], setupFiles: ['./test/setup.ts'], testTimeout: 15000 },
});
