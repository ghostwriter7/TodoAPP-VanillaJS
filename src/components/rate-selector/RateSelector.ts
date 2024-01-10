import './rate-selector.css';
import { getSpan } from "@helpers/dom";
import { CustomInputEvent } from "../../types";

export class RateSelector extends HTMLElement {
    private eventHandlerMap = new Map<HTMLSpanElement, () => void>();
    private levelElements: HTMLSpanElement[] = [];

    public levels: string;

    static get observedAttributes() {
        return ['data-value'];
    }

    constructor() {
        super();
    }

    private connectedCallback(): void {
        this.classList.add('container');

        new Array(+this.levels).fill(0).forEach((_, index) => {
            const span = getSpan();
            span.classList.add('level');
            this.levelElements.push(span);

            this.eventHandlerMap.set(span, () => {
                this.updateLevels(index + 1);
                const inputEvent = new InputEvent('input') as CustomInputEvent<number>;
                inputEvent.value = index + 1;
                this.dispatchEvent(inputEvent);
            });
            span.addEventListener('click', this.eventHandlerMap.get(span));

            this.appendChild(span);
        });
    }

    private disconnectedCallback(): void {
        this.eventHandlerMap.forEach((eventHandler, spanEl) => {
            spanEl.removeEventListener('click', eventHandler);
        });
    }

    private attributeChangedCallback(attribute: string, oldValue: string, newValue: string): void {
        this.updateLevels(+newValue);
    }

    private updateLevels(value: number): void {
        this.levelElements.forEach((element, elementIndex) => {
            const isActive = elementIndex < value;
            element.classList[isActive ? 'add' : 'remove']('level--active');
            element.style.filter = isActive ? `brightness(${(elementIndex + 1) / +this.levels})` : 'unset';
        });
    }
}
