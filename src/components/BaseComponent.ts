export class BaseComponent extends HTMLElement {
    constructor() {
        super();
    }

    attachTemplate(templateId: string): void {
        const template = document.getElementById(templateId) as HTMLTemplateElement;
        const content = template.content.cloneNode(true);
        this.appendChild(content);
    }

    renderComponent<T extends HTMLElement>(tagName: string, props?: Partial<T>): void {
        const component = document.createElement(tagName) as T;

        if (props) {
            Object.entries(props).forEach(([key, value]) => component[key] = value);
        }

        this.appendChild(component);
    }
}
