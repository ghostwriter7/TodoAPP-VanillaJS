import { Subject } from "@services/Subject.js";
import { Observable } from "../types";

export class ObservableButton extends HTMLButtonElement {
    private readonly clickSubject = new Subject<void>();
    click$: Observable<void> = this.clickSubject.asObservable();

    constructor() {
        super();
    }

    connectedCallback() {
        this.onclick = (event: MouseEvent) => {
            event.preventDefault();
            this.clickSubject.next();
        }
    }
}
