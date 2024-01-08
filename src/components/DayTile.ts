import { toTaskId } from "@helpers/date.js";
import { getSpan } from "@helpers/dom.js";
import type { TaskSummary } from "../types";
import { Injector } from "@services/Injector.ts";
import { Router } from "@services/Router.ts";

export class DayTile extends HTMLElement {
    date: Date;
    isToday: boolean;
    stats: TaskSummary;

    constructor() {
        super();
    }

    private connectedCallback(): void {
        this.render();
        this.initializeEventListener();
    }

    private render(): void {
        this.classList.add('container', 'calendar__day', 'd-flex', 'justify-between');

        if (this.isToday) {
            this.classList.add('calendar__day--today');
        }

        if (this.date.getDate() === 1) {
            const dayOfWeekIndex = this.date.getDay() || 7;
            this.style.gridColumn = `${dayOfWeekIndex} / ${dayOfWeekIndex + 1}`;
        }

        const date = getSpan();
        date.innerText = this.date.getDate().toString();
        this.appendChild(date);

        if (this.stats.total !== 0) {
            const stats = getSpan();
            stats.className = 'fs-sm fw-700 calendar__day-stats';
            stats.innerText = `${this.stats.complete} / ${this.stats.total}`;
            this.appendChild(stats);
        }
    }

    private initializeEventListener(): void {
        this.onclick = () => Injector.resolve(Router).navigateTo(`/tasks?date=${toTaskId(this.date)}`);
    }
}
