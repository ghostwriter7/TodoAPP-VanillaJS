export class TaskService {
    #tasks;
    #activeDate = new Date().toLocaleDateString();

    constructor() {
        this.#tasks = {
            [this.#activeDate]: []
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

    updateTask(id, payload) {
        this.tasksStore[this.#activeDate] = this.tasksStore[this.#activeDate].map((task) => task.id === id ? { ...task, ...payload } : task);
    }
}
