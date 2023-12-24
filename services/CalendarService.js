import { calendarChangeEvent } from "../consts/events.js";
import { Subject } from "./Subject.js";

export class CalendarService {
    #state = {
        month: null,
        year: null,
    }
    #stateProxy;
    #activeViewSubject = new Subject();
    activeView$;

    constructor() {
        this.activeView$ = this.#activeViewSubject.asObservable();

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

    setNextYear() {
        this.#stateProxy.year++;
    }

    setPreviousYear() {
        this.#stateProxy.year--;
    }
}
