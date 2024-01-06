import './task-item.css';
import { BaseComponent } from "../BaseComponent.js";
import { taskEditInitEvent } from "../../consts/events.js";

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
            this.classList.add('container');
            this.attachTemplate('task-item');
            this.#renderTaskDetails(this.task);
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
            this.#renderTaskDetails(this.task);
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

    #renderTaskDetails(task) {
        this.querySelector('.task-item__text').textContent = task.task;
        this.querySelector('.task-item__description').textContent = task.description;
        this.querySelector('#priority').innerHTML = this.#getPriority(task.priority);
        this.querySelector('#effort').innerHTML = `Effort: ${task.effort}`
    }

    #getPriority(priority) {
        switch (priority) {
            case 3:
                return 'High <span class="material-symbols-outlined">bolt</span>';
            case 2:
                return 'Medium <span class="material-symbols-outlined">water_medium</span>';
            case 1:
                return 'Low <span class="material-symbols-outlined">sunny</span>';
        }
    }
}
