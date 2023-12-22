export class BaseComponent extends HTMLElement {
    static loadedCssFiles = new Map();

    constructor() {
        super();
    }

    attachTemplate(templateId) {
        const template = document.getElementById(templateId);
        const content = template.content.cloneNode(true);
        this.appendChild(content);
    }

    async ensureCssAvailability(cssPath) {
        if (BaseComponent.loadedCssFiles.has(cssPath)) {
            this.#createStyles(BaseComponent.loadedCssFiles.get(cssPath));
        } else {
            const result = await fetch(cssPath);
            const text = await result.text();
            BaseComponent.loadedCssFiles.set(cssPath, text);
            this.#createStyles(text);
        }
    }

    #createStyles(styles) {
        const styleEl = document.createElement('style');
        styleEl.innerText = styles;
        document.querySelector('head').appendChild(styleEl);
    }
}
