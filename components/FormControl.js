import { BaseComponent } from './BaseComponent.js'
import { Subject } from "../services/Subject.js";

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

    #notifyAllOnValueChange() {
        this.#inputChangeHandler = (event) => {
            const value = event.target.value;
            this.#pristine = false;
            this.updateValidity(value);

            this.#valueChangesSubject.next(value);
        }
        this.#inputEl.addEventListener('input', this.#inputChangeHandler);
    }

    #renderFormControl() {
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

    #renderError(errorMessage) {
        if (this.#errorEl) {
            this.#errorEl.innerText = errorMessage;
            return;
        }


        this.#errorEl = document.createElement('span');
        this.#errorEl.className = 'error';
        this.#errorEl.innerText = errorMessage;
        this.appendChild(this.#errorEl);
    }
}
