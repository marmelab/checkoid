export interface ValidationResult {
    value: any;
    predicate: string;
    valid: boolean;
    key?: string[];
}

interface ValidValidation {
    isValid: true;
    results: ValidationResult[];
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
    xor(
        other: ValidValidation | InvalidValidation | AsyncValidation
    ): ValidValidation | InvalidValidation | AsyncValidation;
    not(): InvalidValidation;
    format: (
        fn: (
            invalidResult: ValidationResult,
            index: number,
            all: ValidationResult[]
        ) => ValidationResult
    ) => ValidValidation;
    getResult: () => undefined;
}
interface InvalidValidation {
    isValid: false;
    results: ValidationResult[];
    fork: undefined;
    and(
        other: ValidValidation | InvalidValidation | AsyncValidation
    ): InvalidValidation | AsyncValidation;
    and(other: ValidValidation | InvalidValidation): InvalidValidation;
    and(other: AsyncValidation): AsyncValidation;
    or(
        other: ValidValidation | InvalidValidation | AsyncValidation
    ): ValidValidation | InvalidValidation | AsyncValidation;
    or(other: ValidValidation): ValidValidation;
    or(other: InvalidValidation): InvalidValidation;
    or(other: AsyncValidation): AsyncValidation;
    xor(
        other: ValidValidation | InvalidValidation | AsyncValidation
    ): ValidValidation | InvalidValidation | AsyncValidation;
    not(): ValidValidation;
    format: (
        fn: (
            invalidResult: ValidationResult,
            index: number,
            all: ValidationResult[]
        ) => ValidationResult
    ) => InvalidValidation;
    getResult: () => ValidationResult[];
}

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

interface AsyncValidation {
    isValid: undefined;
    results: undefined;
    fork: Fork;
    and(
        other: ValidValidation | InvalidValidation | AsyncValidation
    ): AsyncValidation;
    or(
        other: ValidValidation | InvalidValidation | AsyncValidation
    ): AsyncValidation;
    xor(
        other: ValidValidation | InvalidValidation | AsyncValidation
    ): AsyncValidation;
    not(): AsyncValidation;
    format: (
        fn: (
            invalidResult: ValidationResult,
            index: number,
            all: ValidationResult[]
        ) => ValidationResult
    ) => AsyncValidation;
    getResult: () => Promise<void | ValidationResult[]>;
}

const isValidValidation = (
    value: ValidValidation | InvalidValidation
): value is ValidValidation => value.isValid;

const isInvalidValidation = (
    value: ValidValidation | InvalidValidation
): value is InvalidValidation => value.isValid === false;

const isAsyncValidation = (
    value: ValidValidation | InvalidValidation | AsyncValidation
): value is AsyncValidation => !!value.fork;

export const createValidValidation = (
    results: ValidationResult[]
): ValidValidation => ({
    results,
    isValid: true,
    fork: undefined,
    and(other: any): any {
        if (isAsyncValidation(other)) {
            other;
            return createAsyncValidation
                .of(createValidValidation(results))
                .and(other) as AsyncValidation;
        }
        if (isInvalidValidation(other)) {
            return createInvalidValidation(results.concat(other.results));
        }

        if (isValidValidation(other)) {
            return createValidValidation(results.concat(other.results));
        }
    },
    or(other: any): any {
        if (isAsyncValidation(other)) {
            other;
            return createAsyncValidation
                .of(createValidValidation(results))
                .or(other) as AsyncValidation;
        }
        if (isInvalidValidation(other)) {
            return createValidValidation(results.concat(other.results));
        }
        if (isValidValidation(other)) {
            return createValidValidation(results.concat(other.results));
        }
    },
    xor(other: any): any {
        if (isAsyncValidation(other)) {
            other;
            return createAsyncValidation
                .of(createValidValidation(results))
                .xor(other) as AsyncValidation;
        }

        if (isInvalidValidation(other)) {
            return createValidValidation(results.concat(other.results));
        }

        if (isValidValidation(other)) {
            return createInvalidValidation(results.concat(other.results));
        }
    },
    not() {
        return createInvalidValidation(results);
    },
    format: (fn) => createValidValidation(results.map(fn)),
    getResult() {
        return undefined;
    },
});

