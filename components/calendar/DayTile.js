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
        this.className = 'container calendar__day';

        if (this.date.getDate() === 1) {
            const dayOfWeekIndex = this.date.getDay();
            this.style.gridColumn = `${dayOfWeekIndex} / ${dayOfWeekIndex + 1}`;
        }

        this.innerText = this.date.getDate();
    }

    #initializeEventListener() {
        this.clickHandler = () => app.router.navigateTo(`/tasks?date=${this.date.toLocaleDateString()}`);
        this.addEventListener('click', this.clickHandler);
    }
}
