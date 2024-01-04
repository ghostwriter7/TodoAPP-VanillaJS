import './rate-selector.css';
import { getSpan } from "../../helpers/dom.js";

export class RateSelector extends HTMLElement {
    #eventHandlerMap = new Map();

    static get observedAttributes() {
        return ['data-value'];
    }

    #levelElements = [];

    constructor() {
        super();
    }

    connectedCallback() {
        this.classList.add('container');

        new Array(+this.levels).fill(0).forEach((_, index) => {
           const span = getSpan();
           span.classList.add('level');
           this.#levelElements.push(span);

           this.#eventHandlerMap.set(span, () => {
               this.#updateLevels(index + 1);
               const inputEvent = new InputEvent('input');
               inputEvent.value = index + 1;
               this.dispatchEvent(inputEvent);
           });
           span.addEventListener('click', this.#eventHandlerMap.get(span));

           this.appendChild(span);
        });
    }

    disconnectedCallback() {
        this.#eventHandlerMap.forEach((eventHandler, spanEl) => {
            spanEl.removeEventListener('click', eventHandler);
        });
    }

    attributeChangedCallback(attribute, oldValue, newValue) {
        this.#updateLevels(+newValue);
    }

    #updateLevels(value) {
        this.#levelElements.forEach((element, elementIndex) => {
            const isActive = elementIndex < value;
            element.classList[isActive ? 'add' : 'remove']('level--active');
            element.style.filter = isActive ? `brightness(${(elementIndex + 1) / +this.levels })` : 'unset';
        });
    }
}
