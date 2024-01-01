import { required } from "../helpers/validators.js";
import { FormMode } from "../consts/form-mode.js";
import { getButton, getDiv, getSpan } from "../helpers/dom.js";

export class AuthPage extends HTMLElement {
    #changeModeSubscription;
    #footer;
    #formGroup;
    #modeEnum = {
        SignIn: 'SIGN_IN',
        SignUp: 'SIGN_UP'
    };
    #mode = this.#modeEnum.SignIn;
    #header;

    get #isSignIn() {
        return this.#mode === this.#modeEnum.SignIn;
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.classList.add('container', 'd-flex', 'justify-center', 'column');
        this.#renderAuthHeader();
        this.#renderAuthForm();
        this.#renderAuthFooter();
    }

    disconnectedCallback() {
        this.#changeModeSubscription?.unsubscribe();
    }

    #renderAuthHeader() {
        this.#header = getDiv();
        this.#header.classList.add('auth__header');
        this.#setHeaderTitle();
        this.appendChild(this.#header);
    }

    #renderAuthForm() {
        this.#formGroup = document.createElement('form', { is: 'form-group' });
        this.#formGroup.formControls = [
            {
                label: "E-mail",
                id: "email",
                placeholder: "johnny.wick@yahoo.com...",
                type: "text",
                validators: [required],
                validationMessage: {
                    required: `Email is required.`
                }
            },
            {
                label: "Password",
                id: "password",
                placeholder: "abc123?",
                type: "text",
                validators: [required],
                validationMessage: {
                    required: `Password is required.`
                }
            },
        ];
        this.#formGroup.onSubmitCallback = async ({ email, password }) => {
            try {
                await app.authService[this.#isSignIn ? 'signIn' : 'signUp'](email, password);
            } catch (e) {
                this.#handleError(e.message);
            }
        }
        this.#formGroup.dataset.submitLabel = 'Submit';
        this.#formGroup.dataset.mode = FormMode.Create;
        this.appendChild(this.#formGroup);
    }

    #renderAuthFooter() {
        this.#footer = getDiv();
        this.#footer.classList.add('auth__footer');
        const message = getSpan();
        this.#setFooterMessage(message);
        this.#footer.appendChild(message);
        const changeModeButton = getButton('observable-button');
        this.#setChangeModeButtonLabel(changeModeButton);

        changeModeButton.click$.subscribe({
            next: () => {
                this.#mode = this.#isSignIn ? this.#modeEnum.SignUp : this.#modeEnum.SignIn;
                this.#setFooterMessage(message);
                this.#setChangeModeButtonLabel(changeModeButton);
                this.#setHeaderTitle();
            }
        });

        this.#footer.appendChild(changeModeButton);
        this.appendChild(this.#footer);
    }

    #setChangeModeButtonLabel(changeModeButton) {
        changeModeButton.innerText = this.#isSignIn ? 'Sign Up' : 'Sign In';
    }

    #setHeaderTitle() {
        this.#header.innerText = this.#isSignIn ? 'Sign In' : 'Sign Up';
    }

    #setFooterMessage(message) {
        message.innerText = `${this.#isSignIn ? `Don't you have an account yet?` : `Have you been here before?`} Click to `;
    }

    #handleError(message) {

    }
}
