import { BaseComponent } from "./BaseComponent.js";
import { isToday } from "../helpers/date.js";

export class Calendar extends BaseComponent {
    static get observedAttributes() {
        return ['summary'];
    }

    constructor() {
        super();

    }

    async connectedCallback() {
        this.#createCalendarHeader();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.#createDateTiles(JSON.parse(newValue));
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

    async #createDateTiles(monthSummaryPerDay) {
        this.querySelector('.calendar__days')?.remove();
        const daysContainer = document.createElement('div');
        daysContainer.className = 'calendar__days';

        const year = app.calendarService.getYear();
        const month = app.calendarService.getMonth();
        new Array(monthSummaryPerDay.length).fill('').map((_, index) => {
            const dayTile = document.createElement('day-tile');
            dayTile.date = new Date(year, month, index + 1);
            dayTile.stats = monthSummaryPerDay[index];
            dayTile.isToday = isToday(dayTile.date);
            daysContainer.appendChild(dayTile);
        });

        this.appendChild(daysContainer);
    }
}
