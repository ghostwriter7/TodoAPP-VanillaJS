import { BaseComponent } from "../BaseComponent.js";

export class TaskList extends BaseComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        this.attachTemplate('task-list');
        this.#render();

        window.addEventListener('apptaskchange', () => {
            this.#render();
        });
    }

    #render() {
        const ul = this.querySelector('ul');
        ul.innerHTML = '';
        const tasks = app.taskService.getTasks(this.date);

        if (tasks.length) {
            tasks.forEach((task) => {
                const taskItem = document.createElement('task-item');
                taskItem.task = task;
                ul.appendChild(taskItem);
            });
        } else {
            ul.innerText = 'You have no tasks for this day';
        }
    }
}
