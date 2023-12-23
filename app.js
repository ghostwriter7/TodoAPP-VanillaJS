import Router from "./services/Router.js";
import { TaskForm } from "./components/task-form/TaskForm.js";
import { TasksPage } from "./pages/TasksPage.js";
import { TaskList } from "./components/task-list/TaskList.js";
import { TaskItem } from "./components/task-item/TaskItem.js";
import { FormControl } from "./components/form-control/FormControl.js";
import { TaskService } from "./services/TaskService.js";
import { DataSource } from "./services/DataSource.js";
import { CalendarPage } from "./pages/CalendarPage.js";
import { Calendar } from "./components/calendar/Calendar.js";
import { DayTile } from "./components/calendar/DayTile.js";
import { NotFound } from "./pages/NotFound.js";

customElements.define('form-control', FormControl);
customElements.define('task-form', TaskForm);
customElements.define('task-list', TaskList);
customElements.define('task-item', TaskItem);
customElements.define('calendar-component', Calendar);
customElements.define('day-tile', DayTile);

customElements.define('tasks-page', TasksPage);
customElements.define('calendar-page', CalendarPage);
customElements.define('not-found-page', NotFound);

window.app = {
    dataSource: new DataSource(),
    router: new Router(),
    taskService: new TaskService()
};

addEventListener('popstate', (event) => {
    event.preventDefault();
    app.router.navigateTo(event.state.route, false);
});

addEventListener('DOMContentLoaded', (event) => {
    app.router.init();
});
