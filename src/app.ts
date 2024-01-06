import Router from "./services/Router";
import { TaskForm } from "./components/TaskForm";
import { TasksPage } from "./pages/TasksPage";
import { TaskList } from "./components/TaskList";
import { TaskItem } from "./components/task-item/TaskItem";
import { FormControl } from "./components/form-control/FormControl";
import { TaskService } from "./services/TaskService";
import { DataSource } from "./services/DataSource";
import { CalendarPage } from "./pages/CalendarPage";
import { CalendarGrid } from "./components/calendar-grid/CalendarGrid";
import { DayTile } from "./components/DayTile";
import { NotFoundPage } from "./pages/not-found-page/NotFoundPage";
import { TaskSummary } from "./components/task-summary/TaskSummary";
import { CalendarHeader } from "./components/callendar-header/CalendarHeader";
import { CalendarService } from "./services/CalendarService";
import { Dropdown } from "./components/Dropdown";
import { ObservableButton } from "./components/ObservableButton";
import { TaskCounters } from "./components/TaskCounters";
import { SortableList } from "./components/sortable-list/SortableList";
import Firebase from "./services/Firebase";
import { LoadingBar } from "./components/loading-bar/LoadingBar";
import { FormGroup } from "./components/form-group/FormGroup";
import { RateSelector } from "./components/rate-selector/RateSelector";
import { onAuthStateChanged } from 'firebase/auth';
import { AuthPage } from "./pages/auth-page/AuthPage";
import { AuthService } from "./services/AuthService";

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

onAuthStateChanged(Firebase.auth, (user) => {
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
