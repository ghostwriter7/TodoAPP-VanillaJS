export class DataSource {
    #config = {
        name: 'tododb',
        version: 1
    };
    #db;

    constructor() {
    }

    addOne(objectStoreKey, item) {
        return new Promise(async (resolve, reject) => {
            const dataSource = await this.#getDataSource();
            const transaction = dataSource.transaction(objectStoreKey, 'readwrite');
            const request = transaction.objectStore(objectStoreKey).add(item);

            request.onsuccess = ({ target }) => {
                const id = target.result;
                resolve({ ...item, id });
            }
            request.onerror = ({ target }) => reject(target.error)
        });
    }

    deleteOneById(objectStoreKey, id) {
        return new Promise(async (resolve, reject) => {
            const dataSource = await this.#getDataSource();
            const transaction = dataSource.transaction(objectStoreKey, 'readwrite');
            const request = transaction.objectStore(objectStoreKey).delete(id);

            request.onsuccess = () => resolve(true);
            request.onerror = ({ target }) => reject(target.error)
        });
    }

    getAllByIndexAndValue(objectStoreName, index, value) {
        return new Promise(async (resolve, reject) => {
            const dataSource = await this.#getDataSource();
            const store = dataSource.transaction(objectStoreName, 'readonly').objectStore(objectStoreName);
            const dbIndex = store.index(index);

            const range = IDBKeyRange.only(value);
            const request = dbIndex.getAll(range);

            request.onsuccess = (({ target }) => resolve(target.result));
            request.onerror = (({ target }) => reject(target.error))
        });
    }

    #getDataSource() {
        return new Promise((resolve) => {
            if (this.#db) {
                resolve(this.#db);
            } else {
                const request = indexedDB.open(this.#config.name, this.#config.version);

                request.onsuccess = ({ target }) => {
                    this.#db = target.result;
                    resolve(this.#db);
                }

                request.onupgradeneeded = ({ target }) => {
                    this.#db = target.result;

                    if (!this.#db.objectStoreNames.contains('todo')) {
                        const todoStore = this.#db.createObjectStore('todo', { autoIncrement: true, keyPath: 'id' });
                        todoStore.createIndex('idx-todo-date', 'date', { unique: false });
                    }
                }
            }
        });
    }
}
