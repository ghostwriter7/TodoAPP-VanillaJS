import { BaseComponent } from "../components/BaseComponent.js";

export class CalendarPage extends BaseComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        this.renderComponent('calendar-header');
        this.renderComponent('calendar-component');
    }
}
