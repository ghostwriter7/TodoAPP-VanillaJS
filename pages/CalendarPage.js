export class CalendarPage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const calendar = document.createElement('calendar-component');
        this.appendChild(calendar);
    }
}
