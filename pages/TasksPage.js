import { BaseComponent } from "../components/BaseComponent.js";

export class TasksPage extends BaseComponent {
    constructor() {
        super();
    }

    async connectedCallback() {
        this.renderComponent('task-form', { date: this.date });
        await app.taskService.setActiveView(this.date);
        await app.taskService.loadTasks();

        this.renderComponent('task-summary', { date: this.date });
        this.renderComponent('task-list', { date: this.date });
    }
}
