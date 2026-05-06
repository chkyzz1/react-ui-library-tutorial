import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '.',
    lib: {
      entry: 'src/index.ts',
      name: 'NimbusUI',
      formats: ['es', 'cjs'],
      fileName: format => (format === 'es' ? 'esm/index.js' : 'lib/index.cjs'),
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@nimbus-ui/utils'],
    },
    cssCodeSplit: true,
    emptyOutDir: false,
  },
});
