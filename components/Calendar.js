import { BaseComponent } from "./BaseComponent.js";
import { calendarChangeEvent } from "../consts/events.js";

export class Calendar extends BaseComponent {
    constructor() {
        super();

    }

    async connectedCallback() {
        this.#createCalendarHeader();
        this.#handleCalendarChangeEvent();
        this.#createDateTiles();
    }

    disconnectedCallback() {
        this.removeEventListener(calendarChangeEvent, this.calendarChangeEventHandler);
    }

    #createCalendarHeader() {
        const container = document.createElement('div');
        container.className = 'd-flex';

        const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        daysOfWeek.forEach((dayOfWeek) => {
            const dayOfWeekEl = document.createElement('span');
            dayOfWeekEl.className = 'container grow';
            dayOfWeekEl.innerText = dayOfWeek;
            container.appendChild(dayOfWeekEl);
        });

        this.appendChild(container);
    }

    #createDateTiles() {
        this.querySelector('.calendar__days')?.remove();

        const month = app.calendarService.getMonth();
        const year = app.calendarService.getYear();
        const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

        const daysContainer = document.createElement('div');
        daysContainer.className = 'calendar__days';

        new Array(lastDateOfMonth).fill('').map((_, index) => {
            const dayTile = document.createElement('day-tile');
            dayTile.date = new Date(year, month, index + 1);
            daysContainer.appendChild(dayTile);
        });

        this.appendChild(daysContainer);
    }

    #handleCalendarChangeEvent() {
        this.calendarChangeEventHandler = () => this.#createDateTiles();
        addEventListener(calendarChangeEvent, this.calendarChangeEventHandler);
    }
}
