const assets = [
    '/',
    'app.js',
    'styles.css',
    'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100;200;300;400;500;600;700&display=swap',
    'https://kit.fontawesome.com/376c1d5471.js',
    'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js',
    'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js',
    'components/BaseComponent.js',
    'components/FormControl.js',
    'components/Calendar.js',
    'components/CalendarHeader.js',
    'components/DayTile.js',
    'components/Dropdown.js',
    'components/ObservableButton.js',
    'components/SortableList.js',
    'components/TaskCounters.js',
    'components/TaskForm.js',
    'components/TaskItem.js',
    'components/TaskList.js',
    'components/TaskSummary.js',
    'consts/events.js',
    'helpers/date.js',
    'pages/CalendarPage.js',
    'pages/NotFound.js',
    'pages/TasksPage.js',
    'services/CalendarService.js',
    'services/DataSource.js',
    'services/Subject.js',
    'services/TaskService.js',
    'services/Router.js',
];

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
