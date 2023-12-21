export class BaseComponent extends HTMLElement {
    constructor() {
        super();
    }

    attachTemplate(templateId) {
        const template = document.getElementById(templateId);
        const content = template.content.cloneNode(true);
        this.appendChild(content);
    }
}
