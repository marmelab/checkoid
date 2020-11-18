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
    getResult: () => void;
}

// Valid will hold no value
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

// Invalid will concat other invalid value to its value
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

type Fork = (
    reject: (value: Error) => void,
    resolve: (value: Valid | Invalid) => void
) => void;

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

// Async validation that will resolve to a Valid or Invalid one
export const asyncValidation = (fork: Fork): AsyncValidation => ({
    isValid: undefined,
    x: undefined,
    and: (other) =>
        asyncValidation((reject, resolve) =>
            fork(reject, (result1: any) => {
                (isAsync(other)
                    ? other
                    : asyncValidation.of(other as Valid | Invalid)
                ).fork(reject, (result2) => resolve(result1.and(result2)));
            })
        ),
    or: (other) =>
        asyncValidation((reject, resolve) =>
            fork(reject, (result1: any) => {
                (isAsync(other)
                    ? other
                    : asyncValidation.of(other as Valid | Invalid)
                ).fork(reject, (result2) => resolve(result1.or(result2)));
            })
        ),
    format: (fn) =>
        asyncValidation((reject, resolve) =>
            fork(reject, (result) => resolve(result.format(fn)))
        ),
    fork,
    getResult: () =>
        new Promise((resolve, reject) =>
            fork(reject, resolve)
        ).then((validation: Valid | Invalid) => validation.getResult()),
});
asyncValidation.of = (a: Valid | Invalid): AsyncValidation =>
    asyncValidation((_, resolve) => resolve(a));
asyncValidation.valid = () => asyncValidation((_, resolve) => resolve(valid()));
asyncValidation.invalid = (a: InvalidResult[]) =>
    asyncValidation((_, resolve) => resolve(invalid(a)));

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

// Takes a function and wrap its result in an Async data type
export const asyncLift = (fn: (x: any) => Promise<string | void>) => (
    value: any
) =>
    asyncValidation((reject, resolve) => {
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
