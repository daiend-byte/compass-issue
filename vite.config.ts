import path from 'node:path';
import { defineConfig } from 'vitest/config';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';

const API_TARGET = 'https://frontend-assessment-630736206587.asia-northeast1.run.app';

// API は CORS ヘッダを返さないため、ブラウザからは同一オリジンの `/api` を叩き、
// dev/preview server がサーバ間通信で実 API へ中継する。
const proxy = {
  '/api': {
    target: API_TARGET,
    changeOrigin: true,
    secure: true,
  },
};

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: { proxy },
  preview: { proxy },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
});
