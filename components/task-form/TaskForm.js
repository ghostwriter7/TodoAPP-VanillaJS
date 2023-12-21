import { BaseComponent } from "../BaseComponent.js";

export class TaskForm extends BaseComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        this.attachTemplate('task-form');
    }
}
