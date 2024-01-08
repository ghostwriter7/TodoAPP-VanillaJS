/// <reference types="vitest" />

import { defineConfig } from 'vite';
import fs from 'fs';
import copy from "rollup-plugin-copy";
import typescript from "@rollup/plugin-typescript";
import { resolve } from "path";

export default defineConfig({
    build: {
        outDir: './dist',
        target: 'esnext',
        sourcemap: true,
        copyPublicDir: true,
        rollupOptions: {
            plugins: [
                typescript(),
                copy({
                    targets: [
                        { src: 'src/serviceworker.js', dest: 'dist' }
                    ],
                    verbose: true,
                    hook: 'writeBundle',
                }),
                {
                    name: 'generate-manifest',
                    generateBundle(options, bundle) {
                        const fileNames = Object.keys(bundle)
                            .map((fileName) => bundle[fileName].fileName)
                            .filter((fileName) => !['html', 'map'].some((extension) => fileName.endsWith(extension)));

                        const manifestContent = JSON.stringify(fileNames, null, 2);

                        fs.writeFileSync('dist/manifest.json', manifestContent, 'utf-8');
                    }
                },
                {
                    name: 'update-service-worker',
                    writeBundle: {
                        sequential: true,
                        order: 'post',
                        handler: () => {
                            const manifest = JSON.parse(fs.readFileSync('dist/manifest.json', 'utf-8'));
                            const serviceWorkerPath = 'dist/serviceworker.js';

                            if (fs.existsSync(serviceWorkerPath)) {
                                let content = fs.readFileSync(serviceWorkerPath, 'utf-8');
                                const assetsDeclaration = 'const bundledAssets = [];';
                                const updatedDeclaration = `const bundledAssets = [${manifest.map((asset) => `'${asset}'`).join(', ')}];`;
                                content = content.replace(assetsDeclaration, updatedDeclaration);

                                const versionIdx = content.indexOf('const version = ') + 'const version = '.length;
                                const version = parseInt(content.substring(versionIdx, versionIdx + 4));
                                content = content.replace(`const version = ${version}`, `const version = ${Math.random()}`);

                                fs.writeFileSync(serviceWorkerPath, content, 'utf-8');
                                fs.rmSync('dist/manifest.json');
                            }
                        }
                    }
                }
            ]
        }
    },
    resolve: {
        alias: [
            { find: "@components", replacement: resolve(__dirname, "./src/components") },
            { find: "@pages", replacement: resolve(__dirname, "./src/pages") },
            { find: "@services", replacement: resolve(__dirname, "./src/services") },
            { find: "@consts", replacement: resolve(__dirname, "./src/consts") },
            { find: "@helpers", replacement: resolve(__dirname, "./src/helpers") },
        ]
    },
    test: {

    }
});
