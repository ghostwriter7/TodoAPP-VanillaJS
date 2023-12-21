export class TaskForm extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const template = document.getElementById('task-form');
        const content = template.content.cloneNode(true);
        this.appendChild(content);
    }
}
