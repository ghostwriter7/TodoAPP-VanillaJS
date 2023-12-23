import { BaseComponent } from "./BaseComponent.js";
import { getMonthName } from "../helpers/date.js";

export class TaskSummary extends BaseComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        this.attachTemplate('task-summary');
        this.#renderTitle();
        this.#renderTaskCount();
    }

    #renderTitle() {
        const title = this.querySelector('span');
        const [date, month, year] = this.date.split('/');
        const monthName = getMonthName(month);
        title.innerText = `${date} ${monthName} ${year}`;
    }


    #renderTaskCount() {
        const {  active, complete } = app.taskService.getTasksSummary(this.date);
        const allTasks = active + complete;
        if (allTasks !== 0) {
            const span = document.createElement('span');
            span.innerHTML = `
                ${active} <i class="fa-regular fa-square-check"></i> | 
                ${complete} <i class="fa-solid fa-square-check"></i> | 
                ${allTasks} <i class="fa-solid fa-list-ul"></i>
            `;
            this.querySelector('.container').appendChild(span);
        }
    }
}
