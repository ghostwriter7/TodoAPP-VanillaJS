import { BaseComponent } from "./BaseComponent.js";
import { getMonthNames } from "../helpers/date.js";

export class CalendarHeader extends BaseComponent {
    #incrementYearClickHandler;
    #incrementYearIcon;
    #decrementYearClickHandler;
    #decrementYearIcon;

    constructor() {
        super();
    }

    connectedCallback() {
        this.attachTemplate('calendar-header');
        this.#renderMonthDropdown();
        this.#renderYearSelector();
    }

    disconnectedCallback() {
        this.#incrementYearIcon.removeEventListener('click', this.#incrementYearClickHandler);
        this.#decrementYearIcon.removeEventListener('click', this.#decrementYearClickHandler);
    }

    #renderMonthDropdown() {
        const actions = document.querySelector('#calendar-header-actions');
        const select = document.createElement('select', { is: 'dropdown-control' });
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

        select.attachObserver({ next: (value) => app.calendarService.setMonth(value) });
    }

    #renderYearSelector() {
        const actions = document.querySelector('#calendar-header-actions');
        const div = document.createElement('div');
        let activeYear = app.calendarService.getYear()
        div.className = 'd-flex align-center gap-xl'
        div.innerHTML = `
            <i id="increment-year" class="fs-xl pointer fa-solid fa-up-long"></i>
            <span class="fs-md" id="current-year">${activeYear}</span>
            <i id="decrement-year" class="fs-xl pointer fa-solid fa-down-long"></i>
        `;

        const updateYear = () => {
            activeYear = app.calendarService.getYear();
            div.querySelector('#current-year').innerText = activeYear;
        };

        this.#incrementYearClickHandler = () => {
            app.calendarService.setYear(activeYear + 1);
            updateYear();
        };
        this.#incrementYearIcon =  div.querySelector('#increment-year');
        this.#incrementYearIcon.addEventListener('click', this.#incrementYearClickHandler);

        this.#decrementYearClickHandler = () => {
            app.calendarService.setYear(activeYear - 1);
            updateYear();
        };
        this.#decrementYearIcon = div.querySelector('#decrement-year');
        this.#decrementYearIcon.addEventListener('click', this.#decrementYearClickHandler);

        actions.appendChild(div);
    }
}
