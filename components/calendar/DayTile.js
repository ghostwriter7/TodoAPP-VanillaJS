export class DayTile extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.className = 'container calendar__day';

        if (this.date.getDate() === 1) {
            const dayOfWeekIndex = this.date.getDay();
            this.style.gridColumn = `${dayOfWeekIndex} / ${dayOfWeekIndex + 1}`;
        }

        this.innerText = this.date.getDate();
    }
}
