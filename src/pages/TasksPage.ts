import { BaseComponent } from "../components/BaseComponent.js";
import { taskLoadingEndEvent, taskLoadingStartEvent } from "../consts/events.js";

export class TasksPage extends BaseComponent {
    #endLoadingHandler;
    #loadingBar;
    #startLoadingHandler;

    constructor() {
        super();
    }

    async connectedCallback() {
        this.#bindTaskLoadingEvents();
        await app.taskService.loadTasks(this.date);
        this.renderComponent('task-summary', { date: this.date });
        this.renderComponent('task-form', { date: this.date });
        this.renderComponent('task-list', { date: this.date });
    }

    disconnectedCallback() {
        removeEventListener(taskLoadingStartEvent, this.#startLoadingHandler);
        removeEventListener(taskLoadingEndEvent, this.#endLoadingHandler);
    }

    #renderLoadingBar() {
        this.#loadingBar = document.createElement('loading-bar');
        this.#loadingBar.dataset.message = 'Loading tasks...';
        this.appendChild(this.#loadingBar);
    }

    #bindTaskLoadingEvents() {
        this.#startLoadingHandler = () => this.#renderLoadingBar();
        this.#endLoadingHandler = () => this.#loadingBar.remove();

        addEventListener(taskLoadingStartEvent, this.#startLoadingHandler);
        addEventListener(taskLoadingEndEvent, this.#endLoadingHandler);
    }
}
