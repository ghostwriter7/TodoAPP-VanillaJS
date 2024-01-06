import {
    CalendarGrid,
    CalendarHeader,
    DayTile,
    Dropdown,
    FormControl,
    FormGroup,
    LoadingBar,
    ObservableButton,
    RateSelector,
    SortableList,
    TaskCounters,
    TaskForm,
    TaskItem,
    TaskList,
    TaskSummary
} from "@components/index";
import type { User } from '@firebase/auth-types';
import { AuthService, CalendarService, DataSource, Router, TaskService } from "@services/index";
import Firebase from "@services/Firebase";
import { onAuthStateChanged } from 'firebase/auth';
import { AuthPage, CalendarPage, NotFoundPage, TasksPage } from "@pages/index";

type App = {
    authService: AuthService,
    dataSource: DataSource,
    router: Router,
    taskService: TaskService,
    calendarService: CalendarService
}

declare global {
    interface Window {
        app: App
    }
}

declare const app: App;

navigator.serviceWorker?.register('serviceworker.js');

customElements.define('form-control', FormControl);
customElements.define('form-group', FormGroup, { extends: 'form' });
customElements.define('rate-selector', RateSelector);
customElements.define('task-form', TaskForm);
customElements.define('task-list', TaskList);
customElements.define('task-item', TaskItem);
customElements.define('task-summary', TaskSummary);
customElements.define('task-counters', TaskCounters);
customElements.define('calendar-grid', CalendarGrid);
customElements.define('calendar-header', CalendarHeader);
customElements.define('day-tile', DayTile);
customElements.define('dropdown-control', Dropdown, { extends: 'select' });
customElements.define('observable-button', ObservableButton, { extends: 'button' });
customElements.define('sortable-list', SortableList, { extends: 'ul' });
customElements.define('loading-bar', LoadingBar);

customElements.define('tasks-page', TasksPage);
customElements.define('calendar-page', CalendarPage);
customElements.define('not-found-page', NotFoundPage);
customElements.define('auth-page', AuthPage);

window.app = {
    authService: new AuthService(Firebase.auth),
    dataSource: new DataSource(),
    router: new Router(Firebase),
    taskService: new TaskService(Firebase),
    calendarService: new CalendarService()
};

onAuthStateChanged(Firebase.auth, (user: User) => {
    app.router.navigateTo(user ? '/' : '/auth');
    document.querySelector('header').classList[user ? 'remove' : 'add']('d-none');
});

let beforeInstallPromptEvent;
const installButton = document.getElementById('install');
addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    beforeInstallPromptEvent = event;
    installButton.classList.remove('d-none');
    installButton.classList.add('d-flex');
});

installButton.addEventListener('click', (event) => {
    beforeInstallPromptEvent.prompt();
});

addEventListener('popstate', (event) => {
    event.preventDefault();
    app.router.navigateTo(event.state.route, false);
});
