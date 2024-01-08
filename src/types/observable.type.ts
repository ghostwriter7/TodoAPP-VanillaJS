import { Observer } from "./observer.type.ts";

export type Observable<T> = { subscribe: (observer: Observer<T>) => { unsubscribe: () => void } }
