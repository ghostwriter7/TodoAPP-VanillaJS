import {
    CalendarGrid,
    CalendarHeader,
    DayTile,
    Dropdown,
    FormControl,
    FormGroup,
    LoadingBar,
    NavBar,
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
import { AuthService, CalendarService, DataSource, Firebase, Injector, Router, TaskService } from "@services/index";
import { onAuthStateChanged } from 'firebase/auth';
import { AuthPage, CalendarPage, NotFoundPage, TasksPage } from "@pages/index";

navigator.serviceWorker?.register('serviceworker.js');

customElements.define('nav-bar', NavBar);
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

addEventListener('DOMContentLoaded', () => {
    Injector.register(Firebase, new Firebase());
    Injector.register(AuthService, new AuthService());
    Injector.register(DataSource, new DataSource());
    Injector.register(Router, new Router());
    Injector.register(TaskService, new TaskService());
    Injector.register(CalendarService, new CalendarService());

    onAuthStateChanged(Injector.resolve(Firebase).auth, (user: User) => {
        Injector.resolve(Router).navigateTo(user ? '/' : '/auth');
        document.querySelector('header').classList[user ? 'remove' : 'add']('d-none');
    });
});

addEventListener('popstate', (event) => {
    event.preventDefault();
    Injector.resolve(Router).navigateTo(event.state.route, false);
});
