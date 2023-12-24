export class Subject {
    #observers = [];

    asObservable() {
        const subscribe = this.subscribe.bind(this);
        return { subscribe };
    }

    subscribe(observer) {
        this.#observers.push(observer);
        return { unsubscribe: () => this.#observers = this.#observers.filter((existingObserver) => existingObserver !== observer) }
    }

    next(value) {
        this.#observers.forEach((observer) => observer.next(value))
    }
}
