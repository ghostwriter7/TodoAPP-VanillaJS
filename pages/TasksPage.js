import { BaseComponent } from "../components/BaseComponent.js";

export class TasksPage extends BaseComponent {
    constructor() {
        super();
    }

    async connectedCallback() {
        const taskForm = document.createElement('task-form');
        taskForm.date = this.date;
        this.appendChild(taskForm);

        app.taskService.setActiveView(this.date);
        await app.taskService.loadTasks();

        const taskList = document.createElement('task-list');
        taskList.date = this.date;
        this.appendChild(taskList);
    }
}
