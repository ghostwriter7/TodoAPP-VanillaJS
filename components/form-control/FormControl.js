import { BaseComponent } from '../BaseComponent.js'

export class FormControl extends BaseComponent {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open'});
    }

    connectedCallback() {
        this.ensureCssAvailability('./components/form-control/form-control.css');

        const { id, label, placeholder, type } = this.dataset;

        const wrapperEl = document.createElement('div');
        wrapperEl.className = 'form-control';

        const labelEl = document.createElement('label');
        labelEl.innerText = label;
        labelEl.htmlFor = id;
        wrapperEl.appendChild(labelEl);

        const inputEl = document.createElement('input');
        inputEl.id = inputEl.name = id;
        inputEl.placeholder = placeholder || '';
        inputEl.type = type;

        wrapperEl.appendChild(inputEl);

        this.root.appendChild(wrapperEl);
    }
}
