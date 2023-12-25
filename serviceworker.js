const assets = [
    '/',
    'app.js',
    'styles.css',
    'components/form-control/form-control.css',
    'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100;200;300;400;500;600;700&display=swap',
    'https://kit.fontawesome.com/376c1d5471.js',
    'components/BaseComponent.js',
    'components/form-control/FormControl.js',
    'components/Calendar.js',
    'components/CalendarHeader.js',
    'components/DayTile.js',
    'components/Dropdown.js',
    'components/ObservableButton.js',
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
