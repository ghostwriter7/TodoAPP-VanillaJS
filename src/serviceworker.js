const bundledAssets = [];
const staticAssets = [
    '/',
    'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100;200;300;400;500;600;700&display=swap',
    'https://kit.fontawesome.com/376c1d5471.js',
    'assets/icon-144.png',
    'assets/icon-512.png',
    'assets/icon-1024.png',
    'assets/screenshot1.png',
    'assets/screenshot2.png',
];

const assets = [...bundledAssets, ...staticAssets];

const version = 1;
const cacheKey = `assets-v${version}`;

self.addEventListener('install', async (event) => {
    console.log('Installing...')
    const cachePromise = new Promise(async (resolve) => {
        const cache = await caches.open(cacheKey);
        await cache.addAll(assets);
        console.log('Cache initialized');
        resolve();
    })
    event.waitUntil(cachePromise);
});

self.addEventListener('fetch', async (event) => {
    const response = new Promise(async (resolve) => {
        const cache = await caches.open(cacheKey);
        const response = await cache.match(event.request);
        console.log(`Request: [${event.request.method}] ${event.request.url} ${response ? 'FOUND' : 'NOT FOUND'}`);
        resolve(response || fetch(event.request));
    });
    event.respondWith(response);
});

self.addEventListener('activate', async (event) => {
    console.log('Activating...');
    const cleanUp = new Promise(async (resolve) => {
        const keys = await caches.keys();
        console.log(`Cache keys: ${keys.join(' ')}`);
        await Promise.all(keys.map((key) => key !== cacheKey && caches.delete(key)));
        resolve();
    });
    event.waitUntil(cleanUp);
});
