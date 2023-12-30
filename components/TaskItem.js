import { BaseComponent } from "./BaseComponent.js";
import { taskEditInitEvent } from "../consts/events.js";

export class TaskItem extends BaseComponent {
    static get observedAttributes() {
        return ['data-data'];
    }

    #isInitialized = false;

    constructor() {
        super();
    }

    connectedCallback() {
        if (!this.#isInitialized) {
            this.attachTemplate('task-item');
            this.#updateTaskContent(this.task.task);
            this.style.cursor = 'grab';
            this.#hookUpTaskCompleteCheckbox();
        }
        this.#handleTaskCompleteChange();
        this.#handleTaskEditInit();
        this.#handleDeleteTask();
        this.#isInitialized = true;
    }

    disconnectedCallback() {
        this.input.removeEventListener('change', this.inputChangeHandler);
        this.editIcon.removeEventListener('click', this.taskEditInitHandler);
        this.deleteIcon.removeEventListener('click', this.deleteHandler);
    }

    attributeChangedCallback(attribute, oldValue, newValue) {
        this.task = JSON.parse(newValue);

        if (oldValue?.task !== this.task.task && !!this.innerHTML) {
            this.#updateTaskContent(this.task.task);
        }
    }

    #handleTaskCompleteChange() {
        this.inputChangeHandler = (event) => {
            app.taskService.updateTask(this.task.id, { isComplete: event.currentTarget.checked })
        }
        this.input.addEventListener('change', this.inputChangeHandler);
    }

    #handleTaskEditInit() {
        this.taskEditInitHandler = () => {
            const event = new Event(taskEditInitEvent);
            event.payload = { ...this.task };
            dispatchEvent(event);
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

    #updateTaskContent(content) {
        this.querySelector('.task-item__text').textContent = content;
    }
}
