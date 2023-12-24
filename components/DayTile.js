import { toTaskId } from "../helpers/date.js";

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
        this.classList.add('container', 'calendar__day');

        if (this.isToday) {
            this.classList.add('calendar__day--today');
        }

        if (this.date.getDate() === 1) {
            const dayOfWeekIndex = this.date.getDay() || 7;
            this.style.gridColumn = `${dayOfWeekIndex} / ${dayOfWeekIndex + 1}`;
        }

        this.innerText = this.date.getDate();
    }

    #initializeEventListener() {
        this.clickHandler = () => app.router.navigateTo(`/tasks?date=${toTaskId(this.date)}`);
        this.addEventListener('click', this.clickHandler);
    }
}
