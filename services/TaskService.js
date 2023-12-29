import { toTaskId } from "../helpers/date.js";
import { taskChangeEvent } from "../consts/events.js";
import { collection, addDoc, getDocs, query } from "firebase/firestore";

export class TaskService {
    #tasks;
    #firebase;
    #activeDate = toTaskId(new Date());
    #syncMap = new Map();

    constructor(firebase) {
        this.#firebase = firebase;
        this.#tasks = {
            [this.#activeDate]: []
        };
        this.tasksStore = new Proxy(this.#tasks, {
            set: (target, property, newValue) => {
                target[property] = newValue;
                window.dispatchEvent(new Event(taskChangeEvent));
                return true;
            }
        });
    }

    async addTask(task, date) {
        const payload = {
            date: this.#activeDate,
            task,
            isComplete: false,
            order: this.tasksStore[date].length + 1,
            updatedAt: Date.now()
        };
        const todo = await app.dataSource.addOne('todo', payload);
        this.tasksStore[date] = [...this.tasksStore[date], { ...todo }];

        const taskCollection = collection(this.#firebase.firestore, `users/ghostwriter7/days/${this.#activeDate}/tasks`);
        addDoc(taskCollection, todo);
    }

    getTasks(date) {
        return [...this.tasksStore[date]];
    }

    getTasksSummary(date) {
        const tasks = this.getTasks(date);
        const complete = tasks.reduce((active, task) => active + (task.isComplete ? 1 : 0), 0);
        return {
            complete,
            total: tasks.length
        }
    }

    async updateTask(id, payload) {
        const updatedTask = await app.dataSource.updateOneById('todo', id, { ...payload, updatedAt: Date.now() });
        this.tasksStore[this.#activeDate] = this.tasksStore[this.#activeDate].map((task) => task.id === id ? { ...updatedTask } : task);
    }

    async updateManyTasks(updates) {
        const requests = updates.map(({ id, ...update }) => app.dataSource.updateOneById('todo', id, {
            ...update,
            updatedAt: Date.now()
        }));
        await Promise.all(requests);
        this.loadTasks();
    }

    async deleteTask(id) {
        await app.dataSource.deleteOneById('todo', id);
        this.tasksStore[this.#activeDate] = this.tasksStore[this.#activeDate].filter((task) => task.id !== id);
    }

    async loadTasks() {
        const result = await app.dataSource.getAllByIndexAndValue('todo', 'idx-todo-date', this.#activeDate);
        this.tasksStore[this.#activeDate] = [...result].sort((a, b) => a.order - b.order > 0 ? 1 : -1);
    }

    async setActiveView(date) {
        this.#activeDate = date;

        if (!this.#syncMap.get(this.#activeDate) && navigator.onLine) {
            await this.#syncDataFromFirestore();
            this.#syncMap.set(this.#activeDate, true);
        }

    }

    async #syncDataFromFirestore() {
        const taskCollection = collection(this.#firebase.firestore, `users/ghostwriter7/days/${this.#activeDate}/tasks`);
        const response = await getDocs(query(taskCollection));
        const storedTasks = response.docs.map((task) => ({ data: task.data(), id: task.id }));
        await app.dataSource.upsertMany('todo', storedTasks);
    }
}
