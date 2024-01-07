export class Injector {
    private static dependencies = new Map();

    public static register<T extends new (...args: unknown[]) => unknown>(key: T, dependency: InstanceType<T>): void {
        this.dependencies.set(key, dependency);
    }

    public static resolve<T extends new (...args: unknown[]) => unknown>(key: T): InstanceType<T> {
        return this.dependencies.get(key);
    }
}