export const createInvalidValidation = (
    results: ValidationResult[]
): InvalidValidation => ({
    results,
    isValid: false,
    fork: undefined,
    and(other: any): any {
        if (isAsyncValidation(other)) {
            other;
            return createAsyncValidation
                .of(createInvalidValidation(results))
                .and(other) as AsyncValidation;
        }
        return createInvalidValidation(results.concat(other.results));
    },
    or(other: any): any {
        if (isAsyncValidation(other)) {
            other;
            return createAsyncValidation
                .of(createInvalidValidation(results))
                .or(other) as AsyncValidation;
        }
        if (isInvalidValidation(other)) {
            return createInvalidValidation(results.concat(other.results));
        }

        if (isValidValidation(other)) {
            return createValidValidation(results.concat(other.results));
        }
    },
    xor(other: any): any {
        if (isAsyncValidation(other)) {
            other;
            return createAsyncValidation
                .of(createInvalidValidation(results))
                .xor(other) as AsyncValidation;
        }
        if (isInvalidValidation(other)) {
            return createInvalidValidation(results.concat(other.results));
        }

        if (isValidValidation(other)) {
            return createValidValidation(results.concat(other.results));
        }
    },
    not() {
        return createValidValidation(results);
    },
    format: (fn) => createInvalidValidation(results.map(fn)),
    getResult() {
        return results;
    },
});

export const createAsyncValidation = (fork: Fork): AsyncValidation => ({
    isValid: undefined,
    results: undefined,
    fork,
    and(other) {
        return createAsyncValidation((resolve, reject) =>
            fork((result1: any) => {
                (isAsyncValidation(other)
                    ? other
                    : createAsyncValidation.of(
                          other as ValidValidation | InvalidValidation
                      )
                ).fork((result2) => resolve(result1.and(result2)), reject);
            }, reject)
        );
    },
    or(other) {
        return createAsyncValidation((resolve, reject) =>
            fork((result1: any) => {
                (isAsyncValidation(other)
                    ? other
                    : createAsyncValidation.of(
                          other as ValidValidation | InvalidValidation
                      )
                ).fork((result2) => resolve(result1.or(result2)), reject);
            }, reject)
        );
    },
    xor(other) {
        return createAsyncValidation((resolve, reject) =>
            fork((result1: any) => {
                (isAsyncValidation(other)
                    ? other
                    : createAsyncValidation.of(
                          other as ValidValidation | InvalidValidation
                      )
                ).fork((result2) => resolve(result1.xor(result2)), reject);
            }, reject)
        );
    },
    not() {
        return createAsyncValidation((resolve, reject) =>
            fork((validation: ValidValidation | InvalidValidation) => {
                resolve(validation.not());
            }, reject)
        );
    },
    format: (fn) =>
        createAsyncValidation((resolve, reject) =>
            fork((result) => resolve(result.format(fn)), reject)
        ),
    getResult() {
        return new Promise(
            fork
        ).then((validation: ValidValidation | InvalidValidation) =>
            validation.getResult()
        );
    },
});

// Convert ValidValidation or InvalidValidation into AsyncValidation
createAsyncValidation.of = (
    a: ValidValidation | InvalidValidation
): AsyncValidation => createAsyncValidation((resolve) => resolve(a));
// helper to create an AsyncValidation that will resolve to a Valid
createAsyncValidation.validValidation = (results: ValidationResult[]) =>
    createAsyncValidation((resolve) => resolve(createValidValidation(results)));
// helper to create an AsyncValidation that will resolve to an InvalidValidation holding the given InvalidResults
createAsyncValidation.invalidValidation = (results: ValidationResult[]) =>
    createAsyncValidation((resolve) =>
        resolve(createInvalidValidation(results))
    );

/**
 * Takes a synchronous validation function returnning either a string or undefined
 * Return a new function that return A ValidValidation when the original function would return undefined
 * or an invalidValidation when the original function would return a string
 * */
export function lift(fn: (x: any) => boolean, predicate: string) {
    return (value: any) => {
        const result = fn(value);
        if (result && (result as any).then) {
            throw new Error(
                "lift only accept synchronous function, use asyncLift instead"
            );
        }

        return createInvalidValidation([{ predicate, valid: result, value }]);
    };
}

/**
 * Takes an async validation function that resolve to either a string or undefined
 * Return a new function that return an AsyncValidation
 * */
export const asyncLift = (
    fn: (x: any) => Promise<boolean>,
    predicate: string
) => (value: any) =>
    createAsyncValidation((resolve, reject) => {
        try {
            // Promise.resolve will convert the function result to a promise if it is not
            Promise.resolve(fn(value))
                .then((result) =>
                    resolve(
                        result
                            ? createInvalidValidation([
                                  { predicate, valid: result, value },
                              ])
                            : createValidValidation([
                                  { predicate, valid: result, value },
                              ])
                    )
                )
                .catch(reject);
        } catch (error) {
            // catch eventual synchronous error
            reject(error);
        }
    });
