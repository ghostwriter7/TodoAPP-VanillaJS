import { toTaskId } from "../helpers/date.js";
import { getSpan } from "../helpers/dom.js";

export class DayTile extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.#render();
        this.#initializeEventListener();
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.clickHandler);
    }

    #render() {
        this.classList.add('container', 'calendar__day', 'd-flex', 'justify-between');

        if (this.isToday) {
            this.classList.add('calendar__day--today');
        }

        if (this.date.getDate() === 1) {
            const dayOfWeekIndex = this.date.getDay() || 7;
            this.style.gridColumn = `${dayOfWeekIndex} / ${dayOfWeekIndex + 1}`;
        }

        const date = getSpan();
        date.innerText = this.date.getDate();
        this.appendChild(date);

        if (this.stats.total !== 0) {
            const stats = getSpan();
            stats.className = 'fs-sm fw-700 calendar__day-stats';
            stats.innerText = `${this.stats.complete} / ${this.stats.total}`;
            this.appendChild(stats);
        }
    }

    #initializeEventListener() {
        this.clickHandler = () => app.router.navigateTo(`/tasks?date=${toTaskId(this.date)}`);
        this.addEventListener('click', this.clickHandler);
    }
}
