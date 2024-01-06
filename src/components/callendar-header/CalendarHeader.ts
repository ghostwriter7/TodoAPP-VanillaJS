import './calendar-header.css';
import { BaseComponent } from "@components/BaseComponent.js";
import { getMonthNames } from "@helpers/date";
import { getDiv } from "@helpers/dom";

export class CalendarHeader extends BaseComponent {
    static get observedAttributes() {
        return ['summary'];
    }

    #actions;
    #activeViewSubscription;
    #buttonClickSubscription;
    #currentMonth;
    #currentYear;
    #incrementYearClickHandler;
    #incrementYearIcon;
    #decrementYearClickHandler;
    #decrementYearIcon;
    #monthChangeSubscription;
    #showActiveViewBtn;

    constructor() {
        super();
    }

    connectedCallback() {
        this.classList.add('container', 'd-flex', 'justify-between', 'align-center');
        this.#setCurrentMonthAndYear();
        this.attachTemplate('calendar-header');
        this.#actions = document.querySelector('#calendar-header-actions');
        this.#renderMonthDropdown();
        this.#renderYearSelector();
        this.#renderShowActiveMonthButton();

        this.#activeViewSubscription = app.calendarService.activeView$.subscribe({
            next: ({ month, year }) => {
                this.#setActiveViewButtonDisplayProperty(month, year);
                this.#updateYear(year);
                this.#setMonthDropdownValue(month);
            }
        });
    }

    disconnectedCallback() {
        this.#incrementYearIcon.removeEventListener('click', this.#incrementYearClickHandler);
        this.#decrementYearIcon.removeEventListener('click', this.#decrementYearClickHandler);
        this.#activeViewSubscription.unsubscribe();
        this.#buttonClickSubscription.unsubscribe();
        this.#monthChangeSubscription.unsubscribe();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.#updateTaskCounters(newValue);
    }

    #renderMonthDropdown() {
        const select = document.createElement('select', { is: 'dropdown-control' });
        select.id = 'month';
        const activeMonth = app.calendarService.getMonth();
        this.#actions.appendChild(select);
        getMonthNames().forEach((name, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.selected = index === activeMonth;
            option.innerText = name;
            select.appendChild(option);
        });

        this.#monthChangeSubscription = select.change$.subscribe({ next: (value) => app.calendarService.setMonth(value) });
    }

    #renderYearSelector() {
        const div = getDiv();
        div.className = 'd-flex align-center gap-md'
        div.innerHTML = `
            <span id="increment-year" class="material-symbols-outlined">north</span>
            <span class="fs-md" id="current-year">${app.calendarService.getYear()}</span>
            <span id="decrement-year" class="material-symbols-outlined">south</span>
        `;

        this.#incrementYearClickHandler = () => app.calendarService.setNextYear();
        this.#incrementYearIcon = div.querySelector('#increment-year');
        this.#incrementYearIcon.addEventListener('click', this.#incrementYearClickHandler);

        this.#decrementYearClickHandler = () => app.calendarService.setPreviousYear();
        this.#decrementYearIcon = div.querySelector('#decrement-year');
        this.#decrementYearIcon.addEventListener('click', this.#decrementYearClickHandler);

        this.#actions.appendChild(div);
    }

    #renderShowActiveMonthButton() {
        this.#showActiveViewBtn = document.createElement('button', { is: 'observable-button' });
        this.#showActiveViewBtn.innerText = 'Show Active Month';
        this.#showActiveViewBtn.id = 'show-active-view';

        const isHidden = this.#currentMonth === app.calendarService.getMonth() && this.#currentYear === app.calendarService.getYear();

        if (isHidden) {
            this.#showActiveViewBtn.style.display = 'none';
        }

        this.#buttonClickSubscription = this.#showActiveViewBtn.click$.subscribe({
            next: () => {
                app.calendarService.setMonth(this.#currentMonth);
                app.calendarService.setYear(this.#currentYear);
            }
        });

        this.#actions.appendChild(this.#showActiveViewBtn);
    }

    #updateYear(year) {
        this.querySelector('#current-year').innerText = year;
    }

    #setMonthDropdownValue(month) {
        this.querySelectorAll('option').forEach((option, index) => {
            option.selected = month === index;
        })
    }

    #setActiveViewButtonDisplayProperty(month, year) {
        const isCurrentViewActive = this.#currentMonth === month && this.#currentYear === year;
        this.#showActiveViewBtn.style.display = isCurrentViewActive ? 'none' : 'block';
    }

    #setCurrentMonthAndYear() {
        const today = new Date();
        this.#currentMonth = today.getMonth();
        this.#currentYear = today.getFullYear();
    }

    #updateTaskCounters(newValue) {
        this.querySelector('task-counters').setAttribute('summary', newValue);
    }
}
