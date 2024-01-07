import { BaseComponent } from "@components/BaseComponent.js";
import { calendarChangeEvent } from "@consts/events.js";
import { Injector } from "@services/Injector.ts";
import { CalendarService } from "@services/CalendarService.ts";

export class CalendarPage extends BaseComponent {
    #calendarChangeEventHandler;

    constructor() {
        super();
    }

    async connectedCallback() {
        this.renderComponent('calendar-header');
        this.renderComponent('calendar-grid');
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
        const { monthSummary, monthSummaryPerDay } = await Injector.resolve(CalendarService).getMonthSummary();
        this.querySelector('calendar-header').setAttribute('summary', JSON.stringify(monthSummary));
        this.querySelector('calendar-grid').setAttribute('summary', JSON.stringify(monthSummaryPerDay));
    }
}
