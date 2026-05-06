import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: '.',
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: format => (format === 'es' ? 'esm/index.js' : 'lib/index.js'),
    },
    emptyOutDir: false,
  },
});
