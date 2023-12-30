import { BaseComponent } from "./BaseComponent.js";
import { taskEditInitEvent } from "../consts/events.js";

export class TaskForm extends BaseComponent {
    #taskModel = {
        task: ''
    }
    #taskProxy;
    #inputMap = {};
    #label;
    #button;
    #formControl;
    #formControlSubscription;

    constructor() {
        super();
    }

    connectedCallback() {
        this.attachTemplate('task-form');
        this.#formControl = this.querySelector('form-control');
        this.#label = this.#formControl.querySelector('label');
        this.#button = this.querySelector('button[type="submit"]');
        this.#setDisabledOnSubmitButton(true);

        this.#handleFormSubmit();

        this.#handleTaskEdit();
        this.#initTwoWayDataBinding();
        this.#disableSubmitButtonOnEmpty();

    }

    disconnectedCallback() {
        this.form.removeEventListener('submit', this.formSubmitHandler);
        this.form.removeEventListener('keydown', this.submitOnEnterHandler);
        this.#formControlSubscription.unsubscribe();
    }

    #handleFormSubmit() {
        this.formSubmitHandler = (event) => {
            event.preventDefault();
            this.#taskProxy.id ?
                app.taskService.updateTask(this.#taskProxy.id, { task: this.#taskProxy.task }) :
                app.taskService.addTask(this.#taskProxy.task, this.date);

            this.#taskProxy.id && this.#removeCancelButton();
            this.#resetForm();
            this.#setDisabledOnSubmitButton(true);
            this.#updateLabelAndSubmitButton('Task', 'Add');
        };
        this.form = this.querySelector('form');
        this.form.addEventListener('submit', this.formSubmitHandler);

        this.submitOnEnterHandler = (event) => {
            if (event.code === 'Enter' && !!this.#taskProxy.task) {
                this.form.dispatchEvent(new Event('submit'));
            }
        };
        this.form.addEventListener('keydown', this.submitOnEnterHandler);
    }

    #handleTaskEdit() {
        addEventListener(taskEditInitEvent, (event) => {
            const { payload } = event;
            this.#taskProxy.task = payload.task;
            this.#taskProxy.id = payload.id;
            this.#button.disabled = false;
            this.#updateLabelAndSubmitButton('Edit Task', 'Update');
            this.#initCancelButton();
        });
    }

    #initTwoWayDataBinding() {
        this.form.querySelectorAll('form-control').forEach((formControl) => {
            const input = formControl.querySelector('input');
            this.#inputMap[input.name] = input;
            input.addEventListener('input', (event) => {
                this.#taskProxy[input.name] = event.currentTarget.value;
            });
        })

        this.#taskProxy = new Proxy(this.#taskModel, {
            set: (target, property, newValue) => {
                target[property] = newValue;

                if (this.#inputMap[property]) {
                    this.#inputMap[property].value = newValue;
                }
                return true;
            }
        });
    }

    #cancelTaskEdit() {
        this.#resetForm();
        this.#removeCancelButton();
        this.#updateLabelAndSubmitButton('Task', 'Add');
    }

    #resetForm() {
        this.#taskProxy.task = '';
        this.#taskProxy.id = null;
    }

    #removeCancelButton() {
        this.cancelButton.remove();
    }

    #updateLabelAndSubmitButton(label, buttonLabel) {
        this.#label.innerText = label;
        const buttonHTML = this.#button.innerHTML;
        const textEndsAtIndex = buttonHTML.indexOf(" ");
        const currentLabel = buttonHTML.substring(0, textEndsAtIndex);
        this.#button.innerHTML = this.#button.innerHTML.replace(currentLabel, buttonLabel);
    }

    #initCancelButton() {
        this.cancelButton = document.createElement('button');
        this.cancelButton.innerHTML = 'Cancel <i class="fa-solid fa-xmark"></i>';
        this.querySelector('.form__actions').insertAdjacentElement('afterbegin', this.cancelButton);
        this.cancelButton.addEventListener('click', () => this.#cancelTaskEdit(), { once: true });
    }

    #disableSubmitButtonOnEmpty() {
        this.#formControlSubscription = this.#formControl.valueChanges$.subscribe({
            next: (value) => {
                this.#setDisabledOnSubmitButton(!value);
            }
        });
    }

    #setDisabledOnSubmitButton(disabled) {
        this.#button.disabled = disabled;
    }
}
