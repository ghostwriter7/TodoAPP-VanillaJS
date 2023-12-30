import { Subject } from "../services/Subject.js";

export class FormGroup extends HTMLFormElement {
    #subject = new Subject();
    #model = {};
    #modelProxy;
    #subscriptions = [];

    formControls;
    valueChanges$ = this.#subject.asObservable();

    constructor() {
        super();
    }

    connectedCallback() {
        formControls.forEach((formControl) => {
            const formControlEl = document.createElement('form-control');
            this.#model[formControl.id] = null;
            formControlEl.dataset.id = formControl.id;
            formControlEl.dataset.label = formControl.label;
            formControlEl.dataset.placeholder = formControl.placeholder;
            formControlEl.dataset.type = formControl.type;
            const subscription = formControlEl.valueChanges$.subscribe({ next: (value) => this.#modelProxy[formControl.id] = value});
            this.#subscriptions.push(subscription);
            this.appendChild(formControlEl);
        });

        this.#modelProxy = new Proxy(this.#model, {
            set: (target, property, newValue) => {
                target[property] = newValue;
                this.#subject.next(target);
                return true;
            }
        });
    }

    disconnectedCallback() {
        this.#subscriptions.forEach((subscription) => subscription.unsubscribe());
    }
}
