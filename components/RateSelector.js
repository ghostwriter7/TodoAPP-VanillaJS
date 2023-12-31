export class RateSelector extends HTMLElement {
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
           const span = document.createElement('span');
           span.classList.add('level');
           this.#levelElements.push(span);

           span.addEventListener('click', () => {
               this.#updateLevels(index + 1);

               const inputEvent = new InputEvent('input');
               inputEvent.value = index + 1;
               this.dispatchEvent(inputEvent);
           });

           this.appendChild(span);
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
