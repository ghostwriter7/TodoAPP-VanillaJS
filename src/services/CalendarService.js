import { calendarChangeEvent } from "../consts/events.js";
import { Subject } from "./Subject.js";

export class CalendarService {
    #state = {
        month: null,
        year: null,
    }
    #stateProxy;
    #activeViewSubject = new Subject();
    activeView$ = this.#activeViewSubject.asObservable();

    constructor() {
        const now = new Date();
        this.#state.month = now.getMonth();
        this.#state.year = now.getFullYear();

        this.#stateProxy = new Proxy(this.#state, {
            set: (target, property, newValue) => {
                target[property] = newValue;
                dispatchEvent(new Event(calendarChangeEvent));

                if (['month', 'year'].includes(property)) {
                    this.#activeViewSubject.next({ month: target['month'], year: target['year'] });
                }
                return true;
            }
        });
    }

    getMonth() {
        return this.#stateProxy.month;
    }

    getYear() {
        return this.#stateProxy.year;
    }

    setMonth(month) {
        this.#stateProxy.month = Number.parseInt(month);
    }

    setYear(year) {
        this.#stateProxy.year = year;
    }

    setNextYear() {
        this.#stateProxy.year++;
    }

    setPreviousYear() {
        this.#stateProxy.year--;
    }

    async getMonthSummary() {
        return new Promise(async (resolve) => {
            const tasks = await this.#getMonthTasks();
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

    async #getMonthTasks() {
        return new Promise(async (resolve) => {
            const month = app.calendarService.getMonth();
            const year = app.calendarService.getYear();

            const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

            const datePlaceholderArray = new Array(lastDateOfMonth).fill('');

            const requests = datePlaceholderArray
                .map((_, index) => {
                    const dateId = `${(month + 1).toString().padStart(2, '0')}/${(index + 1).toString().padStart(2, '0')}/${year}`;
                    return app.dataSource.getAllByIndexAndValue('todo', 'idx-todo-date', dateId);
                });

            const results = await Promise.all(requests);
            resolve(results);
        });
    }
}
