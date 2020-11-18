/**
 * Validator semigroup and Monad
 * A semigroup is a monoid with two operation instead of one
 * Number addition is a monoid add multiplication and you get a semigroup
 *
 * Validator is composed of the set of all functions returning a Validation
 * It has two operations `and` and `or`like Validation
 * The key here is that if you have functions returning value of the set of a Monoid
 * you can combine them by creating a new function returning the concatenation of their result
 * simple example with string (string is a natural monoid):
 * const foo = () => 'foo';
 * const bar = () => 'bar';
 * const concat = (a, b) => () => a().concat(b());
 * const foobar = concat(foo, bar);
 * foobar(); // 'foobar';
 *
 * Validator is also a Monad the value it holds is a Validation.
 * It is able to map function to the nested Validation.
 * It also has a chain function to accept function returning another Validator
 *
 * Additionally it is a Contravariant functor
 * able to apply function to its function argument with the beforeHook method
 **/

import {
    asyncLift,
    lift,
    AsyncValidation,
    SyncValidation,
    InvalidResult,
} from "./Validation";

type Run<T extends SyncValidation | AsyncValidation> = (
    x: any
) => T extends AsyncValidation ? AsyncValidation : SyncValidation;

export interface Validator<T extends SyncValidation | AsyncValidation> {
    run: Run<T>;
    and<O extends SyncValidation | AsyncValidation>(
        other: Validator<O>
    ): T extends AsyncValidation
        ? Validator<AsyncValidation>
        : O extends AsyncValidation
        ? Validator<AsyncValidation>
        : Validator<SyncValidation>;

    or<O extends SyncValidation | AsyncValidation>(
        other: Validator<O>
    ): T extends AsyncValidation
        ? Validator<AsyncValidation>
        : O extends AsyncValidation
        ? Validator<AsyncValidation>
        : Validator<SyncValidation>;
    // apply function to the validated value before it get validated
    beforeHook: (fn: (x: any) => any) => Validator<T>;
    // apply function to the InvalidResult if any
    afterHook: (
        fn: (r: InvalidResult, x: any) => InvalidResult
    ) => Validator<T>;
    //  like afterhook, but change only the message part of the InvalidResult
    format: (fn: (r: InvalidResult) => string) => Validator<T>;
    map: (fn: Function) => Validator<T>;
    chain: (fn: Function) => Validator<T>;
    check: (
        x: any
    ) => T extends SyncValidation
        ? InvalidResult[] | void
        : Promise<void | InvalidResult[]>;
}

/**
 * function to create a Validator
 * @param run function that returns a Validation
 */
export const createValidator = <T extends SyncValidation | AsyncValidation>(
    run: Run<T>
): Validator<T> => ({
    run,
    // @ts-ignore
    and: (other) => createValidator((x) => run(x).and(other.run(x))),
    // @ts-ignore
    or: (other) => createValidator((x) => run(x).or(other.run(x))),
    // also known as contraMap
    beforeHook: (fn) => createValidator((x) => run(fn(x))),
    afterHook: (fn) =>
        createValidator(run).chain((x: any) =>
            getEntry().map((entry: any) =>
                x.format((message: InvalidResult) => fn(message, entry))
            )
        ),
    format: (fn) =>
        createValidator(run).afterHook((result) => ({
            ...result,
            message: fn(result),
        })),
    map: (fn) => createValidator((x) => fn(run(x))),
    chain: (fn) => createValidator((x) => fn(run(x)).run(x)),
    // @ts-ignore
    check: (x) => run(x).getResult(),
});

// create a validator that holds the identity function
// used with the chain method it allows to access the original check argument
export const getEntry = <
    T extends SyncValidation | AsyncValidation
>(): Validator<T> => createValidator((x) => x);

export const asyncValidator = (
    fn: (x: any) => Promise<string | void>
): Validator<AsyncValidation> => createValidator(asyncLift(fn));

export const validator = (
    fn: (x: any) => string | void
): Validator<SyncValidation> => createValidator(lift(fn));
