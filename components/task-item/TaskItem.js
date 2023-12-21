import { BaseComponent } from "../BaseComponent.js";

export class TaskItem extends BaseComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        this.attachTemplate('task-item');

        const { task, isComplete } = this.task;
        this.querySelector('.task-item__text').textContent = task;

        const input = this.querySelector('input');
        const label = this.querySelector('label');
        const id = `task-${this.task.id}`;
        label.htmlFor = id;
        input.id = id;
        input.checked = isComplete;
        input.name = id;
    }
}
