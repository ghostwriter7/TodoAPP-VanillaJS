import './calendar-grid.css';
import { BaseComponent } from "../BaseComponent.js";
import { isToday } from "../../helpers/date.js";
import { getDiv, getSpan } from "../../helpers/dom.js";

export class CalendarGrid extends BaseComponent {
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
        const container = getDiv();
        container.className = 'd-flex';

        const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        daysOfWeek.forEach((dayOfWeek) => {
            const dayOfWeekEl = getSpan();
            dayOfWeekEl.className = 'container grow';
            dayOfWeekEl.innerText = dayOfWeek;
            container.appendChild(dayOfWeekEl);
        });

        this.appendChild(container);
    }

    async #createDateTiles(monthSummaryPerDay) {
        this.querySelector('.calendar__days')?.remove();
        const daysContainer = getDiv();
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
