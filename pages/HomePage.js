import { BaseComponent } from "../components/BaseComponent.js";

export class HomePage extends BaseComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        const taskForm = document.createElement('task-form');
        this.appendChild(taskForm);

        const taskList = document.createElement('task-list');
        this.appendChild(taskList);
    }
}
