export class BaseComponent extends HTMLElement {
    constructor() {
        super();
    }

    attachTemplate(templateId) {
        const template = document.getElementById(templateId);
        const content = template.content.cloneNode(true);
        this.appendChild(content);
    }

    renderComponent(tagName, props) {
        const component = document.createElement(tagName);

        if (props) {
            Object.entries(props).forEach(([key, value]) => component[key] = value);
        }

        this.appendChild(component);
    }
}
