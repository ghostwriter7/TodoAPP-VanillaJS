import type { DatasourceConfig, DbEvent } from "../types";

export class DataSource {
    private readonly config: DatasourceConfig = {
        name: 'tododb',
        version: 1
    };
    private db: IDBDatabase;

    addOne<T>(objectStoreKey: string, item: T): Promise<T> {
        return new Promise(async (resolve, reject) => {
            const dataSource = await this.#getDataSource();
            const transaction = dataSource.transaction(objectStoreKey, 'readwrite');
            const request = transaction.objectStore(objectStoreKey).put(item);

            request.onsuccess = ({ target }: DbEvent<T>) => {
                const id = target.result;
                resolve({ ...item, id });
            }
            request.onerror = ({ target }: DbEvent<T>) => reject(target.error)
        });
    }

    deleteOneById(objectStoreKey: string, id: string): Promise<true> {
        return new Promise(async (resolve, reject) => {
            const dataSource = await this.#getDataSource();
            const transaction = dataSource.transaction(objectStoreKey, 'readwrite');
            const request = transaction.objectStore(objectStoreKey).delete(id);

            request.onsuccess = () => resolve(true);
            request.onerror = ({ target }: DbEvent<unknown>) => reject(target.error)
        });
    }

    updateOneById<T>(objectStoreKey: string, id: string, payload: Partial<T>): Promise<T> {
        return new Promise(async (resolve, reject) => {
            const existingRecord = await this.getOneById<T>(objectStoreKey, id);
            const dataSource = await this.#getDataSource();
            const transaction = dataSource.transaction(objectStoreKey, 'readwrite');
            const updatedRecord = { ...existingRecord, ...payload };
            const request = transaction.objectStore(objectStoreKey).put(updatedRecord);

            request.onsuccess = () => resolve(updatedRecord);
            request.onerror = ({ target }: DbEvent<T>) => reject(target.error);
        });
    }

    upsertMany<T>(objectStoreName: string, updates: { data: T, id: string }[]): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const requests: Promise<void>[] = updates.map(({ data, id }) => new Promise(async (resolve, reject) => {
                    const existingRecord = await this.getOneById<T>(objectStoreName, id);
                    await (existingRecord ? this.updateOneById(objectStoreName, id, { ...existingRecord, ...data }) : this.addOne(objectStoreName, {
                        ...data,
                        id
                    }))
                    resolve();
                }));
                await Promise.all(requests);
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    getAllByIndexAndValue<T = unknown>(objectStoreName: string, index: string, value: string | number): Promise<T[]> {
        return new Promise(async (resolve, reject) => {
            const dataSource = await this.#getDataSource();
            const store = dataSource.transaction(objectStoreName, 'readonly').objectStore(objectStoreName);
            const dbIndex = store.index(index);

            const range = IDBKeyRange.only(value);
            const request = dbIndex.getAll(range);

            request.onsuccess = (({ target }: DbEvent<T>) => resolve(target.result));
            request.onerror = (({ target }: DbEvent<T>) => reject(target.error))
        });
    }

    getOneById<T = unknown>(objectStoreKey: string, id: string): Promise<T> {
        return new Promise(async (resolve, reject) => {
            const dataSource = await this.#getDataSource();
            const transaction = dataSource.transaction(objectStoreKey, 'readonly');
            const request = transaction.objectStore(objectStoreKey).get(id);

            request.onsuccess = ({ target }: DbEvent<T>) => resolve(target.result);
            request.onerror = ({ target }: DbEvent<T>) => reject(target.error);
        })
    }

    #getDataSource(): Promise<IDBDatabase> {
        return new Promise((resolve) => {
            if (this.db) {
                resolve(this.db);
            } else {
                const request = indexedDB.open(this.config.name, this.config.version);

                request.onsuccess = ({ target }: DbEvent<IDBDatabase>) => {
                    this.db = target.result;
                    resolve(this.db);
                }

                request.onupgradeneeded = ({ target }: IDBVersionChangeEvent) => {
                    this.db = (target as EventTarget & { result: IDBDatabase }).result;

                    if (!this.db.objectStoreNames.contains('todo')) {
                        const todoStore = this.db.createObjectStore('todo', { keyPath: 'id' });
                        todoStore.createIndex('idx-todo-date', 'date', { unique: false });
                    }
                }
            }
        });
    }
}
