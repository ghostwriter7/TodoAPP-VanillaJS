import './form-control.css';
import { BaseComponent } from '@components/BaseComponent.js'
import { Subject } from "@services/Subject";
import { getSpan } from "@helpers/dom";
import { ValidationMessageMap, Validator } from "../../types/form-validation.type.ts";

export class FormControl extends BaseComponent {
    private errorEl: HTMLSpanElement;
    private inputEl: HTMLInputElement;
    private pristine = true;
    private statusChangeSubject = new Subject<boolean>();
    private valueChangesSubject = new Subject<string | number>();
    private validationMessageMap: ValidationMessageMap;
    private validators: Validator[];

    public defaultValue: string | number;
    public statusChanges$ = this.statusChangeSubject.asObservable();
    public valueChanges$ = this.valueChangesSubject.asObservable();

    constructor() {
        super();
    }

    private connectedCallback(): void {
        this.renderFormControl();
        this.notifyAllOnValueChange();
    }

    public markAsPristine(): void {
        this.pristine = true;
    }

    public setValidators(validators: Validator[], validationMessageMap: ValidationMessageMap): void {
        this.validators = validators;
        this.validationMessageMap = validationMessageMap;
    }

    public setValue(value: string): void {
        this.inputEl.value = value;
        this.inputEl.dataset.value = value;
    }

    public updateValidity(value?: string): void {
        if (this.validators) {
            const failedValidator = this.validators.find((validator) => !validator(value));

            if (!this.pristine) {
                if (failedValidator) {
                    const errorMessage = this.validationMessageMap[failedValidator.name];
                    this.renderError(errorMessage);
                } else {
                    this.renderError('');
                }
            }

            this.statusChangeSubject.next(!failedValidator);
        }
    }

    private getTagNameFromType(type: string): string {
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

    private notifyAllOnValueChange(): void {
        this.inputEl.oninput = (event: InputEvent & { value?: string }) => {
            const value = event.value ?? (event.target as HTMLInputElement).value;
            this.pristine = false;
            this.updateValidity(value);
            this.valueChangesSubject.next(value);
        };
    }

    private renderFormControl(): void {
        const { id, label, type, ...additionalAttributes } = this.dataset;

        const labelEl = document.createElement('label');
        labelEl.innerText = label;
        labelEl.htmlFor = id;
        this.appendChild(labelEl);

        this.inputEl = document.createElement(this.getTagNameFromType(type)) as HTMLInputElement;
        this.inputEl.id = this.inputEl.name = id;

        Object.entries(additionalAttributes).forEach(([key, value]) => {
            this.inputEl[key] = value;
        });

        if (this.inputEl instanceof HTMLInputElement) {
            this.inputEl.type = type;
        }

        this.appendChild(this.inputEl);
    }

    private renderError(errorMessage: string): void {
        if (this.errorEl) {
            this.toggleErrorMessageDisplayClass(errorMessage);
            this.errorEl.innerText = errorMessage;
            return;
        }

        this.errorEl = getSpan();
        this.errorEl.className = 'error';
        this.errorEl.innerText = errorMessage;
        this.toggleErrorMessageDisplayClass(errorMessage);
        this.appendChild(this.errorEl);
    }

    private toggleErrorMessageDisplayClass(errorMessage: string): void {
        this.errorEl.classList[errorMessage ? 'remove' : 'add']('d-none');
    }
}
