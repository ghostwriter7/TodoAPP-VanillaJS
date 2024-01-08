import './form-group.css';
import { Subject } from "@services/Subject";
import { FormMode } from "@consts/form-mode";
import type { Subscription } from "../../types";
import type { FormControl } from "@components/form-control/FormControl.ts";

export class FormGroup<TData extends object> extends HTMLFormElement {
    static get observedAttributes() {
        return ['data-mode'];
    }

    private cancelButton: HTMLButtonElement;
    private readonly formControlMap = new Map<string, FormControl>();
    private model: TData;
    private readonly subject = new Subject<TData>();
    private submitButton: HTMLButtonElement;
    private readonly subscriptions: Subscription[] = [];
    private readonly validityMap = new Map<string, boolean>();

    public formControls: FormControl[];
    public onSubmitCallback: (data: TData) => void;
    public valueChanges$ = this.subject.asObservable();

    constructor() {
        super();
        const template = document.getElementById('form-group') as HTMLTemplateElement;
        const content = template.content.cloneNode(true);
        this.appendChild(content);
        this.cancelButton = this.querySelector('button[type="button"]');
        this.submitButton = this.querySelector('button[type="submit"]')

    }

    private connectedCallback(): void {
        this.initializeEventListeners();
        this.initializeSubmitOnEnterListener();
        this.initializeModel();
        this.initializeFormControls();
    }

    private disconnectedCallback(): void {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    }

    private attributeChangedCallback(attribute: string, oldValue: string, newValue: string): void {
        if (attribute === 'data-mode') {
            this.renderActions();
        }
    }

    public reset(): void {
        this.resetForm();
        this.dataset.mode = FormMode.Create;
        this.renderActions();
        this.formControlMap.forEach((control) => {
            control.markAsPristine();
            control.updateValidity(null);
        });
    }

    public setValue(value: TData): void {
        Object.entries(value).forEach(([key, value]) => {
                this.model[key] = value;
                this.formControlMap.get(key)?.updateValidity(value);
            }
        );
    }

    private initializeEventListeners(): void {
        this.cancelButton.onclick = () => this.reset();
        this.onsubmit = (event: SubmitEvent): void => {
            event.preventDefault();
            this.onSubmitCallback(this.model);
            this.reset();
        }
    }

    private initializeFormControls(): void {
        const formControls = this.querySelector('.form__controls');
        this.formControls.forEach(({ defaultValue, validators, validationMessage, ...additionalAttributes }, index) => {
            const id = additionalAttributes.id;
            const formControlEl = document.createElement('form-control') as FormControl;
            this.model[id] = null;

            Object.entries(additionalAttributes).forEach(([key, value]) => {
                formControlEl.dataset[key] = value.toString();
            });

            formControlEl.dataset.tabIndex = (index + 1).toString();

            formControlEl.setValidators(validators, validationMessage);

            const valueChangeSubscription = formControlEl.valueChanges$.subscribe({ next: (value) => this.model[id] = value });
            this.subscriptions.push(valueChangeSubscription);

            const statusChangeSubscription = formControlEl.statusChanges$.subscribe({
                next: (valid) => {
                    this.validityMap.set(id, valid);
                    this.submitButton.disabled = !this.isValid();
                }
            });
            this.subscriptions.push(statusChangeSubscription);

            this.formControlMap.set(id, formControlEl);
            formControlEl.updateValidity();
            formControls.appendChild(formControlEl);

            if (defaultValue) {
                this.model[id] = defaultValue;
            }
        });
    }

    private initializeModel(): void {
        this.model = new Proxy({} as TData, {
            set: (target, property, newValue) => {
                target[property] = newValue;
                this.formControlMap.get(property)?.setValue(newValue);
                this.subject.next(target);
                return true;
            }
        });
    }

    private initializeSubmitOnEnterListener(): void {
        this.onkeydown = (event: KeyboardEvent) => {
            if (event.code === 'Enter' && this.isValid()) {
                this.dispatchEvent(new Event('submit'));
            }
        };
    }

    private isValid(): boolean {
        return [...this.validityMap.values()].every(Boolean);
    }

    private renderActions(): void {
        const isCreateModeActive = this.dataset.mode === FormMode.Create;
        const formActions = this.querySelector('.form__actions');

        (formActions.querySelector('#button-label') as HTMLButtonElement).innerText = this.dataset.submitLabel ?? `${isCreateModeActive ? 'Add' : 'Update'}`;
        this.cancelButton.classList[isCreateModeActive ? 'add' : 'remove']('d-none');
        this.cancelButton.classList[!isCreateModeActive ? 'add' : 'remove']('d-flex');
    }

    private resetForm(): void {
        Object.keys(this.model).forEach((key) => this.model[key] = this.formControls.find((formControl) => formControl.id === key)?.defaultValue || null);
    }
}
