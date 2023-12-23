import { BaseComponent } from "./BaseComponent.js";
import { getMonthName } from "../helpers/date.js";

export class TaskSummary extends BaseComponent {
    #appTaskChangeHandler;
    constructor() {
        super();
    }

    connectedCallback() {
        this.attachTemplate('task-summary');
        this.#renderTitle();
        this.#renderTaskCount();

        this.#appTaskChangeHandler = () => this.#renderTaskCount();
        addEventListener('apptaskchange', this.#appTaskChangeHandler);
    }

    disconnectedCallback() {
        removeEventListener('apptaskchange', this.#appTaskChangeHandler);
    }

    #renderTitle() {
        const title = this.querySelector('span');
        const [date, month, year] = this.date.split('/');
        const monthName = getMonthName(month - 1);
        title.innerText = `${date} ${monthName} ${year}`;
    }


    #renderTaskCount() {
        this.querySelector('#task-counters')?.remove();

        const {  active, complete } = app.taskService.getTasksSummary(this.date);
        const allTasks = active + complete;
        if (allTasks !== 0) {
            const span = document.createElement('span');
            span.id = 'task-counters';
            span.innerHTML = `
                ${active} <i class="fa-regular fa-square-check"></i> | 
                ${complete} <i class="fa-solid fa-square-check"></i> | 
                ${allTasks} <i class="fa-solid fa-list-ul"></i>
            `;
            this.querySelector('.container').appendChild(span);
        }
    }
}
