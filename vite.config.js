import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                app: './index.html',
                serviceworker: './serviceworker.js',
            },
            output: {
                entryFileNames: assetInfo => {
                    return assetInfo.name === 'serviceworker'
                        ? '[name].js'
                        : 'assets/[name]-[hash].js'
                }
            },
        },
    },
})
