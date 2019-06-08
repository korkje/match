type Primitive = bigint | boolean | null | number | string | symbol | undefined;
type NotFunction = Primitive | { [key: string]: unknown; } | unknown[];

type Predictor<T> = (value: T) => boolean;
type Predicate<T> = Predictor<T> | T;

type Result<T> = ((value: T) => unknown) | NotFunction;
type ResultValue<T, U> = U extends ((value: T) => infer V) ? NoVoid<V> : U;
type NoVoid<T> = T extends void ? undefined : T;

class Match<T> {
    constructor(private readonly value: T) { }

    private isPredictor(pred: Predicate<T>): pred is Predictor<T> {
        return typeof(pred) === 'function';
    }

    private evaluate(pred: Predicate<T>) {
        return this.isPredictor(pred)
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

function match<T>(value: T) {
    return new Match(value);
}

export default match;
export { match };
