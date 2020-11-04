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
    beforeHook: (fn: (x: any) => any) => Validator<T>;
    afterHook: (
        fn: (r: InvalidResult, x: any) => InvalidResult
    ) => Validator<T>;
    format: (fn: (r: InvalidResult) => string) => Validator<T>;
    map: (fn: Function) => Validator<T>;
    chain: (fn: Function) => Validator<T>;
    check: (
        x: any
    ) => T extends SyncValidation
        ? InvalidResult[] | void
        : Promise<void | InvalidResult[]>;
}

export const Validator = <T extends SyncValidation | AsyncValidation>(
    run: Run<T>
): Validator<T> => ({
    run,
    // @ts-ignore
    and: (other) => Validator((x) => run(x).and(other.run(x))),
    // @ts-ignore
    or: (other) => Validator((x) => run(x).or(other.run(x))),
    // also known as contraMap
    beforeHook: (fn) => Validator((x) => run(fn(x))),
    afterHook: (fn) =>
        Validator(run).chain((x: any) =>
            Validator.getEntry().map((entry: any) =>
                x.format((message: InvalidResult) => fn(message, entry))
            )
        ),
    format: (fn) =>
        Validator(run).afterHook((result) => ({
            ...result,
            message: fn(result),
        })),
    map: (fn) => Validator((x) => fn(run(x))),
    chain: (fn) => Validator((x) => fn(run(x)).run(x)),
    // @ts-ignore
    check: (x) => run(x).getResult(),
});

Validator.getEntry = <T extends SyncValidation | AsyncValidation>(): Validator<
    T
> => Validator((x) => x);

export const asyncValidator = (
    fn: (x: any) => Promise<string | void>
): Validator<AsyncValidation> => Validator(asyncLift(fn));

export const validator = (
    fn: (x: any) => string | void
): Validator<SyncValidation> => Validator(lift(fn));
