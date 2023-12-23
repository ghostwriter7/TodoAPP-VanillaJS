import { BaseComponent } from "./BaseComponent.js";

export class Calendar extends BaseComponent {
    constructor() {
        super();

    }

    async connectedCallback() {
        this.#createCalendarHeader();
        this.#createDateTiles();
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
        const today = new Date();
        const month = today.getMonth();
        const year = today.getFullYear();
        const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

        const daysContainer = document.createElement('div');
        daysContainer.className = 'calendar__days';

        new Array(lastDateOfMonth).fill('').map((_, index) => {
            const date = new Date(year, month, index + 1);
            const dayTile = document.createElement('day-tile');
            dayTile.date = date;
            daysContainer.appendChild(dayTile);
        });

        this.appendChild(daysContainer);
    }
}
