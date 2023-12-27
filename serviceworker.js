const assets = [
    '/',
    'app.js',
    'styles.css',
    'components/form-control/form-control.css',
    'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100;200;300;400;500;600;700&display=swap',
    'https://kit.fontawesome.com/376c1d5471.js',
    'app.js'
];

const cacheKey = 'assets';

self.addEventListener('install', async (event) => {
    const cachePromise = new Promise(async (resolve) => {
        const cache = await caches.open(cacheKey);
        await cache.addAll(assets);
        resolve();
    })
    event.waitUntil(cachePromise);
});

self.addEventListener('fetch', async (event) => {
    const response = new Promise(async (resolve) => {
        const cache = await caches.open(cacheKey);
        const response = await cache.match(event.request);
        resolve(response || fetch(event.request));
    });
    event.respondWith(response);
});
