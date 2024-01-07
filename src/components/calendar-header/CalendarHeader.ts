import './calendar-header.css';
import { BaseComponent } from "@components/BaseComponent.js";
import { getMonthNames } from "@helpers/date";
import { getButton, getDiv } from "@helpers/dom";
import { CalendarService } from "@services/CalendarService.ts";
import { Injector } from "@services/Injector.ts";
import type { MouseHandler, Subscription } from "../../types";
import type { Dropdown } from "@components/Dropdown.ts";
import type { ObservableButton } from "@components/ObservableButton.ts";

export class CalendarHeader extends BaseComponent {
    static get observedAttributes(): string[] {
        return ['summary'];
    }

    private actions: HTMLDivElement;
    private activeViewSubscription: Subscription;
    private buttonClickSubscription: Subscription;
    private readonly calendarService: CalendarService;
    private currentMonth: number;
    private currentYear: number;
    private incrementYearClickHandler: MouseHandler;
    private incrementYearIcon: HTMLSpanElement;
    private decrementYearClickHandler: MouseHandler;
    private decrementYearIcon: HTMLSpanElement;
    private monthChangeSubscription: Subscription;
    private showActiveViewBtn: ObservableButton;

    constructor() {
        super();
        this.calendarService = Injector.resolve(CalendarService);
    }

    private connectedCallback(): void {
        this.classList.add('container', 'd-flex', 'justify-between', 'align-center');
        this.setCurrentMonthAndYear();
        this.attachTemplate('calendar-header');
        this.actions = document.querySelector('calendar-header-actions');
        this.renderMonthDropdown();
        this.renderYearSelector();
        this.renderShowActiveMonthButton();

        this.activeViewSubscription = this.calendarService.activeView$.subscribe({
            next: ({ month, year }) => {
                this.setActiveViewButtonDisplayProperty(month, year);
                this.updateYear(year);
                this.setMonthDropdownValue(month);
            }
        });
    }

    private disconnectedCallback(): void {
        this.incrementYearIcon.removeEventListener('click', this.incrementYearClickHandler);
        this.decrementYearIcon.removeEventListener('click', this.decrementYearClickHandler);
        this.activeViewSubscription.unsubscribe();
        this.buttonClickSubscription.unsubscribe();
        this.monthChangeSubscription.unsubscribe();
    }

    private attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        this.updateTaskCounters(newValue);
    }

    private renderMonthDropdown(): void {
        const select = document.createElement('select', { is: 'dropdown-control' }) as Dropdown;
        select.id = 'month';
        const activeMonth = this.calendarService.getMonth();
        this.actions.appendChild(select);
        getMonthNames().forEach((name, index) => {
            const option = document.createElement('option');
            option.value = index.toString();
            option.selected = index === activeMonth;
            option.innerText = name;
            select.appendChild(option);
        });

        this.monthChangeSubscription = select.change$.subscribe({ next: (value: string) => this.calendarService.setMonth(value) });
    }

    private renderYearSelector(): void {
        const div = getDiv();
        div.className = 'd-flex align-center gap-md'
        div.innerHTML = `
            <span id="increment-year" class="material-symbols-outlined">north</span>
            <span class="fs-md" id="current-year">${this.calendarService.getYear()}</span>
            <span id="decrement-year" class="material-symbols-outlined">south</span>
        `;

        this.incrementYearClickHandler = () => this.calendarService.setNextYear();
        this.incrementYearIcon = div.querySelector('#increment-year');
        this.incrementYearIcon.addEventListener('click', this.incrementYearClickHandler);

        this.decrementYearClickHandler = () => this.calendarService.setPreviousYear();
        this.decrementYearIcon = div.querySelector('#decrement-year');
        this.decrementYearIcon.addEventListener('click', this.decrementYearClickHandler);

        this.actions.appendChild(div);
    }

    private renderShowActiveMonthButton(): void {
        this.showActiveViewBtn = getButton({ is: 'observable-button'});
        this.showActiveViewBtn.innerText = 'Show Active Month';
        this.showActiveViewBtn.id = 'show-active-view';

        const isHidden = this.currentMonth === this.calendarService.getMonth() && this.currentYear === this.calendarService.getYear();

        if (isHidden) {
            this.showActiveViewBtn.style.display = 'none';
        }

        this.buttonClickSubscription = this.showActiveViewBtn.click$.subscribe({
            next: () => {
                this.calendarService.setMonth(this.currentMonth);
                this.calendarService.setYear(this.currentYear);
            }
        });

        this.actions.appendChild(this.showActiveViewBtn);
    }

    private updateYear(year: number): void {
        (this.querySelector('#current-year') as HTMLSpanElement).innerText = year.toString();
    }

    private setMonthDropdownValue(month: number): void {
        this.querySelectorAll('option').forEach((option, index) => {
            option.selected = month === index;
        });
    }

    private setActiveViewButtonDisplayProperty(month: number, year: number): void {
        const isCurrentViewActive = this.currentMonth === month && this.currentYear === year;
        this.showActiveViewBtn.style.display = isCurrentViewActive ? 'none' : 'block';
    }

    private setCurrentMonthAndYear(): void {
        const today = new Date();
        this.currentMonth = today.getMonth();
        this.currentYear = today.getFullYear();
    }

    private updateTaskCounters(newValue: string): void {
        this.querySelector('task-counters').setAttribute('summary', newValue);
    }
}
