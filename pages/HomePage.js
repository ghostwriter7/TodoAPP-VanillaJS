import { BaseComponent } from "../components/BaseComponent.js";

const testTasks = [
    { task: "To finish the project", isComplete: false },
    { task: "To run a marathon", isComplete: false },
    { task: "To watch a course", isComplete: true }
];

export class HomePage extends BaseComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        const taskForm = document.createElement('task-form');
        this.appendChild(taskForm);

        const taskList = document.createElement('task-list');
        this.appendChild(taskList);
        const ul = taskList.querySelector('ul');
        testTasks.forEach((testTask) => {
           const taskItem = document.createElement('task-item');
           taskItem.task = testTask;
           ul.appendChild(taskItem);
        });
    }

}
