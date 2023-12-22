import { BaseComponent } from "../BaseComponent.js";

export class TaskForm extends BaseComponent {
    #taskModel = {
        task: ''
    }
    #taskProxy;
    #inputMap = {};
    #label;
    #button;
    #formControl;

    constructor() {
        super();
    }

    connectedCallback() {
        this.attachTemplate('task-form');
        this.#formControl = this.querySelector('form-control');
        this.#label = this.#formControl.root.querySelector('label');
        this.#button = this.querySelector('button[type="submit"]');

        this.#handleFormSubmit();
        this.#handleTaskEdit();
        this.#initTwoWayDataBinding();

    }

    disconnectedCallback() {
        this.form.removeEventListener('submit', this.formSubmitHandler);
    }

    #handleFormSubmit() {
        this.formSubmitHandler = (event) => {
            event.preventDefault();
            const taskText = this.querySelector('form-control').root.querySelector('input').value;
            this.#taskProxy.task = '';
            this.#taskProxy.id = null;
            app.taskService.addTask(taskText, new Date().toLocaleDateString());
        };
        this.form = this.querySelector('form');
        this.form.addEventListener('submit', this.formSubmitHandler);
    }

    #handleTaskEdit() {
        addEventListener('apptaskeditinit', (event) => {
            const { payload } = event;
            this.#taskProxy.task = payload.task;
            this.#taskProxy.id = payload.id;
            this.#label.innerText = 'Edit Task';
            this.#button.innerHTML = this.#button.innerHTML.replace('Add', 'Update');
        });
    }

    #initTwoWayDataBinding() {
        this.form.querySelectorAll('form-control').forEach((formControl) => {
            const input = formControl.root.querySelector('input');
            this.#inputMap[input.name] = input;
            input.addEventListener('change', (event) => {
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
}
