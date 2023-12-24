import { Subject } from "../services/Subject.js";

export class ObservableButton extends HTMLButtonElement {
    #clickSubject = new Subject();
    #clickHandler;
    constructor() {
        super();
        this.click$ = this.#clickSubject.asObservable();
    }

    connectedCallback() {
        this.#clickHandler = (event) => {
            event.preventDefault();
            this.#clickSubject.next(true);
        };

        this.addEventListener('click', (event) => {
            event.preventDefault();
            this.#clickSubject.next(true);
        });
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.#clickHandler);
    }
}
