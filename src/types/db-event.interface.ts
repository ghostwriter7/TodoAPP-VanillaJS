export interface DbEvent<T> extends Event {
    target: EventTarget & { error: Error, result: T }
}
