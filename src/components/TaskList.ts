import { BaseComponent } from "@components/BaseComponent.js";
import { taskChangeEvent } from "@consts/events";
import { Injector } from "@services/Injector.ts";
import { TaskService } from "@services/TaskService.ts";
import type { Subscription, TaskItem } from "../types";
import type { SortableList } from "@components/sortable-list/SortableList.ts";

export class TaskList extends BaseComponent {
    date: string;
    private itemsOrderSubscription: Subscription;
    private sortableList: SortableList;
    private taskChangeEventHandler: (event: Event) => void;
    private taskService: TaskService;

    constructor() {
        super();
        this.taskService = Injector.resolve(TaskService);
    }

    private connectedCallback(): void {
        this.classList.add('container', 'd-block');
        this.createSortableList();

        this.taskChangeEventHandler = () => this.updateListItems();
        addEventListener(taskChangeEvent, this.taskChangeEventHandler);

        this.itemsOrderSubscription = this.sortableList.itemOrder$.subscribe({
            next: (itemOrder) => {
                const updates = itemOrder.map((itemId, index) => ({ id: itemId, order: index }));
                this.taskService.updateManyTasks(updates);
            }
        });
    }

    private disconnectedCallback(): void {
        removeEventListener(taskChangeEvent, this.taskChangeEventHandler);
        this.itemsOrderSubscription.unsubscribe();
    }

    private createSortableList(): void {
        const sortableList = document.createElement('ul', { is: 'sortable-list' }) as SortableList;
        sortableList.getItem = (task: TaskItem) => {
            const taskItem = document.createElement('task-item');
            taskItem.dataset.data = JSON.stringify(task);
            taskItem.dataset.id = task.id;
            taskItem.dataset.previewLabel = task.task;
            return taskItem;
        };
        sortableList.emptyListPlaceholder = 'You have no tasks for this day';
        this.sortableList = sortableList;
        this.updateListItems();
        this.appendChild(sortableList);
    }

    private updateListItems(): void {
        this.sortableList.dataset.items = JSON.stringify(this.taskService.getTasks(this.date));
    }
}
