import { BaseComponent } from "./BaseComponent.js";

export class CalendarHeader extends BaseComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        this.attachTemplate('calendar-header');
        this.querySelector('#calendar-title').innerText = app.calendarService.getCalendarLabel();
    }
}
