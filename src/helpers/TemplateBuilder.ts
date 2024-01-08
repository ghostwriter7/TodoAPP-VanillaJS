export class TemplateBuilder {
    private activeElement: HTMLElement;
    private elementsMap = new Map<string, HTMLElement>();
    private root: HTMLElement;

    public static get() {
        return new TemplateBuilder();
    }

    public addSibling(tagName: string): TemplateBuilder {
        const element = document.createElement(tagName);
        this.activeElement.parentElement.appendChild(element);
        this.activeElement = element;
        return this;
    }

    public appendTo(id: string): TemplateBuilder {
        this.elementsMap.get(id).appendChild(this.activeElement);
        return this;
    }

    public build(): HTMLElement {
        return this.root;
    }

    public createRoot(tagName: string): TemplateBuilder {
        this.root = document.createElement(tagName);
        this.elementsMap.set('root', this.root);
        this.activeElement = this.root;
        return this;
    }

    public createElement(tagName: string): TemplateBuilder {
        const element = document.createElement(tagName);
        this.activeElement = element;
        return this;
    }

    public on(eventName: string, eventHandler: (event: Event) => void): TemplateBuilder {
        this.activeElement.addEventListener(eventName, eventHandler);
        return this;
    }

    public withClasses(...classes: string[]): TemplateBuilder {
        this.activeElement.classList.add(...classes);
        return this;
    }

    public withContent(content: string): TemplateBuilder {
        this.activeElement.innerText = content;
        return this;
    }

    public withStyles(styles: Record<keyof CSSStyleDeclaration, CSSStyleDeclaration[keyof CSSStyleDeclaration]>): TemplateBuilder {
        Object.entries(styles).forEach(([key, value]) => this.activeElement.style[key] = value);
        return this;
    }
}
