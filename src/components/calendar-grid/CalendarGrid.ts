import './calendar-grid.css';
import { BaseComponent } from "@components/BaseComponent.js";
import { isToday } from "@helpers/date";
import { getDiv, getSpan } from "@helpers/dom";
import type { TaskSummary } from "../../types";
import { Injector } from "@services/Injector.ts";
import { CalendarService } from "@services/CalendarService.ts";
import type { DayTile } from "@components/DayTile.ts";

export class CalendarGrid extends BaseComponent {
    private calendarService: CalendarService;

    static get observedAttributes(): string[] {
        return ['summary'];
    }

    constructor() {
        super();
        this.calendarService = Injector.resolve(CalendarService);
    }

    private async connectedCallback(): Promise<void> {
        this.createCalendarHeader();
    }

    private attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        this.createDateTiles(JSON.parse(newValue) as TaskSummary[]);
    }

    private createCalendarHeader(): void {
        const container = getDiv();
        container.className = 'd-flex';

        const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        daysOfWeek.forEach((dayOfWeek) => {
            const dayOfWeekEl = getSpan();
            dayOfWeekEl.className = 'container grow';
            dayOfWeekEl.innerText = dayOfWeek;
            container.appendChild(dayOfWeekEl);
        });

        this.appendChild(container);
    }

    private async createDateTiles(monthSummaryPerDay: TaskSummary[]): Promise<void> {
        this.querySelector('.calendar__days')?.remove();
        const daysContainer = getDiv();
        daysContainer.className = 'calendar__days';

        const year = this.calendarService.getYear();
        const month = this.calendarService.getMonth();
        new Array(monthSummaryPerDay.length).fill('').map((_, index) => {
            const dayTile = document.createElement('day-tile') as DayTile;
            dayTile.date = new Date(year, month, index + 1);
            dayTile.stats = monthSummaryPerDay[index];
            dayTile.isToday = isToday(dayTile.date);
            daysContainer.appendChild(dayTile);
        });

        this.appendChild(daysContainer);
    }
}
