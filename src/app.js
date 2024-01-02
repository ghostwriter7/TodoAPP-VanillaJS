import Router from "./services/Router.js";
import { TaskForm } from "./components/TaskForm.js";
import { TasksPage } from "./pages/TasksPage.js";
import { TaskList } from "./components/TaskList.js";
import { TaskItem } from "./components/TaskItem.js";
import { FormControl } from "./components/FormControl.js";
import { TaskService } from "./services/TaskService.js";
import { DataSource } from "./services/DataSource.js";
import { CalendarPage } from "./pages/CalendarPage.js";
import { Calendar } from "./components/Calendar.js";
import { DayTile } from "./components/DayTile.js";
import { NotFound } from "./pages/NotFound.js";
import { TaskSummary } from "./components/TaskSummary.js";
import { CalendarHeader } from "./components/CalendarHeader.js";
import { CalendarService } from "./services/CalendarService.js";
import { Dropdown } from "./components/Dropdown.js";
import { ObservableButton } from "./components/ObservableButton.js";
import { TaskCounters } from "./components/TaskCounters.js";
import { SortableList } from "./components/SortableList.js";
import Firebase from "./services/Firebase.js";
import { Loading } from "./components/Loading.js";
import { FormGroup } from "./components/FormGroup.js";
import { RateSelector } from "./components/RateSelector.js";
import { onAuthStateChanged } from 'firebase/auth';
import { AuthPage } from "./pages/AuthPage.js";
import { AuthService } from "./services/AuthService.js";

navigator.serviceWorker?.register('serviceworker.js');

customElements.define('form-control', FormControl);
customElements.define('form-group', FormGroup, { extends: 'form' });
customElements.define('rate-selector', RateSelector);
customElements.define('task-form', TaskForm);
customElements.define('task-list', TaskList);
customElements.define('task-item', TaskItem);
customElements.define('task-summary', TaskSummary);
customElements.define('task-counters', TaskCounters);
customElements.define('calendar-component', Calendar);
customElements.define('calendar-header', CalendarHeader);
customElements.define('day-tile', DayTile);
customElements.define('dropdown-control', Dropdown, { extends: 'select' });
customElements.define('observable-button', ObservableButton, { extends: 'button' });
customElements.define('sortable-list', SortableList, { extends: 'ul' });
customElements.define('loading-bar', Loading);

customElements.define('tasks-page', TasksPage);
customElements.define('calendar-page', CalendarPage);
customElements.define('not-found-page', NotFound);
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
});

installButton.addEventListener('click', (event) => {
    beforeInstallPromptEvent.prompt();
});

addEventListener('popstate', (event) => {
    event.preventDefault();
    app.router.navigateTo(event.state.route, false);
});
