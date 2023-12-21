export class HomePage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const taskForm = document.createElement('task-form');
        this.appendChild(taskForm);
    }

}
