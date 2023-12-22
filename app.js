import Router from "./services/Router.js";
import { TaskForm } from "./components/task-form/TaskForm.js";
import { HomePage } from "./pages/HomePage.js";
import { TaskList } from "./components/task-list/TaskList.js";
import { TaskItem } from "./components/task-item/TaskItem.js";
import { FormControl } from "./components/form-control/FormControl.js";
import { TaskService } from "./services/TaskService.js";

customElements.define('form-control', FormControl);
customElements.define('task-form', TaskForm);
customElements.define('task-list', TaskList);
customElements.define('task-item', TaskItem);
customElements.define('home-page', HomePage);

window.app = {
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
