import { BaseComponent } from "@components/BaseComponent.ts";
import { Injector } from "@services/Injector.ts";
import { Router } from "@services/Router.ts";
import { AuthService } from "@services/AuthService.ts";

type BeforeInstallPromptEvent = Event & { prompt: () => void };

export class NavBar extends BaseComponent {
    constructor() {
        super();
    }

    private connectedCallback(): void {
        this.attachTemplate('nav-bar');
        this.initializeEventListeners();
        this.handleBeforeInstallPromptEvent();
    }

    private initializeEventListeners(): void {
        this.querySelectorAll('[data-route]').forEach((button: HTMLElement) => {
            button.onclick = () => Injector.resolve(Router).navigateTo(button.getAttribute('data-route'));
        });

        (this.querySelector('#logout') as HTMLButtonElement).onclick = () => Injector.resolve(AuthService).logout();
    }

    private handleBeforeInstallPromptEvent() {
        let beforeInstallPromptEvent: BeforeInstallPromptEvent;
        const installButton = this.querySelector('#install') as HTMLButtonElement;
        addEventListener('beforeinstallprompt', (event: BeforeInstallPromptEvent) => {
            event.preventDefault();
            beforeInstallPromptEvent = event;
            installButton.classList.remove('d-none');
            installButton.classList.add('d-flex');
        });

        installButton.onclick = () => beforeInstallPromptEvent.prompt();
    }
}
