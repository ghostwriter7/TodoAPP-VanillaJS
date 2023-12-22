export class TaskService {
    #tasks;

    constructor() {
        this.#tasks = {
            [new Date().toLocaleDateString()]: []
        };

        this.tasksStore = new Proxy(this.#tasks, {
            set: (target, property, newValue) => {
                target[property] = newValue;
                window.dispatchEvent(new Event('apptaskchange'));
                return true;
            }
        });
    }

    addTask(task, date) {
        this.tasksStore[date] = [{
            task,
            isComplete: false,
            id: this.tasksStore[date].length + 1
        }, ...this.tasksStore[date]]
    }

    getTasks(date) {
        return [...this.#tasks[date]];
    }
}
