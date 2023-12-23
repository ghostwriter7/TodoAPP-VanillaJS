import { BaseComponent } from "./BaseComponent.js";

export class TaskItem extends BaseComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        this.attachTemplate('task-item');
        this.querySelector('.task-item__text').textContent = this.task.task;
        this.#hookUpTaskCompleteCheckbox();
        this.#handleTaskCompleteChange();
        this.#handleTaskEditInit();
        this.#handleDeleteTask();
    }

    disconnectedCallback() {
        this.input.removeEventListener('change', this.inputChangeHandler);
        this.editIcon.removeEventListener('click', this.taskEditInitHandler);
        this.deleteIcon.removeEventListener('click', this.deleteHandler);
    }

    #handleTaskCompleteChange() {
        this.inputChangeHandler = (event) => {
            app.taskService.updateTask(this.task.id, { isComplete: event.currentTarget.checked })
        }
        this.input.addEventListener('change', this.inputChangeHandler);
    }

    #handleTaskEditInit() {
        this.taskEditInitHandler = () => {
            const taskEditInitEvent = new Event('apptaskeditinit');
            taskEditInitEvent.payload = { ...this.task };
            dispatchEvent(taskEditInitEvent);
        };
        this.editIcon = this.querySelector('#task-edit');
        this.editIcon.addEventListener('click', this.taskEditInitHandler);
    }

    #hookUpTaskCompleteCheckbox() {
        this.input = this.querySelector('input');
        const label = this.querySelector('label');
        const id = `task-${this.task.id}`;
        label.htmlFor = id;
        this.input.id = id;
        this.input.checked = this.task.isComplete;
        this.input.name = id;
    }

    #handleDeleteTask() {
        this.deleteIcon = this.querySelector('#task-delete');
        this.deleteHandler = () => app.taskService.deleteTask(this.task.id)
        this.deleteIcon.addEventListener('click', this.deleteHandler, { once: true });
    }
}
