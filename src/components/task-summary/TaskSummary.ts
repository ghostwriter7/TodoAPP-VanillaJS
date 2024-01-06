import './task-summary.css';
import { BaseComponent } from "@components/BaseComponent.js";
import { getMonthName } from "@helpers/date";
import { taskChangeEvent } from "@consts/events";

export class TaskSummary extends BaseComponent {
    #taskChangeHandler;

    constructor() {
        super();
    }

    connectedCallback() {
        this.attachTemplate('task-summary');
        this.#renderTitle();

        this.#taskChangeHandler = () => this.#updateTaskCounters();
        addEventListener(taskChangeEvent, this.#taskChangeHandler);
        this.#updateTaskCounters();
    }

    disconnectedCallback() {
        removeEventListener(taskChangeEvent, this.#taskChangeHandler);
    }

    #renderTitle() {
        const title = this.querySelector('#title');
        const [month, date, year] = this.date.split('/');
        const monthName = getMonthName(month - 1);
        title.innerText = `${date} ${monthName} ${year}`;
    }

    #updateTaskCounters() {
        this.querySelector('task-counters').setAttribute('summary', JSON.stringify(app.taskService.getTasksSummary(this.date)));
    }
}
