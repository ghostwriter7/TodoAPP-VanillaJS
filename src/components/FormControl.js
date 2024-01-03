import { BaseComponent } from './BaseComponent.js'
import { Subject } from "../services/Subject.js";
import { getSpan } from "../helpers/dom.js";

export class FormControl extends BaseComponent {
    #errorEl;
    #inputChangeHandler;
    #inputEl;
    #pristine = true;
    #statusChangeSubject = new Subject();
    #validationMessageMap;
    #validators;
    #valueChangesSubject = new Subject();
    validationMessage;
    validators;
    statusChanges$ = this.#statusChangeSubject.asObservable();
    valueChanges$ = this.#valueChangesSubject.asObservable();

    constructor() {
        super();
    }

    connectedCallback() {
        this.#renderFormControl();
        this.#notifyAllOnValueChange();
    }

    disconnectedCallback() {
        this.#inputEl.removeEventListener('change', this.#inputChangeHandler);
    }

    markAsPristine() {
        this.#pristine = true;
    }

    setValidators(validators, validationMessageMap) {
        this.#validators = validators;
        this.#validationMessageMap = validationMessageMap;
    }

    setValue(value) {
        this.#inputEl.value = value;
        this.#inputEl.dataset.value = value;
    }

    updateValidity(value) {
        if (this.#validators) {
            const failedValidator = this.#validators.find((validator) => !validator(value));

            if (!this.#pristine) {
                if (failedValidator) {
                    const errorMessage = this.#validationMessageMap[failedValidator.name];
                    this.#renderError(errorMessage);
                } else {
                    this.#renderError('');
                }
            }

            this.#statusChangeSubject.next(!failedValidator);
        }
    }

    #getTagNameFromType(type) {
        switch (type) {
            case 'password':
            case 'text':
                return 'input';
            case 'textarea':
                return 'textarea';
            case 'rate':
                return 'rate-selector';
        }
    }

    #notifyAllOnValueChange() {
        this.#inputChangeHandler = (event) => {
            const value = event.value ?? event.target.value;
            this.#pristine = false;
            this.updateValidity(value);

            this.#valueChangesSubject.next(value);
        }
        this.#inputEl.addEventListener('input', this.#inputChangeHandler);
    }

    #renderFormControl() {
        const { id, label, type, ...additionalAttributes } = this.dataset;

        const labelEl = document.createElement('label');
        labelEl.innerText = label;
        labelEl.htmlFor = id;
        this.appendChild(labelEl);

        this.#inputEl = document.createElement(this.#getTagNameFromType(type));
        this.#inputEl.id = this.#inputEl.name = id;

        Object.entries(additionalAttributes).forEach(([key, value]) => {
           this.#inputEl[key] = value;
        });

        if (this.#inputEl instanceof HTMLInputElement) {
            this.#inputEl.type = type;
        }

        this.appendChild(this.#inputEl);
    }

    #renderError(errorMessage) {
        if (this.#errorEl) {
            this.#toggleErrorMessageDisplayClass(errorMessage);
            this.#errorEl.innerText = errorMessage;
            return;
        }


        this.#errorEl = getSpan();
        this.#errorEl.className = 'error';
        this.#errorEl.innerText = errorMessage;
        this.#toggleErrorMessageDisplayClass(errorMessage);
        this.appendChild(this.#errorEl);
    }

    #toggleErrorMessageDisplayClass(errorMessage) {
        this.#errorEl.classList[errorMessage ? 'remove' : 'add']('d-none');
    }
}
