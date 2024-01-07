import { Subject } from "@services/Subject.js";

export class Dropdown extends HTMLSelectElement {
    #changeSubject = new Subject<string>();
    change$ = this.#changeSubject.asObservable();

    constructor() {
        super();
    }

    connectedCallback() {
        this.changeEventHandler = (event) => {
            this.#changeSubject.next(event.target.value);
        };
        this.addEventListener('change', this.changeEventHandler);
    }

    disconnectedCallback() {
        this.removeEventListener('change', this.changeEventHandler);
    }
}
