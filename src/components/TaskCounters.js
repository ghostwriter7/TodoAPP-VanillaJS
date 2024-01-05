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
            this.classList.add('d-flex', 'gap-xl');
            this.innerHTML = `
                <div class="d-flex gap-sm">${active} <span class="material-symbols-outlined">check_box_outline_blank</span></div>
                <div class="d-flex gap-sm">${complete} <span class="material-symbols-outlined">check_box</span></div>
                <div class="d-flex gap-sm">${total} <span class="material-symbols-outlined">done_all</span></div>
            `;
        } else {
            this.innerHTML = ``;
        }
    }
}
