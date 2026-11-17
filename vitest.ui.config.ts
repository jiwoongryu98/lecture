import { slideCatalog } from './build/catalog-plugin.ts';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [slideCatalog(), react()],
  test: { environment: 'jsdom', include: ['test-ui/**/*.test.tsx'], setupFiles: ['test-ui/setup.ts'] },
});
