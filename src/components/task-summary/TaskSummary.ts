import './task-summary.css';
import { BaseComponent } from "@components/BaseComponent.js";
import { getMonthName } from "@helpers/date";
import { taskChangeEvent } from "@consts/events";
import { Injector } from "@services/Injector.ts";
import { TaskService } from "@services/TaskService.ts";

export class TaskSummary extends BaseComponent {
    date: string;
    taskChangeHandler: (event: Event) => void;

    constructor() {
        super();
    }

    private connectedCallback(): void {
        this.attachTemplate('task-summary');
        this.renderTitle();

        this.taskChangeHandler = () => this.updateTaskCounters();
        addEventListener(taskChangeEvent, this.taskChangeHandler);
        this.updateTaskCounters();
    }

    private disconnectedCallback(): void {
        removeEventListener(taskChangeEvent, this.taskChangeHandler);
    }

    private renderTitle(): void {
        const title = this.querySelector('#title') as HTMLSpanElement;
        const [month, date, year] = this.date.split('/');
        const monthName = getMonthName( parseInt(month) - 1);
        title.innerText = `${date} ${monthName} ${year}`;
    }

    private updateTaskCounters(): void {
        this.querySelector('task-counters').setAttribute('summary', JSON.stringify(Injector.resolve(TaskService).getTasksSummary(this.date)));
    }
}
