export class RateSelector extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.classList.add('container');
        this.style.marginTop = 0;

        new Array(+this.levels).fill(0).forEach((_, index) => {
           const span = document.createElement('span');
           span.innerText = index + 1;
           this.appendChild(span);
        });
    }
}
