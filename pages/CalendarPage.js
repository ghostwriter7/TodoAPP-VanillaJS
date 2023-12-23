export class CalendarPage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.#renderComponent('calendar-header');
        this.#renderComponent('calendar-component');
    }

    #renderComponent(tagName) {
        const component = document.createElement(tagName);
        this.appendChild(component);
    }
}
