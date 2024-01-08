import { Subject } from "@services/Subject.js";

export class Dropdown extends HTMLSelectElement {
    private readonly changeSubject = new Subject<string>();
    public change$ = this.changeSubject.asObservable();

    constructor() {
        super();
    }

    private connectedCallback(): void {
        this.onchange = (event: Event) => this.changeSubject.next((event.target as HTMLSelectElement).value)
    }
}
