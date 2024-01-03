export class TaskCounters extends HTMLElement {
    static get observedAttributes() {
        return ['summary'];
    }

    constructor() {
        super();
        this.classList.add('fs-lg');
    }

    attributeChangedCallback(name, oldValue, newValue) {
        const { complete, total } = JSON.parse(newValue);
        if (total !== 0) {
        const active = total - complete;
            this.innerHTML = `
                ${active} <i class="fa-regular fa-square-check"></i> | 
                ${complete} <i class="fa-solid fa-square-check"></i> | 
                ${total} <i class="fa-solid fa-list-ul"></i>
            `;
        } else {
            this.innerHTML = ``;
        }
    }
}
