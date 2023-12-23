import { getMonthName } from "../helpers/date.js";

export class CalendarService {
    #state = {
        month: null,
        year: null,
    }
    #stateProxy;

    constructor() {
        const now = new Date();
        this.#state.month = now.getMonth();
        this.#state.year = now.getFullYear();

        this.#stateProxy = new Proxy(this.#state, {
            set: (target, property, newValue) => {
                target[property] = newValue;
                return true;
            }
        });
    }

    getCalendarLabel() {
        return `${getMonthName(this.#stateProxy.month)} ${this.#stateProxy.year}`;
    }

    setMonth(month) {
        this.#stateProxy.month = month;
    }

    setYear(year) {
        this.#stateProxy.year = year;
    }
}
