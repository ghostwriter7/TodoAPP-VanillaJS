import { BaseComponent } from "../components/BaseComponent.js";

export class TasksPage extends BaseComponent {
    constructor() {
        super();
    }

    async connectedCallback() {
        this.#renderComponent('task-form');
        app.taskService.setActiveView(this.date);
        await app.taskService.loadTasks();

        this.#renderComponent('task-summary');
        this.#renderComponent('task-list');
    }

    #renderComponent(tagName) {
        const component = document.createElement(tagName);
        component.date = this.date;
        this.appendChild(component);
    }

}
