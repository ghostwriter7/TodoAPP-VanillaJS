import { Observable, Observer } from "../types";

export class Subject<T = unknown> {
    private observers: Observer<T>[] = [];

    asObservable(): Observable<T> {
        const subscribe = this.subscribe.bind(this);
        return { subscribe };
    }

    subscribe(observer: Observer<T>): { unsubscribe: () => void } {
        this.observers.push(observer);
        return { unsubscribe: () => this.observers = this.observers.filter((existingObserver) => existingObserver !== observer) };
    }

    next(value: T): void {
        this.observers.forEach((observer) => observer.next(value));
    }
}
