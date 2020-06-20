const Task = require("./Task");

const AsyncValidator = (run) => ({
    run,
    isAsync: true,
    and: (other) =>
        other.isAsync
            ? AsyncValidator((x) => run(x).and(other.run(x)))
            : AsyncValidator((x) => run(x).and(other.toAsync().run(x))),
    or: (other) =>
        other.isAsync
            ? AsyncValidator((x) => run(x).or(other.run(x)))
            : AsyncValidator((x) => run(x).or(other.toAsync().run(x))),
    // also known as contraMap
    beforeHook: (fn) => AsyncValidator((x) => run(fn(x))),
    format: (fn) =>
        AsyncValidator(run).chain((x) =>
            AsyncValidator.getEntry().map((entry) =>
                x.format((message) => fn(message, entry))
            )
        ),
    map: (fn) => AsyncValidator((x) => fn(run(x))),
    chain: (fn) => AsyncValidator((x) => fn(run(x)).run(x)),
    check: (x) =>
        run(x)
            .toPromise()
            .then(({ x }) => x),
});

AsyncValidator.getEntry = () => AsyncValidator((x) => x);

const asyncValidator = (fn) => AsyncValidator(Task.lift(fn));

const SyncValidator = (run) => ({
    run,
    isAsync: false,
    and: (other) =>
        other.isAsync
            ? SyncValidator(run).toAsync().and(other)
            : SyncValidator((x) => run(x).and(other.run(x))),
    or: (other) =>
        other.isAsync
            ? SyncValidator(run).toAsync().or(other)
            : SyncValidator((x) => run(x).or(other.run(x))),
    // also known as contraMap
    beforeHook: (fn) => SyncValidator((x) => run(fn(x))),
    format: (fn) =>
        SyncValidator(run).chain((x) =>
            AsyncValidator.getEntry().map((entry) =>
                x.format((message) => fn(message, entry))
            )
        ),
    map: (fn) => SyncValidator((x) => fn(run(x))),
    chain: (fn) => SyncValidator((x) => fn(run(x)).run(x)),
    check: (x) => run(x).x,
    toAsync: () => AsyncValidator(Task.lift(run)),
});

SyncValidator.getEntry = () => SyncValidator((x) => x);

const validator = SyncValidator;

module.exports = {
    AsyncValidator,
    SyncValidator,
    validator,
    asyncValidator,
};
