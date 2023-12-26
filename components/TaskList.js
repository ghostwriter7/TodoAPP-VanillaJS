import { BaseComponent } from "./BaseComponent.js";
import { taskChangeEvent } from "../consts/events.js";

export class TaskList extends BaseComponent {
    #itemsOrderSubscription;
    #sortableList;
    #taskChangeEventHandler;

    constructor() {
        super();
    }

    connectedCallback() {
        this.classList.add('container', 'd-block');
        this.#createSortableList();

        this.#taskChangeEventHandler = () => this.#updateListItems();
        addEventListener(taskChangeEvent, this.#taskChangeEventHandler);

        this.#itemsOrderSubscription = this.#sortableList.itemOrder$.subscribe({
            next: (itemOrder) => {
                const updates = itemOrder.map((itemId, index) => ({ id: itemId, order: index }));
                app.taskService.updateManyTasks(updates);
            }
        });
    }

    disconnectedCallback() {
        removeEventListener(taskChangeEvent, this.#taskChangeEventHandler);
        this.#itemsOrderSubscription.unsubscribe();
    }

    #createSortableList() {
        const sortableList = document.createElement('ul', { is: 'sortable-list' });
        sortableList.getItem = (task) => {
            const taskItem = document.createElement('task-item');
            taskItem.dataset.data = JSON.stringify(task);
            taskItem.dataset.id = task.id;
            return taskItem;
        };
        sortableList.emptyListPlaceholder = 'You have no tasks for this day';
        this.#sortableList = sortableList;
        this.#updateListItems();
        this.appendChild(sortableList);
    }

    #updateListItems() {
        this.#sortableList.dataset.items = JSON.stringify(app.taskService.getTasks(this.date));
    }
}
