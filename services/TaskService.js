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

    async addTask(task, date) {
        const todo = await app.dataSource.addOne('todo', { date: this.#activeDate, task, isComplete: false });
        this.tasksStore[date] = [{ ...todo }, ...this.tasksStore[date]];
    }

    getTasks(date) {
        return [...this.tasksStore[date]];
    }

    async updateTask(id, payload) {
        const updatedTask = await app.dataSource.updateOneById('todo', id, payload);
        this.tasksStore[this.#activeDate] = this.tasksStore[this.#activeDate].map((task) => task.id === id ? { ...updatedTask } : task);
    }

    async deleteTask(id) {
        await app.dataSource.deleteOneById('todo', id);
        this.tasksStore[this.#activeDate] = this.tasksStore[this.#activeDate].filter((task) => task.id !== id);
    }

    async loadTasks() {
        const result = await app.dataSource.getAllByIndexAndValue('todo', 'idx-todo-date', this.#activeDate);
        this.tasksStore[this.#activeDate] = [...result];
    }

    setActiveView(date) {
        this.#activeDate = date;
    }
}
