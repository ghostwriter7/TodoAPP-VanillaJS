import { BaseComponent } from '../BaseComponent.js'

export class FormControl extends BaseComponent {
    #inputChangeHandler;
    #inputEl;
    #subscribers = [];

    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open'});
    }

    connectedCallback() {
        this.ensureCssAvailability('./components/form-control/form-control.css');
        this.#render();
        this.#notifyAllOnValueChange();
    }

    disconnectedCallback() {
        this.#inputEl.removeEventListener('change', this.#inputChangeHandler);
    }

    onValueChange(subscriber) {
        this.#subscribers.push(subscriber);
    }

    #notifyAllOnValueChange() {
        this.#inputChangeHandler = (event) => {
            const value = event.target.value;
            this.#subscribers.forEach((subscriber) => subscriber(value));
        }
        this.#inputEl.addEventListener('input', this.#inputChangeHandler);
    }

    #render() {
        const { id, label, placeholder, type } = this.dataset;

        const wrapperEl = document.createElement('div');
        wrapperEl.className = 'form-control';

        const labelEl = document.createElement('label');
        labelEl.innerText = label;
        labelEl.htmlFor = id;
        wrapperEl.appendChild(labelEl);

        this.#inputEl = document.createElement('input');
        this.#inputEl.id = this.#inputEl.name = id;
        this.#inputEl.placeholder = placeholder || '';
        this.#inputEl.type = type;

        wrapperEl.appendChild(this.#inputEl);

        this.root.appendChild(wrapperEl);
    }
}
