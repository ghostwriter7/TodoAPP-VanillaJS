export class Loading extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `<div class="loading"></div> <div>${this.dataset.message || 'Loading...'}</div>`;
    }
}
