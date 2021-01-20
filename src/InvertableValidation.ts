export interface ValidationResult {
    value: any;
    predicate: string;
    valid: boolean;
    key?: string[];
}

interface ValidValidation {
    isValid: true;
    validResults: ValidationResult[];
    invalidResults: ValidationResult[];
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
    validResults: ValidationResult[];
    invalidResults: ValidationResult[];
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
    validResults: undefined;
    invalidResults: undefined;
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
    validResults: ValidationResult[],
    invalidResults: ValidationResult[] = []
): ValidValidation => ({
    validResults,
    invalidResults,
    isValid: true,
    fork: undefined,
    and(other: any): any {
        if (isAsyncValidation(other)) {
            other;
            return createAsyncValidation
                .of(createValidValidation(validResults, invalidResults))
                .and(other) as AsyncValidation;
        }
        if (isInvalidValidation(other)) {
            return createInvalidValidation(
                invalidResults.concat(other.invalidResults),
                validResults.concat(other.validResults)
            );
        }

        if (isValidValidation(other)) {
            return createValidValidation(
                validResults.concat(other.validResults),
                invalidResults.concat(other.invalidResults)
            );
        }
    },
    or(other: any): any {
        if (isAsyncValidation(other)) {
            other;
            return createAsyncValidation
                .of(createValidValidation(validResults, invalidResults))
                .or(other) as AsyncValidation;
        }
        if (isInvalidValidation(other)) {
            return createValidValidation(
                validResults.concat(other.validResults),
                invalidResults.concat(other.invalidResults)
            );
        }
        if (isValidValidation(other)) {
            return createValidValidation(
                validResults.concat(other.validResults),
                invalidResults.concat(other.invalidResults)
            );
        }
    },
    xor(other: any): any {
        if (isAsyncValidation(other)) {
            other;
            return createAsyncValidation
                .of(createValidValidation(validResults, invalidResults))
                .xor(other) as AsyncValidation;
        }
        if (isInvalidValidation(other)) {
            return createValidValidation(
                validResults.concat(other.validResults),
                invalidResults.concat(other.invalidResults)
            );
        }

        if (isValidValidation(other)) {
            return createInvalidValidation(
                validResults.concat(other.validResults),
                invalidResults.concat(other.invalidResults)
            );
        }
    },
    not() {
        return createInvalidValidation(validResults, invalidResults);
    },
    format: (fn) =>
        createValidValidation(validResults.map(fn), invalidResults.map(fn)),
    getResult() {
        return undefined;
    },
});

export const createInvalidValidation = (
    invalidResults: ValidationResult[],
    validResults: ValidationResult[] = []
): InvalidValidation => ({
    validResults,
    invalidResults,
    isValid: false,
    fork: undefined,
    and(other: any): any {
        if (isAsyncValidation(other)) {
            other;
            return createAsyncValidation
                .of(createInvalidValidation(invalidResults, validResults))
                .and(other) as AsyncValidation;
        }
        return createInvalidValidation(
            invalidResults.concat(other.invalidResults),
            validResults.concat(other.validResults)
        );
    },
    or(other: any): any {
        if (isAsyncValidation(other)) {
            other;
            return createAsyncValidation
                .of(createInvalidValidation(invalidResults, validResults))
                .or(other) as AsyncValidation;
        }
        if (isInvalidValidation(other)) {
            return createInvalidValidation(
                invalidResults.concat(other.invalidResults),
                validResults.concat(other.validResults)
            );
        }

        if (isValidValidation(other)) {
            return createValidValidation(
                validResults.concat(other.validResults),
                invalidResults.concat(other.invalidResults)
            );
        }
    },
    xor(other: any): any {
        if (isAsyncValidation(other)) {
            other;
            return createAsyncValidation
                .of(createInvalidValidation(invalidResults, validResults))
                .xor(other) as AsyncValidation;
        }
        if (isInvalidValidation(other)) {
            return createInvalidValidation(
                invalidResults.concat(other.invalidResults),
                validResults.concat(other.validResults)
            );
        }

        if (isValidValidation(other)) {
            return createValidValidation(
                validResults.concat(other.validResults),
                invalidResults.concat(other.invalidResults)
            );
        }
    },
    not() {
        return createValidValidation(invalidResults, validResults);
    },
    format: (fn) =>
        createInvalidValidation(invalidResults.map(fn), validResults.map(fn)),
    getResult() {
        return invalidResults;
    },
});

export const createAsyncValidation = (fork: Fork): AsyncValidation => ({
    isValid: undefined,
    validResults: undefined,
    invalidResults: undefined,
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
createAsyncValidation.validValidation = (
    validResults: ValidationResult[],
    invalidResults: ValidationResult[]
) =>
    createAsyncValidation((resolve) =>
        resolve(createValidValidation(validResults, invalidResults))
    );
// helper to create an AsyncValidation that will resolve to an InvalidValidation holding the given InvalidResults
createAsyncValidation.invalidValidation = (
    invalidResults: ValidationResult[],
    validResults: ValidationResult[]
) =>
    createAsyncValidation((resolve) =>
        resolve(createInvalidValidation(invalidResults, validResults))
    );
