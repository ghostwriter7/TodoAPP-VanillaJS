import { BaseComponent } from "./BaseComponent.js";
import { calendarChangeEvent } from "../consts/events.js";
import { isToday } from "../helpers/date.js";

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

    async #createDateTiles() {
        const month = app.calendarService.getMonth();
        const year = app.calendarService.getYear();
        const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

        const datePlaceholderArray = new Array(lastDateOfMonth).fill('');

        const requests = datePlaceholderArray
            .map((_, index) => `${(index + 1).toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year}`)
            .map((dateId) => app.dataSource.getAllByIndexAndValue('todo', 'idx-todo-date', dateId));

        const tasksPerDay = await Promise.all(requests);
        const statsPerDay = tasksPerDay.map((tasksPerDay) => tasksPerDay.reduce((stats, task) => {
            stats.total++;
            if (task.isComplete) {
                stats.complete++;
            }
            return stats;
        }, { total: 0, complete: 0 }));

        this.querySelector('.calendar__days')?.remove();
        const daysContainer = document.createElement('div');
        daysContainer.className = 'calendar__days';

        datePlaceholderArray.map((_, index) => {
            const dayTile = document.createElement('day-tile');
            dayTile.date = new Date(year, month, index + 1);
            dayTile.stats = statsPerDay[index];
            dayTile.isToday = isToday(dayTile.date);
            daysContainer.appendChild(dayTile);
        });

        this.appendChild(daysContainer);
    }

    #handleCalendarChangeEvent() {
        this.calendarChangeEventHandler = () => this.#createDateTiles()
        addEventListener(calendarChangeEvent, this.calendarChangeEventHandler);
    }
}
