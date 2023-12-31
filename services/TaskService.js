import { toTaskId } from "../helpers/date.js";
import { taskChangeEvent, taskLoadingEndEvent, taskLoadingStartEvent } from "../consts/events.js";
import { collection, getDocs, query, doc, setDoc, deleteDoc, updateDoc, where, writeBatch } from "firebase/firestore";

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

    async addTask(task) {
        const taskCollection = collection(this.#firebase.firestore, `users/ghostwriter7/tasks`);
        const taskDoc = doc(taskCollection);
        const payload = {
            date: new Date(this.#activeDate),
            ...task,
            isComplete: false,
            order: this.tasksStore[this.#activeDate].length + 1,
            updatedAt: Date.now()
        };
        setDoc(taskDoc, payload);
        const todo = await app.dataSource.addOne('todo', { ...payload, id: taskDoc.id, date: toTaskId(payload.date) });
        this.tasksStore[this.#activeDate] = [...this.tasksStore[this.#activeDate], { ...todo }];
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
        const taskDoc = doc(this.#firebase.firestore, `users/ghostwriter7/tasks/${id}`);
        const update = { ...payload, updatedAt: Date.now() };
        updateDoc(taskDoc, update);
        const updatedTask = await app.dataSource.updateOneById('todo', id, update);
        this.tasksStore[this.#activeDate] = this.tasksStore[this.#activeDate].map((task) => task.id === id ? { ...updatedTask } : task);
    }

    async updateManyTasks(updates) {
        const updatedAt = Date.now();
        const collectionRef = collection(this.#firebase.firestore, 'users/ghostwriter7/tasks');
        const batch = writeBatch(this.#firebase.firestore);

        const requests = updates.map(({ id, ...update }) => {
            const payload = { ...update, updatedAt };
            batch.update(doc(collectionRef, id), payload);
            return app.dataSource.updateOneById('todo', id, payload);
        });
        await Promise.all(requests);

        batch.commit();
    }

    async deleteTask(id) {
        const taskDoc = doc(this.#firebase.firestore, `users/ghostwriter7/days/${this.#activeDate}/tasks/${id}`);
        deleteDoc(taskDoc);
        await app.dataSource.deleteOneById('todo', id);
        this.tasksStore[this.#activeDate] = this.tasksStore[this.#activeDate].filter((task) => task.id !== id);
    }

    async loadTasks(date) {
        this.#activeDate = date;

        if (!this.#syncMap.get(this.#activeDate) && navigator.onLine) {
            dispatchEvent(new Event(taskLoadingStartEvent));
            await this.#syncDataFromFirestore();
            dispatchEvent(new Event(taskLoadingEndEvent));
            this.#syncMap.set(this.#activeDate, true);
        }

        const result = await app.dataSource.getAllByIndexAndValue('todo', 'idx-todo-date', this.#activeDate);
        this.tasksStore[this.#activeDate] = [...result].sort((a, b) => a.order - b.order > 0 ? 1 : -1);
    }

    async #syncDataFromFirestore() {
        const taskCollection = collection(this.#firebase.firestore, `users/ghostwriter7/tasks`);
        const response = await getDocs(
            query(taskCollection,
                where('date', '>=', this.#getBeginningOfTheDay()),
                where('date', '<=', this.#getEndingOfTheDay())));
        const storedTasks = response.docs.map((task) => {
            const data = task.data();
            data.date = toTaskId(data.date.toDate());
            return { data, id: task.id };
        });
        await app.dataSource.upsertMany('todo', storedTasks);
    }

    #getBeginningOfTheDay() {
        const beginning = new Date(this.#activeDate);
        beginning.setHours(0);
        beginning.setMinutes(0);
        beginning.setSeconds(0);
        return beginning;
    }

    #getEndingOfTheDay() {
        const ending = new Date(this.#activeDate);
        ending.setHours(23);
        ending.setMinutes(59);
        ending.setSeconds(59);
        return ending;
    }
}
