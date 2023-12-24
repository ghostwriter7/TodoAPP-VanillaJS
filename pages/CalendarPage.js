import { BaseComponent } from "../components/BaseComponent.js";
import { calendarChangeEvent } from "../consts/events.js";

export class CalendarPage extends BaseComponent {
    #calendarChangeEventHandler;

    constructor() {
        super();
    }

    async connectedCallback() {
        this.renderComponent('calendar-header');
        this.renderComponent('calendar-component');
        this.#updateMonthSummaryParams();
        this.#handleCalendarChangeEvent();
    }

    disconnectedCallback() {
        removeEventListener(calendarChangeEvent, this.#calendarChangeEventHandler);
    }

    #handleCalendarChangeEvent() {
        this.#calendarChangeEventHandler = () => this.#updateMonthSummaryParams();
        addEventListener(calendarChangeEvent, this.#calendarChangeEventHandler);
    }

    async #updateMonthSummaryParams() {
        const { monthSummary, monthSummaryPerDay } = await app.calendarService.getMonthSummary();
        this.querySelector('calendar-header').setAttribute('summary', JSON.stringify(monthSummary));
        this.querySelector('calendar-component').setAttribute('summary', JSON.stringify(monthSummaryPerDay));
    }
}
