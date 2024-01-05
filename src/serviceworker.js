const bundledAssets = [];
const staticAssets = [
    '/',
    'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100;200;300;400;500;600;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined',
    'https://fonts.gstatic.com/s/materialsymbolsoutlined/v156/kJF1BvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oDMzByHX9rA6RzaxHMPdY43zj-jCxv3fzvRNU22ZXGJpEpjC_1v-p_4MrImHCIJIZrDCvHOej.woff2',
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
