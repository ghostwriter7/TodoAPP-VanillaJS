import './form-group.css';
import { Subject } from "@services/Subject";
import { FormMode } from "@consts/form-mode";

export class FormGroup<TData extends {}> extends HTMLFormElement {
    static get observedAttributes() {
        return ['data-mode'];
    }

    #cancelButton;
    #cancelButtonHandler;
    #formControlMap = new Map();
    #model = {};
    #modelProxy;
    #subject = new Subject();
    #submitButton;
    #submitHandler;
    #submitOnEnterHandler;
    #subscriptions = [];
    #validityMap = new Map();

    formControls;
    onSubmitCallback: (data: TData) => void;
    valueChanges$ = this.#subject.asObservable();

    constructor() {
        super();
        const template = document.getElementById('form-group');
        const content = template.content.cloneNode(true);
        this.appendChild(content);
        this.#cancelButton = this.querySelector('button[type="button"]');
        this.#submitButton = this.querySelector('button[type="submit"]')

    }

    connectedCallback() {
        this.#initializeEventListeners();
        this.#initializeSubmitOnEnterListener();
        this.#initializeModelProxy();
        this.#initializeFormControls();
    }

    disconnectedCallback() {
        this.#subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.#cancelButton.removeEventListener('click', this.#cancelButtonHandler);
        this.removeEventListener('submit', this.#submitHandler);
        this.removeEventListener('keydown', this.#submitOnEnterHandler);
    }

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (attribute === 'data-mode') {
            this.#renderActions();
        }
    }

    setValue(value) {
        Object.entries(value).forEach(([key, value]) => {
                this.#modelProxy[key] = value;
                this.#formControlMap.get(key)?.updateValidity(value);
            }
        );
    }

    #initializeEventListeners() {
        this.#cancelButtonHandler = () => this.#reset();
        this.#cancelButton.addEventListener('click', this.#cancelButtonHandler);

        this.#submitHandler = (event) => {
            event.preventDefault();
            this.onSubmitCallback(this.#modelProxy);
            this.#reset();
        };
        this.addEventListener('submit', this.#submitHandler);
    }

    #initializeFormControls() {
        const formControls = this.querySelector('.form__controls');
        this.formControls.forEach(({ defaultValue, validators, validationMessage, ...additionalAttributes }, index) => {
            const id = additionalAttributes.id;
            const formControlEl = document.createElement('form-control');
            this.#model[id] = null;

            Object.entries(additionalAttributes).forEach(([key, value]) => {
                formControlEl.dataset[key] = value;
            });

            formControlEl.dataset.tabIndex = index + 1;

            formControlEl.setValidators(validators, validationMessage);

            const valueChangeSubscription = formControlEl.valueChanges$.subscribe({ next: (value) => this.#modelProxy[id] = value });
            this.#subscriptions.push(valueChangeSubscription);

            const statusChangeSubscription = formControlEl.statusChanges$.subscribe({
                next: (valid) => {
                    this.#validityMap.set(id, valid);
                    this.#submitButton.disabled = !this.#isValid();
                }
            });
            this.#subscriptions.push(statusChangeSubscription);

            this.#formControlMap.set(id, formControlEl);
            formControlEl.updateValidity();
            formControls.appendChild(formControlEl);

            if (defaultValue) {
                this.#modelProxy[id] = defaultValue;
            }
        });
    }

    #initializeModelProxy() {
        this.#modelProxy = new Proxy(this.#model, {
            set: (target, property, newValue) => {
                target[property] = newValue;
                this.#formControlMap.get(property)?.setValue(newValue);
                this.#subject.next(target);
                return true;
            }
        });
    }

    #initializeSubmitOnEnterListener() {
        this.#submitOnEnterHandler = (event) => {
            if (event.code === 'Enter' && this.#isValid()) {
                this.dispatchEvent(new Event('submit'));
            }
        };
        this.addEventListener('keydown', this.#submitOnEnterHandler);
    }

    #isValid() {
        return [...this.#validityMap.values()].every(Boolean);
    }

    #renderActions() {
        const isCreateModeActive = this.dataset.mode === FormMode.Create;
        const formActions = this.querySelector('.form__actions');

        formActions.querySelector('#button-label').innerText = this.dataset.submitLabel ?? `${isCreateModeActive ? 'Add' : 'Update'}`;
        this.#cancelButton.classList[isCreateModeActive ? 'add' : 'remove']('d-none');
        this.#cancelButton.classList[!isCreateModeActive ? 'add' : 'remove']('d-flex');
    }

    #reset() {
        this.#resetForm();
        this.dataset.mode = FormMode.Create;
        this.#renderActions();
        this.#formControlMap.forEach((control) => {
            control.markAsPristine();
            control.updateValidity(null);
        })
    }

    #resetForm() {
        Object.keys(this.#modelProxy).forEach((key) => this.#modelProxy[key] = this.formControls.find((formControl) => formControl.id === key)?.defaultValue || null);
    }
}
