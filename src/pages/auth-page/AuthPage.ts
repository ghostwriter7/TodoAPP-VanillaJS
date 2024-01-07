import './auth-page.css';
import { email, minLength, required } from "@helpers/validators";
import { FormMode } from "@consts/form-mode";
import { getButton, getDiv, getSpan } from "@helpers/dom";
import { ObservableButton } from "@components/ObservableButton.ts";
import { FormGroup } from "@components/form-group/FormGroup.ts";
import { Injector } from "@services/Injector.ts";
import { AuthService } from "@services/AuthService.ts";
import type { Subscription } from "../../types";

enum Mode {
    SignIn = 'SIGN_IN',
    SignUp = 'SIGN_UP'
}

type AuthForm =  FormGroup<{ email: string, password: string }>;

export class AuthPage extends HTMLElement {
    private changeModeSubscription: Subscription;
    private error: HTMLSpanElement;
    private footer: HTMLDivElement;
    private formGroup: AuthForm;
    private header: HTMLDivElement;
    private mode = Mode.SignIn;

    private get isSignIn() {
        return this.mode === Mode.SignIn;
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.classList.add('container', 'd-flex', 'justify-center', 'column');
        this.renderAuthHeader();
        this.renderAuthForm();
        this.renderAuthFooter();
    }

    disconnectedCallback() {
        this.changeModeSubscription?.unsubscribe();
    }

    renderAuthHeader() {
        this.header = getDiv();
        this.header.classList.add('auth__header');
        this.setHeaderTitle();
        this.appendChild(this.header);
    }

    renderAuthForm() {
        this.formGroup = document.createElement('form', { is: 'form-group' }) as AuthForm;
        this.formGroup.formControls = [
            {
                label: "E-mail",
                id: "email",
                placeholder: "johnny.wick@yahoo.com...",
                type: "text",
                validators: [required, email],
                validationMessage: {
                    required: 'Email is required.',
                    email: 'It does not look like a valid e-mail address.'
                }
            },
            {
                label: "Password",
                id: "password",
                placeholder: "abc123?",
                type: "password",
                validators: [required, minLength(6)],
                validationMessage: {
                    required: 'Password is required.',
                    minLength: 'Password must be at least 6 chars long'
                }
            },
        ];
        this.formGroup.onSubmitCallback = async ({ email, password }) => {
            this.resetError();
            try {
                await Injector.resolve(AuthService)[this.isSignIn ? 'signIn' : 'signUp'](email, password);
            } catch (e) {
                this.handleError(e.message);
            }
        }
        this.formGroup.dataset.submitLabel = 'Submit';
        this.formGroup.dataset.mode = FormMode.Create;
        this.appendChild(this.formGroup);
    }

    private renderAuthFooter(): void {
        this.footer = getDiv();
        this.footer.classList.add('auth__footer');
        const message = getSpan();
        this.setFooterMessage(message);
        this.footer.appendChild(message);
        const changeModeButton = getButton({ is: 'observable-button' }) as ObservableButton;
        this.setChangeModeButtonLabel(changeModeButton);

        this.changeModeSubscription = changeModeButton.click$.subscribe({
            next: () => {
                this.resetError();
                this.mode = this.isSignIn ? Mode.SignUp : Mode.SignIn;
                this.setFooterMessage(message);
                this.setChangeModeButtonLabel(changeModeButton);
                this.setHeaderTitle();
            }
        });

        this.footer.appendChild(changeModeButton);
        this.appendChild(this.footer);
    }

    private setChangeModeButtonLabel(changeModeButton: HTMLButtonElement): void {
        changeModeButton.innerText = this.isSignIn ? 'Sign Up' : 'Sign In';
    }

    private setHeaderTitle(): void {
        this.header.innerText = this.isSignIn ? 'Sign In' : 'Sign Up';
    }

    private setFooterMessage(message: HTMLSpanElement): void {
        message.innerText = `${this.isSignIn ? `Don't you have an account yet?` : `Have you been here before?`} Click to `;
    }

    private handleError(code: string): void {
        let message;

        switch (code) {
            case 'auth/invalid-email':
                message = 'The user does not exist. Please, sign up.';
                break;
            case 'auth/wrong-password':
                message = 'Invalid credentials. Try again.';
                break;
            case 'auth/email-already-in-use':
                message = 'A user with a given e-mail already exists. Please, sign in.';
                break;
            case 'auth/user-not-found':
                message = 'A user with a given e-mail does not exist. Please, sign up.'
                break;
            default:
                message = 'An error has occurred, apologies.';
        }

        this.error = getSpan();
        this.error.innerText = message;
        this.error.style.color = 'var(--clr-error)';
        this.appendChild(this.error);
        setTimeout(() => this.resetError(), 3000);
    }

    private resetError(): void {
        this.error?.remove();
    }
}
