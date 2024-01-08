import { BaseComponent } from "@components/BaseComponent";
import { taskLoadingEndEvent, taskLoadingStartEvent } from "@consts/events";
import type { LoadingBar } from "@components/loading-bar/LoadingBar.ts";
import { Injector } from "@services/Injector.ts";
import { TaskService } from "@services/TaskService.ts";
import type { TaskSummary } from "@components/task-summary/TaskSummary.ts";
import type { TaskForm } from "@components/TaskForm.ts";
import type { TaskList } from "@components/TaskList.ts";

export class TasksPage extends BaseComponent {
    public date: string;
    private endLoadingHandler: (event: Event) => void;
    private loadingBar: LoadingBar;
    private startLoadingHandler: (event: Event) => void;

    constructor() {
        super();
    }

    async connectedCallback(): Promise<void> {
        this.bindTaskLoadingEvents();
        await Injector.resolve(TaskService).loadTasks(this.date);
        this.renderComponent<TaskSummary>('task-summary', { date: this.date });
        this.renderComponent<TaskForm>('task-form', { date: this.date });
        this.renderComponent<TaskList>('task-list', { date: this.date });
    }

    disconnectedCallback(): void {
        removeEventListener(taskLoadingStartEvent, this.startLoadingHandler);
        removeEventListener(taskLoadingEndEvent, this.endLoadingHandler);
    }

    private bindTaskLoadingEvents(): void {
        this.startLoadingHandler = () => this.renderLoadingBar();
        this.endLoadingHandler = () => this.loadingBar.remove();

        addEventListener(taskLoadingStartEvent, this.startLoadingHandler);
        addEventListener(taskLoadingEndEvent, this.endLoadingHandler);
    }

    private renderLoadingBar(): void {
        this.loadingBar = document.createElement('loading-bar') as LoadingBar;
        this.loadingBar.dataset.message = 'Loading tasks...';
        this.appendChild(this.loadingBar);
    }
}
