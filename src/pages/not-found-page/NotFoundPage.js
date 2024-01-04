import './not-found-page.css';

export class NotFoundPage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.#render();
        this.interceptLinks();
    }

    disconnectedCallback() {
        Object.entries(([anchor, handler]) => anchor.removeEventListener('click', handler));
    }

    #render() {
        this.className = 'container d-flex not-found gap-xl';
        this.innerHTML = `
            <i class="fa-solid fa-map-location-dot"></i>
            <span>Apologies. The page you are looking for does not exist.</span>
            <div class="d-flex gap-xl">
                <button>See your <a href="/tasks">tasks for today</a></button>
                <button>Go to <a href="/calendar">Calendar</a></button>
            </div>
        `;
    }

    interceptLinks() {
        this.eventHandlerMap = {};

        this.querySelectorAll('a').forEach((anchor) => {
            this.eventHandlerMap[anchor] = (event) => {
                event.preventDefault();
                app.router.navigateTo(anchor.pathname);
            };
            anchor.addEventListener('click', this.eventHandlerMap[anchor], { once: true });
        });
    }
}
