export class Dropdown extends HTMLSelectElement {
    #observers = [];
    constructor() {
        super();
    }

    connectedCallback() {
        this.changeEventHandler = (event) => {
            this.#observers.forEach((observer) => observer.next(event.target.value));
        };
        this.addEventListener('change', this.changeEventHandler);
    }

    disconnectedCallback() {
        this.removeEventListener('change', this.changeEventHandler);
    }

    attachObserver(observer) {
        this.#observers.push(observer);
    }
}
