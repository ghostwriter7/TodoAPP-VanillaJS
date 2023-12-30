import { BaseComponent } from './BaseComponent.js'
import { Subject } from "../services/Subject.js";

export class FormControl extends BaseComponent {
    #inputChangeHandler;
    #inputEl;
    #subject = new Subject();
    valueChanges$ = this.#subject.asObservable();

    constructor() {
        super();
    }

    connectedCallback() {
        this.#render();
        this.#notifyAllOnValueChange();
    }

    disconnectedCallback() {
        this.#inputEl.removeEventListener('change', this.#inputChangeHandler);
    }

    #notifyAllOnValueChange() {
        this.#inputChangeHandler = (event) => {
            const value = event.target.value;
            this.#subject.next(value);
        }
        this.#inputEl.addEventListener('input', this.#inputChangeHandler);
    }

    #render() {
        const { id, label, placeholder, type } = this.dataset;

        const labelEl = document.createElement('label');
        labelEl.innerText = label;
        labelEl.htmlFor = id;
        this.appendChild(labelEl);

        this.#inputEl = document.createElement('input');
        this.#inputEl.id = this.#inputEl.name = id;
        this.#inputEl.placeholder = placeholder || '';
        this.#inputEl.type = type;

        this.appendChild(this.#inputEl);
    }
}
