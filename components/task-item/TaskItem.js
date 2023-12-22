import { BaseComponent } from "../BaseComponent.js";

export class TaskItem extends BaseComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        this.attachTemplate('task-item');

        const { task, isComplete } = this.task;
        this.querySelector('.task-item__text').textContent = task;

        this.input = this.querySelector('input');
        const label = this.querySelector('label');
        const id = `task-${this.task.id}`;
        label.htmlFor = id;
        this.input.id = id;
        this.input.checked = isComplete;
        this.input.name = id;

        this.#handleTaskCompleteChange();
        this.#handleTaskEditInit();
    }

    disconnectedCallback() {
        this.input.removeEventListener('change', this.inputChangeHandler);
        this.editIcon.removeEventListener('click', this.taskEditInitHandler);
    }

    #handleTaskCompleteChange() {
        this.inputChangeHandler = (event) => {
            app.taskService.updateTask(this.task.id, { isComplete: event.currentTarget.checked })
        }
        this.input.addEventListener('change', this.inputChangeHandler);
    }

    #handleTaskEditInit() {
        this.taskEditInitHandler = (event) => {
            const taskEditInitEvent = new Event('apptaskeditinit');
            taskEditInitEvent.payload = { ...this.task };
            dispatchEvent(taskEditInitEvent);
        };
        this.editIcon = this.querySelector('#task-edit');
        this.editIcon.addEventListener('click', this.taskEditInitHandler);
    }
}
