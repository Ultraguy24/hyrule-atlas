import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative asset paths allow deployment both at a domain root and under
// https://<user>.github.io/<repository>/ on GitHub Pages.
export default defineConfig({
  base: './',
  plugins: [react()],
});
