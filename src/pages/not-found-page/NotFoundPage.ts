import './not-found-page.css';
import { Injector } from "@services/Injector.ts";
import { Router } from "@services/Router.ts";

export class NotFoundPage extends HTMLElement {
    private readonly eventHandlerMap = new Map<HTMLAnchorElement, (event: MouseEvent) => void>();

    constructor() {
        super();
    }

    connectedCallback(): void {
        this.render();
        this.interceptLinks();
    }

    disconnectedCallback(): void {
        this.eventHandlerMap.forEach((handler, anchor) => anchor.removeEventListener('click', handler));
    }

    private render(): void {
        this.className = 'container d-flex not-found gap-xl';
        this.innerHTML = `
            <span class="material-symbols-outlined">map</span>
            <span>Apologies. The page you are looking for does not exist.</span>
            <div class="d-flex gap-xl">
                <button>See your <a href="/tasks">tasks for today</a></button>
                <button>Go to <a href="/calendar">Calendar</a></button>
            </div>
        `;
    }

    private interceptLinks(): void {
        this.querySelectorAll('a').forEach((anchor) => {
            this.eventHandlerMap.set(anchor, (event) => {
                event.preventDefault();
                Injector.resolve(Router).navigateTo(anchor.pathname);
            });
            anchor.addEventListener('click', this.eventHandlerMap.get(anchor), { once: true });
        });
    }
}
