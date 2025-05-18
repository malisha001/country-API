import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/country/', 
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/_test_/setup.js',
  },
});