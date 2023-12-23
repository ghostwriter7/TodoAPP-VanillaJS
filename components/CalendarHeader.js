import { BaseComponent } from "./BaseComponent.js";
import { getMonthNames } from "../helpers/date.js";
import { calendarChangeEvent } from "../consts/events.js";

export class CalendarHeader extends BaseComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        this.attachTemplate('calendar-header');
        this.#renderCalendarTitle();
        this.#renderMonthDropdown();
        this.#handleCalendarChangeEvent();
    }

    #renderMonthDropdown() {
        const actions = document.querySelector('#calendar-header-actions');
        const select = document.createElement('select', { is: 'dropdown-control'});
        select.id = 'month';
        const activeMonth = app.calendarService.getMonth();
        actions.appendChild(select);
        getMonthNames().forEach((name, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.selected = index === activeMonth;
            option.innerText = name;
            select.appendChild(option);
        });

        select.attachObserver({ next: (value) => app.calendarService.setMonth(value)});
    }

    #handleCalendarChangeEvent() {
        addEventListener(calendarChangeEvent, () => {
            this.#renderCalendarTitle();
        });
    }

    #renderCalendarTitle() {
        this.querySelector('#calendar-title').innerText = app.calendarService.getCalendarLabel();
    }
}
