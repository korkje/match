
/**
 * match-on
 *
 * Aims to replace switch statements with a more functional style
 */

/**
 * Generics
 *
 * M: (Match)
 * The type of the param passed to the 'match' function
 * 
 * R_I: (Result - Input)
 * The type of the second param passed to the 'on' function, or the param
 * passed to the 'default' function
 * 
 * R_O: (Result - Output)
 * The type of the final result after processing the second param passed to the
 * 'on' function. Equal to ResOut<R_I>
 * 
 * F_O: (Function - Output)
 * The inferred return type of R_I if it is a function
 */

/**
 * NotFunction
 * 
 * Helper type that describes all types except Function
 */

type NotFunctionValue = symbol | boolean | string | number | null | undefined;

interface NotFunctionObject { [key: string]: NotFunction }

interface NotFunctionArray extends Array<NotFunction> { }

type NotFunction = NotFunctionValue | NotFunctionObject | NotFunctionArray;

/**
 * Prediction
 * 
 * A Prediction<M> can either be a function (Predictor<M>) that evaluates to a
 * boolean, or a value of type M that is to be compared to the value passed to
 * the match function
 */

type Predictor<M> = (m: M) => boolean;

const isPredictor = <M>(p: Prediction<M>): p is Predictor<M> =>
    typeof(p) === 'function';

type Prediction<M> = Predictor<M> | M;

const prediction = <M>(p: Prediction<M>, x: M) =>
    isPredictor(p) ? p(x) : p === x;
 
/**
 * Result
 * 
 * A Result<M> can either just be a value, or a function, in which case it will
 * be evaluated
 */

type ResIn<M> = ((m: M) => void) | NotFunction;

type ResOut<R_I, M> = R_I extends (m: M) => infer F_O ? NoVoid<F_O> : R_I;

type NoVoid<F_O> = F_O extends void ? undefined : F_O;

const result = <R_I, M>(r: R_I, m: M): ResOut<R_I, M> =>
    typeof r === 'function' ? r(m) : r;

/**
 * Matched / Defaulted
 * 
 * This mocks the main match function, and will simply propagate the value that
 * has been found to match
 */

type Matched<R_O> = {
    on: () => Matched<R_O>;
    default: () => WithResult<R_O>;
} & WithResult<R_O>;

const matched = <R_O>(r: R_O): Matched<R_O> => ({
    on: () => matched(r),
    default: () => defaulted(r),
    result: () => r
});

type WithResult<R_O> = {
    result: () => R_O;
};

const defaulted = <R_O>(r: R_O): WithResult<R_O> => ({
    result: () => r
});

/**
 * Match
 * 
 * This is the main function, that takes a value and uses function chaining to
 * check for different cases, as well as to provide a default case and an option
 * to get the result
 */

type Match<M> = {
    on: <R_I extends ResIn<M>>(p: Prediction<M>, r: R_I) => Matched<ResOut<R_I, M>> | Match<M>,
    default: <R_I extends ResIn<M>>(d: R_I) => WithResult<ResOut<R_I, M>>
} & WithResult<undefined>;

const match = <M>(m: M): Match<M> => ({
    on: (p, r) => prediction(p, m)
        ? matched(result(r, m))
        : match(m),
    default: d => defaulted(result(d, m)),
    result: () => undefined
});

export default match;

export { match };
