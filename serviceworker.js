import { manifest, version } from '@parcel/service-worker';

self.addEventListener('install', async (event) => {
    const cachePromise = new Promise(async (resolve) => {
        const cache = await caches.open(version);
        await cache.addAll(manifest);
        resolve();
    })
    event.waitUntil(cachePromise);
});

self.addEventListener('fetch', async (event) => {
    const response = new Promise(async (resolve) => {
        const cache = await caches.open(version);
        const response = await cache.match(event.request);
        resolve(response || fetch(event.request));
    });
    event.respondWith(response);
});

self.addEventListener('activate', async (event) => {
    const cleanUp = new Promise(async (resolve) => {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => key !== version && caches.delete(key)));
        resolve();
    });
    event.waitUntil(cleanUp);
});
