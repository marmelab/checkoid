/**
 * Validation semigroup
 * A semigroup is a monoid with two operation instead of one
 * Number addition is a monoid add multiplication and you get a semigroup
 *
 * Valiation is a set composed of Valid, Invalid and AsyncValidation
 * It has two operations `and` and `or`.
 * When combining two validation with `and` or `or` you will always get back a Validation
 * Validation is internal and allows Validator to be combined
 */

export interface InvalidResult {
    value: any;
    message: string;
    key?: string[];
}

/**
 * Valid is a Validation that passed. It holds no value
 */
export interface Valid {
    isValid: true;
    x: undefined;
    fork: undefined;
    and(
        other: Valid | Invalid | AsyncValidation
    ): Valid | Invalid | AsyncValidation;
    and(other: Valid): Valid;
    and(other: Invalid): Invalid;
    and(other: AsyncValidation): AsyncValidation;
    or(other: Valid | Invalid | AsyncValidation): Valid | AsyncValidation;
    or(other: Valid | Invalid): Valid;
    or(other: AsyncValidation): AsyncValidation;
    format: (
        fn: (
            invalidResult: InvalidResult,
            index: number,
            all: InvalidResult[]
        ) => InvalidResult
    ) => Valid;
    getResult: () => void;
}

// function to create a Valid
export const valid = (): Valid => ({
    isValid: true,
    x: undefined,
    fork: undefined,
    and(other: any): any {
        if (isAsync(other)) {
            other;
            return asyncValidation.of(valid()).and(other) as AsyncValidation;
        }

        if (isInvalid(other)) {
            return other;
        }

        if (isValid(other)) {
            return valid();
        }
    },
    or: (other: any): any => {
        // If other is Async convert Valid to Async(Valid)
        if (isAsync(other)) {
            return asyncValidation.of(valid());
        }
        return valid();
    }, // no matter the other we keep the valid value
    format: (fn) => valid(),
    getResult: () => undefined,
});

/**
 * Invalid is a Validation that failed. It holds an array of InvalidResult
 */
export interface Invalid {
    x: InvalidResult[];
    isValid: false;
    fork: undefined;
    and(other: Valid | Invalid | AsyncValidation): Invalid | AsyncValidation;
    and(other: AsyncValidation): AsyncValidation;
    and(other: Valid | Invalid): Invalid;

    or(
        other: Valid | Invalid | AsyncValidation
    ): Valid | Invalid | AsyncValidation;
    or(other: AsyncValidation): AsyncValidation;
    or(other: Valid): Valid;
    or(other: Invalid): Invalid;
    format: (
        fn: (
            invalidResult: InvalidResult,
            index: number,
            all: InvalidResult[]
        ) => InvalidResult
    ) => Invalid;
    getResult: () => InvalidResult[];
}

// function to create an invalid, it takes an array of InvalidResult
export const invalid = (x: InvalidResult[]): Invalid => ({
    x,
    isValid: false,
    fork: undefined,
    and: (other: any): any => {
        if (isAsync(other)) {
            return asyncValidation.of(invalid(x)).and(other);
        }

        return isInvalid(other) ? invalid(x.concat(other.x)) : invalid(x);
    },
    or: (other: any): any => {
        if (isAsync(other)) {
            return asyncValidation.of(invalid(x)).or(other);
        }
        return isInvalid(other) ? invalid(x.concat(other.x)) : valid();
    },
    format: (fn) => invalid(x.map(fn)), // allows to apply function to invalid message
    getResult: () => x,
});

export type SyncValidation = Valid | Invalid;

/**
 * Type for a function that takes two callback
 * It corresponds to a function that could be passed to create a promise
 * This allows Async to holds an async computation lazily
 * It will call the first reject function if its computation failed
 * or the resolve function if it succeeded.
 * Resolve function must receive either a Valid or an Invalid
 */
type Fork = (
    resolve: (value: Valid | Invalid) => void,
    reject: (value: Error) => void
) => void;

/**
 * AsyncValidation is a Validation that has not yet resolved.
 * It holds a fork function that will resolve to either a Valid or an Invalid
 */
export interface AsyncValidation {
    x: undefined;
    fork: Fork;
    isValid: undefined;
    and(v: Valid | Invalid | AsyncValidation): AsyncValidation;
    or(v: Valid | Invalid | AsyncValidation): AsyncValidation;
    format: (
        fn: (
            invalidResult: InvalidResult,
            index: number,
            all: InvalidResult[]
        ) => InvalidResult
    ) => AsyncValidation;
    getResult: () => Promise<void | InvalidResult[]>;
}

const isValid = (value: Valid | Invalid | AsyncValidation): value is Valid =>
    value.isValid;

const isInvalid = (
    value: Valid | Invalid | AsyncValidation
): value is Invalid => value.isValid === false;

const isAsync = (
    value: Valid | Invalid | AsyncValidation
): value is AsyncValidation => !!value.fork;

// function to create an asyncValidation
// it takes a fork function like a promise would, unlike a promise,
// it will not execute the function until getResult is called
export const asyncValidation = (fork: Fork): AsyncValidation => ({
    isValid: undefined,
    x: undefined,
    and: (other) =>
        asyncValidation((resolve, reject) =>
            fork((result1: any) => {
                (isAsync(other)
                    ? other
                    : asyncValidation.of(other as Valid | Invalid)
                ).fork((result2) => resolve(result1.and(result2)), reject);
            }, reject)
        ),
    or: (other) =>
        asyncValidation((resolve, reject) =>
            fork((result1: any) => {
                (isAsync(other)
                    ? other
                    : asyncValidation.of(other as Valid | Invalid)
                ).fork((result2) => resolve(result1.or(result2)), reject);
            }, reject)
        ),
    format: (fn) =>
        asyncValidation((resolve, reject) =>
            fork((result) => resolve(result.format(fn)), reject)
        ),
    fork,
    getResult: () =>
        new Promise(fork).then((validation: Valid | Invalid) =>
            validation.getResult()
        ),
});

// Convert Valid or Invalid into AsyncValidation
asyncValidation.of = (a: Valid | Invalid): AsyncValidation =>
    asyncValidation((resolve) => resolve(a));
// helper to create an AsyncValidation that will resolve to a Valid
asyncValidation.valid = () => asyncValidation((resolve) => resolve(valid()));
// helper to create an AsyncValidation that will resolve to an Invalid holding the given InvalidResults
asyncValidation.invalid = (a: InvalidResult[]) =>
    asyncValidation((resolve) => resolve(invalid(a)));

/**
 * Takes a synchronous validation function returnning either a string or undefined
 * Return a new function that return A Valid when the original function would return undefined
 * or an invalid when the original function would return a string
 * */
export function lift(fn: (x: any) => string | void) {
    return (value: any) => {
        const result = fn(value);
        if (result && (result as any).then) {
            throw new Error(
                "lift only accept synchronous function, use asyncLift instead"
            );
        }

        if (result) {
            return invalid([{ message: result, value }]);
        }

        return valid();
    };
}

/**
 * Takes an async validation function that resolve to either a string or undefined
 * Return a new function that return an AsyncValidation
 * */
export const asyncLift = (fn: (x: any) => Promise<string | void>) => (
    value: any
) =>
    asyncValidation((resolve, reject) => {
        try {
            // Promise.resolve will convert the function result to a promise if it is not
            Promise.resolve(fn(value))
                .then((result) =>
                    resolve(
                        result ? invalid([{ message: result, value }]) : valid()
                    )
                )
                .catch(reject);
        } catch (error) {
            // catch eventual synchronous error
            reject(error);
        }
    });
