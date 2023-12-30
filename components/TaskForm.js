import { BaseComponent } from "./BaseComponent.js";
import { taskEditInitEvent } from "../consts/events.js";
import { required } from "../helpers/validators.js";
import { FormMode } from "../consts/form-mode.js";

export class TaskForm extends BaseComponent {
    #formGroup;
    #taskEditInitHandler;

    constructor() {
        super();
    }

    connectedCallback() {
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
            }
        ];
        this.#formGroup.onSubmitCallback = ({ id, ...data }) => {
            id ? app.taskService.updateTask(id, data) : app.taskService.addTask(data);
        };
        this.#formGroup.dataset.mode = FormMode.Create;
        this.appendChild(this.#formGroup);
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
        };
        addEventListener(taskEditInitEvent, this.#taskEditInitHandler);
    }
}
