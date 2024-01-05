import { BaseComponent } from "./BaseComponent.js";
import { taskEditInitEvent } from "../consts/events.js";
import { required } from "../helpers/validators.js";
import { FormMode } from "../consts/form-mode.js";

export class TaskForm extends BaseComponent {
    #detailsEl;
    #formGroup;
    #taskEditInitHandler;

    constructor() {
        super();
    }

    connectedCallback() {
        this.#buildFormGroup();
        this.#buildNativeAccordion();
        this.#handleTaskEdit();
    }

    disconnectedCallback() {
        removeEventListener(taskEditInitEvent, this.#taskEditInitHandler);
    }

    #handleTaskEdit() {
        this.#taskEditInitHandler = (event) => {
            const { payload } = event;
            this.#formGroup.setValue(payload);
            this.#formGroup.dataset.mode = FormMode.Update;
            this.#detailsEl.open = true;
        };
        addEventListener(taskEditInitEvent, this.#taskEditInitHandler);
    }

    #buildFormGroup() {
        this.#formGroup = document.createElement('form', { is: 'form-group' });
        this.#formGroup.formControls = [
            {
                label: "Task",
                id: "task",
                placeholder: "To win the world before lunchtime...",
                type: "text",
                validators: [required],
                validationMessage: {
                    required: `Task's text is required.`
                }
            },
            {
                label: "Description",
                id: "description",
                placeholder: "All the nitty-gritty about what and how comes here...",
                type: "textarea",
            },
            {
                defaultValue: 2,
                label: "Priority",
                id: 'priority',
                type: 'rate',
                levels: 3
            },
            {
                defaultValue: 3,
                label: "Effort",
                id: 'effort',
                type: 'rate',
                levels: 5
            }
        ];
        this.#formGroup.onSubmitCallback = ({ id, ...data }) => {
            id ? app.taskService.updateTask(id, data) : app.taskService.addTask(data);
        };
        this.#formGroup.dataset.mode = FormMode.Create;

    }

    #buildNativeAccordion() {
        this.#detailsEl = document.createElement('details');
        this.#detailsEl.classList.add('container', 'fs-lg');
        const summaryEl = document.createElement('summary');
        summaryEl.innerText = 'Task Form';
        this.#detailsEl.appendChild(summaryEl);
        this.#detailsEl.appendChild(this.#formGroup);
        this.appendChild(this.#detailsEl);
    }
}
