import './loading-bar.css';

export class LoadingBar extends HTMLElement {
    constructor() {
        super();
    }

    private connectedCallback(): void {
        this.innerHTML = `<div class="loading"></div> <div>${this.dataset.message || 'Loading...'}</div>`;
    }
}
