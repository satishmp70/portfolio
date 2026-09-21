import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        services: resolve(__dirname, 'services/index.html'),
        industries: resolve(__dirname, 'industries/index.html'),
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
