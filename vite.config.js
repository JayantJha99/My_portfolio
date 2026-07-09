import { defineConfig } from 'vite';

export default defineConfig({
  // Deploying to Vercel / Netlify / Cloudflare Pages: leave base as '/'.
  // Deploying to GitHub Pages under a repo path, set: base: '/<repo-name>/'
  base: '/',
  build: {
    target: 'es2020',
  },
});
