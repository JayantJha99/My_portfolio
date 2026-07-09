import { defineConfig } from 'vite';

export default defineConfig({
  // Hosted on GitHub Pages as a project site: https://jayantjha99.github.io/My_portfolio/
  // Deploying to Vercel / Netlify / Cloudflare Pages instead: change base back to '/'.
  base: '/My_portfolio/',
  build: {
    target: 'es2020',
  },
});
