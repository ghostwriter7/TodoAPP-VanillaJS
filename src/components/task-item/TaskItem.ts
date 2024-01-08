import './task-item.css';
import { BaseComponent } from "@components/BaseComponent.js";
import { taskEditInitEvent } from "@consts/events";
import { TaskService } from "@services/TaskService.ts";
import { Injector } from "@services/Injector.ts";
import type { CustomEvent, TaskItem as Task } from "../../types";

export class TaskItem extends BaseComponent {
    public task: Task;

    private deleteIcon: HTMLSpanElement;
    private deleteHandler: () => void;
    private readonly taskService: TaskService;
    private isInitialized = false;

    static get observedAttributes() {
        return ['data-data'];
    }

    constructor() {
        super();
        this.taskService = Injector.resolve(TaskService);
    }

    private connectedCallback(): void {
        if (!this.isInitialized) {
            this.classList.add('container');
            this.attachTemplate('task-item');
            this.renderTaskDetails(this.task);
            this.style.cursor = 'grab';
            this.hookUpTaskCompleteCheckbox();
        }
        this.handleTaskEditInit();
        this.handleDeleteTask();
        this.isInitialized = true;
    }

    private disconnectedCallback(): void {
        this.deleteIcon.removeEventListener('click', this.deleteHandler);
    }

    private attributeChangedCallback(attribute: string, oldValue: Task, newValue: string): void {
        this.task = JSON.parse(newValue) as Task;

        if (oldValue?.task !== this.task.task && !!this.innerHTML) {
            this.renderTaskDetails(this.task);
        }
    }

    private handleTaskEditInit(): void {
        (this.querySelector('#task-edit') as HTMLSpanElement).onclick = () => {
            const event = new Event(taskEditInitEvent) as CustomEvent<Task>;
            event.payload = { ...this.task };
            dispatchEvent(event);
        }
    }

    hookUpTaskCompleteCheckbox() {
        const input = this.querySelector('input') as HTMLInputElement;
        const label = this.querySelector('label');
        const id = `task-${this.task.id}`;
        label.htmlFor = id;
        input.onchange = (event: InputEvent) => this.taskService.updateTask(this.task.id, { isComplete: (event.currentTarget as HTMLInputElement).checked })
        input.id = id;
        input.checked = this.task.isComplete;
        input.name = id;
    }

    private handleDeleteTask(): void {
        this.deleteIcon = this.querySelector('#task-delete');
        this.deleteHandler = () => this.taskService.deleteTask(this.task.id)
        this.deleteIcon.addEventListener('click', this.deleteHandler, { once: true });
    }

    private renderTaskDetails(task: Task): void {
        this.querySelector('.task-item__text').textContent = task.task;
        this.querySelector('.task-item__description').textContent = task.description;
        this.querySelector('#priority').innerHTML = this.getPriorityMarkup(task.priority);
        this.querySelector('#effort').innerHTML = `Effort: ${task.effort}`
    }

    private getPriorityMarkup(priority: number): string {
        switch (priority) {
            case 3:
                return 'High <span class="material-symbols-outlined">bolt</span>';
            case 2:
                return 'Medium <span class="material-symbols-outlined">water_medium</span>';
            case 1:
                return 'Low <span class="material-symbols-outlined">sunny</span>';
        }
    }
}
