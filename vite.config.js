import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        outDir: './dist',
        target: 'esnext',
        sourcemap: true,
        copyPublicDir: true,
    }
});
