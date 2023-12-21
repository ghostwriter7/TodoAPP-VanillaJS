import Router from "./services/Router.js";
import { TaskForm } from "./components/task-form/TaskForm.js";
import { HomePage } from "./components/HomePage.js";

customElements.define('task-form', TaskForm);
customElements.define('home-page', HomePage);

window.app = {
    router: new Router(),
}

addEventListener('popstate', (event) => {
    event.preventDefault();
    app.router.navigateTo(event.state.route, false);
});

addEventListener('DOMContentLoaded', (event) => {
    app.router.init();
});
