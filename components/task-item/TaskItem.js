import { BaseComponent } from "../BaseComponent.js";

export class TaskItem extends BaseComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        this.attachTemplate('task-item');

        const { task, isComplete } = this.task;
        this.querySelector('.task-item__text').textContent = task;
        this.querySelector('input').checked = isComplete;
    }
}
