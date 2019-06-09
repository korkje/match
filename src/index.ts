type Primitive = bigint | boolean | null | number | string | symbol | undefined;
type NotAFunction = Primitive | { [key: string]: unknown; } | unknown[];

type Predicate<T> = ((value: T) => boolean) | T;

type Result<T> = ((value: T) => unknown) | NotAFunction;
type ResultValue<T, U> = U extends ((value: T) => infer V) ? NoVoid<V> : U;
type NoVoid<T> = T extends void ? undefined : T;

class Match<T extends NotAFunction> {
    constructor(private readonly value: T) { }

    private evaluate(pred: Predicate<T>) {
        return typeof pred === 'function'
            ? pred(this.value)
            : pred === this.value;
    }

    private createResult<U>(res: U): ResultValue<T, U> {
        return typeof res === 'function'
            ? res(this.value)
            : res;
    }

    on<U extends Result<T>>(pred: Predicate<T>, res: U) {
        return this.evaluate(pred)
            ? new Matched(this.createResult(res))
            : this;
    }

    default<U extends Result<T>>(res: U) {
        return new Defaulted(this.createResult(res));
    }

    result() {
        return undefined;
    }
}

class Matched<T> {
    constructor(private readonly res: T) { }

    on() {
        return this;
    }

    default() {
        return new Defaulted(this.res);
    }

    result() {
        return this.res;
    }
}

class Defaulted<T> {
    constructor(private readonly res: T) { }

    result() {
        return this.res;
    }
}

function match<T extends NotAFunction>(value: T) {
    return new Match(value);
}

export default match;
export { match };
