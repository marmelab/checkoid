/**
 * Validation semigroup
 * A semigroup is a monoid with two operation instead of one
 * Number addition is a monoid add multiplication and you get a semigroup
 *
 * Valiation is a set composed of Valid, InvalidValidation and AsyncValidation
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
 * ValidValidation is a Validation that passed. It holds no value
 */
export interface ValidValidation {
    isValid: true;
    x: undefined;
    fork: undefined;
    and(
        other: ValidValidation | InvalidValidation | AsyncValidation
    ): ValidValidation | InvalidValidation | AsyncValidation;
    and(other: ValidValidation): ValidValidation;
    and(other: InvalidValidation): InvalidValidation;
    and(other: AsyncValidation): AsyncValidation;
    or(
        other: ValidValidation | InvalidValidation | AsyncValidation
    ): ValidValidation | AsyncValidation;
    or(other: ValidValidation | InvalidValidation): ValidValidation;
    or(other: AsyncValidation): AsyncValidation;
    format: (
        fn: (
            invalidResult: InvalidResult,
            index: number,
            all: InvalidResult[]
        ) => InvalidResult
    ) => ValidValidation;
    getResult: () => void;
}

// function to create a ValidValidation
export const validValidation = (): ValidValidation => ({
    isValid: true,
    x: undefined,
    fork: undefined,
    and(other: any): any {
        if (isAsync(other)) {
            other;
            return asyncValidation
                .of(validValidation())
                .and(other) as AsyncValidation;
        }

        if (isInvalidValidation(other)) {
            return other;
        }

        if (isValidValidation(other)) {
            return validValidation();
        }
    },
    or: (other: any): any => {
        // If other is Async convert ValidValidation to Async(ValidValidation)
        if (isAsync(other)) {
            return asyncValidation.of(validValidation());
        }
        return validValidation();
    }, // no matter the other we keep the validValidation value
    format: (fn) => validValidation(),
    getResult: () => undefined,
});

/**
 * InvalidValidation is a Validation that failed. It holds an array of InvalidResult
 */
export interface InvalidValidation {
    x: InvalidResult[];
    isValid: false;
    fork: undefined;
    and(
        other: ValidValidation | InvalidValidation | AsyncValidation
    ): InvalidValidation | AsyncValidation;
    and(other: AsyncValidation): AsyncValidation;
    and(other: ValidValidation | InvalidValidation): InvalidValidation;

    or(
        other: ValidValidation | InvalidValidation | AsyncValidation
    ): ValidValidation | InvalidValidation | AsyncValidation;
    or(other: AsyncValidation): AsyncValidation;
    or(other: ValidValidation): ValidValidation;
    or(other: InvalidValidation): InvalidValidation;
    format: (
        fn: (
            invalidResult: InvalidResult,
            index: number,
            all: InvalidResult[]
        ) => InvalidResult
    ) => InvalidValidation;
    getResult: () => InvalidResult[];
}

// function to create an invalid, it takes an array of InvalidResult
export const invalidValidation = (x: InvalidResult[]): InvalidValidation => ({
    x,
    isValid: false,
    fork: undefined,
    and: (other: any): any => {
        if (isAsync(other)) {
            return asyncValidation.of(invalidValidation(x)).and(other);
        }

        return isInvalidValidation(other)
            ? invalidValidation(x.concat(other.x))
            : invalidValidation(x);
    },
    or: (other: any): any => {
        if (isAsync(other)) {
            return asyncValidation.of(invalidValidation(x)).or(other);
        }
        return isInvalidValidation(other)
            ? invalidValidation(x.concat(other.x))
            : validValidation();
    },
    format: (fn) => invalidValidation(x.map(fn)), // allows to apply function to invalidValidation message
    getResult: () => x,
});

export type SyncValidation = ValidValidation | InvalidValidation;

/**
 * Type for a function that takes two callback
 * It corresponds to a function that could be passed to create a promise
 * This allows Async to holds an async computation lazily
 * It will call the first reject function if its computation failed
 * or the resolve function if it succeeded.
 * Resolve function must receive either a ValidValidation or an Invalid
 */
type Fork = (
    resolve: (value: ValidValidation | InvalidValidation) => void,
    reject: (value: Error) => void
) => void;

/**
 * AsyncValidation is a Validation that has not yet resolved.
 * It holds a fork function that will resolve to either a ValidValidation or an Invalid
 */
export interface AsyncValidation {
    x: undefined;
    fork: Fork;
    isValid: undefined;
    and(
        v: ValidValidation | InvalidValidation | AsyncValidation
    ): AsyncValidation;
    or(
        v: ValidValidation | InvalidValidation | AsyncValidation
    ): AsyncValidation;
    format: (
        fn: (
            invalidResult: InvalidResult,
            index: number,
            all: InvalidResult[]
        ) => InvalidResult
    ) => AsyncValidation;
    getResult: () => Promise<void | InvalidResult[]>;
}

const isValidValidation = (
    value: ValidValidation | InvalidValidation | AsyncValidation
): value is ValidValidation => value.isValid;

const isInvalidValidation = (
    value: ValidValidation | InvalidValidation | AsyncValidation
): value is InvalidValidation => value.isValid === false;

const isAsync = (
    value: ValidValidation | InvalidValidation | AsyncValidation
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
                    : asyncValidation.of(
                          other as ValidValidation | InvalidValidation
                      )
                ).fork((result2) => resolve(result1.and(result2)), reject);
            }, reject)
        ),
    or: (other) =>
        asyncValidation((resolve, reject) =>
            fork((result1: any) => {
                (isAsync(other)
                    ? other
                    : asyncValidation.of(
                          other as ValidValidation | InvalidValidation
                      )
                ).fork((result2) => resolve(result1.or(result2)), reject);
            }, reject)
        ),
    format: (fn) =>
        asyncValidation((resolve, reject) =>
            fork((result) => resolve(result.format(fn)), reject)
        ),
    fork,
    getResult: () =>
        new Promise(
            fork
        ).then((validation: ValidValidation | InvalidValidation) =>
            validation.getResult()
        ),
});

// Convert ValidValidation or InvalidValidation into AsyncValidation
asyncValidation.of = (
    a: ValidValidation | InvalidValidation
): AsyncValidation => asyncValidation((resolve) => resolve(a));
// helper to create an AsyncValidation that will resolve to a Valid
asyncValidation.validValidation = () =>
    asyncValidation((resolve) => resolve(validValidation()));
// helper to create an AsyncValidation that will resolve to an InvalidValidation holding the given InvalidResults
asyncValidation.invalidValidation = (a: InvalidResult[]) =>
    asyncValidation((resolve) => resolve(invalidValidation(a)));

/**
 * Takes a synchronous validation function returnning either a string or undefined
 * Return a new function that return A ValidValidation when the original function would return undefined
 * or an invalidValidation when the original function would return a string
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
            return invalidValidation([{ message: result, value }]);
        }

        return validValidation();
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
                        result
                            ? invalidValidation([{ message: result, value }])
                            : validValidation()
                    )
                )
                .catch(reject);
        } catch (error) {
            // catch eventual synchronous error
            reject(error);
        }
    });
