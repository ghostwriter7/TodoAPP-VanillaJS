import { BaseComponent } from "../BaseComponent.js";

export class TaskForm extends BaseComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        this.attachTemplate('task-form');

        this.querySelector('form').addEventListener('submit', (event) => {
            event.preventDefault();
            const taskText = this.querySelector('form-control').root.querySelector('input').value;
            app.taskService.addTask(taskText, new Date().toLocaleDateString());
        });
    }
}
