type Fork = (
    reject: (value: Error) => void,
    resolve: (value: Valid | Invalid) => void
) => void;

export interface InvalidResult {
    value: any;
    message: string;
    key?: string[];
}

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
    getResult: () => undefined;
}

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

export type SyncValidation = Valid | Invalid;

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

// Valid will hold no value
export const Valid = (): Valid => ({
    isValid: true,
    x: undefined,
    fork: undefined,
    and(other: any): any {
        if (isAsync(other)) {
            other;
            return Async.of(Valid()).and(other) as AsyncValidation;
        }

        if (isInvalid(other)) {
            return other;
        }

        if (isValid(other)) {
            return Valid();
        }
    },
    or: (other: any): any => {
        // If other is Async convert Valid to Async(Valid)
        if (isAsync(other)) {
            return Async.of(Valid());
        }
        return Valid();
    }, // no matter the other we keep the valid value
    format: (fn) => Valid(),
    getResult: () => undefined,
});

exports.Valid = Valid;

// Invalid will concat other invalid value to its value
export const Invalid = (x: InvalidResult[]): Invalid => ({
    x,
    isValid: false,
    fork: undefined,
    and: (other: any): any => {
        if (isAsync(other)) {
            return Async.of(Invalid(x)).and(other);
        }

        return isInvalid(other) ? Invalid(x.concat(other.x)) : Invalid(x);
    },
    or: (other: any): any => {
        if (isAsync(other)) {
            return Async.of(Invalid(x)).or(other);
        }
        return isInvalid(other) ? Invalid(x.concat(other.x)) : Valid();
    },
    format: (fn) => Invalid(x.map(fn)), // allows to apply function to invalid message
    getResult: () => x,
});

// Async validation that will resolve to a Valid or Invalid one
export const Async = (fork: Fork): AsyncValidation => ({
    isValid: undefined,
    x: undefined,
    and: (other) =>
        Async((reject, resolve) =>
            fork(reject, (result1: any) => {
                (isAsync(other)
                    ? other
                    : Async.of(other as Valid | Invalid)
                ).fork(reject, (result2) => resolve(result1.and(result2)));
            })
        ),
    or: (other) =>
        Async((reject, resolve) =>
            fork(reject, (result1: any) => {
                (isAsync(other)
                    ? other
                    : Async.of(other as Valid | Invalid)
                ).fork(reject, (result2) => resolve(result1.or(result2)));
            })
        ),
    format: (fn) =>
        Async((reject, resolve) =>
            fork(reject, (result) => resolve(result.format(fn)))
        ),
    fork,
    getResult: () =>
        new Promise((resolve, reject) =>
            fork(reject, resolve)
        ).then((validation: Valid | Invalid) => validation.getResult()),
});
Async.of = (a: Valid | Invalid): AsyncValidation =>
    Async((_, resolve) => resolve(a));
Async.valid = () => Async((_, resolve) => resolve(Valid()));
Async.invalid = (a: InvalidResult[]) =>
    Async((_, resolve) => resolve(Invalid(a)));

export function lift(fn: (x: any) => string | undefined) {
    return (value: any) => {
        const result = fn(value);
        if (result && (result as any).then) {
            throw new Error(
                "lift only accept synchronous function, use asyncLift instead"
            );
        }

        if (result) {
            return Invalid([{ message: result, value }]);
        }

        return Valid();
    };
}

// Takes a function and wrap its result in an Async data type
export const asyncLift = (fn: (x: any) => Promise<string | void>) => (value) =>
    Async((reject, resolve) => {
        try {
            // Promise.resolve will convert the function result to a promise if it is not
            Promise.resolve(fn(value))
                .then((result) =>
                    resolve(
                        result ? Invalid([{ message: result, value }]) : Valid()
                    )
                )
                .catch(reject);
        } catch (error) {
            // catch eventual synchronous error
            reject(error);
        }
    });
