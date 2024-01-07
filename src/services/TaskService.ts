import { toTaskId } from "@helpers/date";
import { taskChangeEvent, taskLoadingEndEvent, taskLoadingStartEvent } from "@consts/events";
import { collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where, writeBatch } from "firebase/firestore";
import { DataSource, Firebase, Injector } from "@services/index";
import type { TaskItem, TaskStore, TaskSummary } from "../types";

export class TaskService {
    private readonly dataSource: DataSource;
    private readonly firebase: Firebase;
    private readonly tasks: TaskStore;
    private readonly tasksStore: TaskStore;

    private activeDate: string = toTaskId(new Date());
    #syncMap = new Map();

    constructor() {
        this.firebase = Injector.resolve(Firebase);
        this.tasks = {
            [this.activeDate]: []
        };
        this.tasksStore = new Proxy(this.tasks, {
            set: (target: TaskStore, property: keyof TaskStore, newValue: TaskStore[keyof TaskStore]): boolean => {
                target[property] = newValue;
                window.dispatchEvent(new Event(taskChangeEvent));
                return true;
            }
        });
    }

    async addTask(task: Pick<TaskItem, 'task' | 'description' | 'rate' | 'effort'>): Promise<void> {
        const taskCollection = collection(this.firebase.firestore, `users/${this.firebase.auth.currentUser.uid}/tasks`);
        const taskDoc = doc(taskCollection);
        const payload: TaskItem = {
            date: new Date(this.activeDate),
            ...task,
            isComplete: false,
            order: this.tasksStore[this.activeDate].length + 1,
            updatedAt: Date.now()
        };
        setDoc(taskDoc, payload);
        const todo = await this.dataSource.addOne<TaskItem>('todo', { ...payload, id: taskDoc.id, date: toTaskId(payload.date) });
        this.tasksStore[this.activeDate] = [...this.tasksStore[this.activeDate], { ...todo }];
    }

    getTasks(date: string): TaskItem[] {
        return [...this.tasksStore[date]];
    }

    getTasksSummary(date: string): TaskSummary {
        const tasks = this.getTasks(date);
        const complete = tasks.reduce((active, task) => active + (task.isComplete ? 1 : 0), 0);
        return {
            complete,
            total: tasks.length
        }
    }

    async updateTask(id: string, payload: Partial<TaskItem>): Promise<void> {
        const taskDoc = doc(this.firebase.firestore, `users/${this.firebase.auth.currentUser.uid}/tasks/${id}`);
        const update = { ...payload, updatedAt: Date.now() };
        updateDoc(taskDoc, update);
        const updatedTask = await this.dataSource.updateOneById('todo', id, update);
        this.tasksStore[this.activeDate] = this.tasksStore[this.activeDate].map((task) => task.id === id ? { ...updatedTask } : task);
    }

    async updateManyTasks(updates: Partial<TaskItem>[]): Promise<void> {
        const updatedAt = Date.now();
        const collectionRef = collection(this.firebase.firestore, `users/${this.firebase.auth.currentUser.uid}/tasks`);
        const batch = writeBatch(this.firebase.firestore);

        const requests = updates.map(({ id, ...update }) => {
            const payload = { ...update, updatedAt };
            batch.update(doc(collectionRef, id), payload);
            return this.dataSource.updateOneById('todo', id, payload);
        });
        await Promise.all(requests);

        batch.commit();
    }

    async deleteTask(id: string): Promise<void> {
        const taskDoc = doc(this.firebase.firestore, `users/${this.firebase.auth.currentUser.uid}/tasks/${id}`);
        deleteDoc(taskDoc);
        await this.dataSource.deleteOneById('todo', id);
        this.tasksStore[this.activeDate] = this.tasksStore[this.activeDate].filter((task) => task.id !== id);
    }

    async loadTasks(date: string): Promise<void> {
        this.activeDate = date;

        if (!this.#syncMap.get(this.activeDate) && navigator.onLine) {
            dispatchEvent(new Event(taskLoadingStartEvent));
            await this.#syncDataFromFirestore();
            dispatchEvent(new Event(taskLoadingEndEvent));
            this.#syncMap.set(this.activeDate, true);
        }

        const result = await this.dataSource.getAllByIndexAndValue<TaskItem>('todo', 'idx-todo-date', this.activeDate);
        this.tasksStore[this.activeDate] = [...result].sort((a, b) => a.order - b.order > 0 ? 1 : -1);
    }

    async #syncDataFromFirestore(): Promise<void> {
        const taskCollection = collection(this.firebase.firestore, `users/${this.firebase.auth.currentUser.uid}/tasks`);
        const response = await getDocs(
            query(taskCollection,
                where('date', '>=', this.#getBeginningOfTheDay()),
                where('date', '<=', this.#getEndingOfTheDay())));
        const storedTasks = response.docs.map((task) => {
            const data = task.data();
            data.date = toTaskId(data.date.toDate());
            return { data, id: task.id };
        });
        await this.dataSource.upsertMany('todo', storedTasks);
    }

    #getBeginningOfTheDay(): Date {
        const beginning = new Date(this.activeDate);
        beginning.setHours(0);
        beginning.setMinutes(0);
        beginning.setSeconds(0);
        return beginning;
    }

    #getEndingOfTheDay(): Date {
        const ending = new Date(this.activeDate);
        ending.setHours(23);
        ending.setMinutes(59);
        ending.setSeconds(59);
        return ending;
    }
}
