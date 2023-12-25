import Router from "./services/Router.js";
import { TaskForm } from "./components/TaskForm.js";
import { TasksPage } from "./pages/TasksPage.js";
import { TaskList } from "./components/TaskList.js";
import { TaskItem } from "./components/TaskItem.js";
import { FormControl } from "./components/form-control/FormControl.js";
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

navigator.serviceWorker?.register('./serviceworker.js');

customElements.define('form-control', FormControl);
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

customElements.define('tasks-page', TasksPage);
customElements.define('calendar-page', CalendarPage);
customElements.define('not-found-page', NotFound);

window.app = {
    dataSource: new DataSource(),
    router: new Router(),
    taskService: new TaskService(),
    calendarService: new CalendarService()
};

addEventListener('popstate', (event) => {
    event.preventDefault();
    app.router.navigateTo(event.state.route, false);
});

addEventListener('DOMContentLoaded', () => {
    app.router.init();
});
