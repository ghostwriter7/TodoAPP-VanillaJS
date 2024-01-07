import { calendarChangeEvent } from "@consts/events";
import { Subject } from "@services/Subject.js";
import { TaskItem, TaskSummary } from "../types";
import { Injector } from "@services/Injector.ts";
import { DataSource } from "@services/DataSource.ts";

export class CalendarService {
    private state: { month: number; year: number };
    private readonly activeViewSubject = new Subject<{ month: number, year: number }>();

    activeView$ = this.activeViewSubject.asObservable();

    constructor() {
        const now = new Date();

        this.state = new Proxy({
            month: now.getMonth(),
            year: now.getFullYear(),
        }, {
            set: (target: { month: number, year: number }, property: 'month' | 'year', newValue: number): boolean => {
                target[property] = newValue;
                dispatchEvent(new Event(calendarChangeEvent));
                this.activeViewSubject.next({ month: target['month'], year: target['year'] });
                return true;
            }
        });
    }

    getMonth(): number {
        return this.state.month;
    }

    getYear(): number {
        return this.state.year;
    }

    setMonth(month: string): void {
        this.state.month = Number.parseInt(month);
    }

    setYear(year: number): void {
        this.state.year = year;
    }

    setNextYear(): void {
        this.state.year++;
    }

    setPreviousYear(): void {
        this.state.year--;
    }

    async getMonthSummary(): Promise<{ monthSummaryPerDay: TaskSummary[], monthSummary: TaskSummary }> {
        return new Promise(async (resolve) => {
            const tasks = await this.getMonthTasks();
            const monthSummary = { complete: 0, total: 0 };
            const monthSummaryPerDay = tasks.map((tasksPerDay) => tasksPerDay.reduce((stats, task) => {
                stats.total++;
                monthSummary.total++;
                if (task.isComplete) {
                    stats.complete++;
                    monthSummary.complete++;
                }
                return stats;
            }, { complete: 0, total: 0 }));
            resolve({ monthSummaryPerDay, monthSummary });
        });
    }

    private async getMonthTasks(): Promise<TaskItem[][]> {
        return new Promise(async (resolve) => {
            const month = this.getMonth();
            const year = this.getYear();

            const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

            const datePlaceholderArray = new Array(lastDateOfMonth).fill('');

            const requests = datePlaceholderArray
                .map((_, index) => {
                    const dateId = `${(month + 1).toString().padStart(2, '0')}/${(index + 1).toString().padStart(2, '0')}/${year}`;
                    return Injector.resolve(DataSource).getAllByIndexAndValue<TaskItem>('todo', 'idx-todo-date', dateId);
                });

            const results = await Promise.all(requests);
            resolve(results);
        });
    }
}
