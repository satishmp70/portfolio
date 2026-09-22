import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8001',
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => proxyReq.removeHeader('origin'));
        }
      }
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        services: resolve(__dirname, 'services/index.html'),
        projects: resolve(__dirname, 'projects/index.html'),
        techStack: resolve(__dirname, 'tech-stack/index.html'),
        estimator: resolve(__dirname, 'estimator/index.html'),
        about: resolve(__dirname, 'about/index.html'),
        contact: resolve(__dirname, 'contact/index.html'),
        caseStudy: resolve(__dirname, 'case-study/index.html'),
        terms: resolve(__dirname, 'terms/index.html'),
        privacy: resolve(__dirname, 'privacy/index.html')
      }
    }
  }
});
