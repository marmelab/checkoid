const { Async } = require("./Validation");

const AsyncValidator = (run) => ({
    run,
    isAsync: true,
    and: (other) => AsyncValidator((x) => run(x).and(other.run(x))),
    or: (other) => AsyncValidator((x) => run(x).or(other.run(x))),
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
    check: (x) => {
        const res = run(x);

        if (res.toPromise) {
            return res.toPromise().then(({ x }) => x);
        }
        return res.x;
    },
});

AsyncValidator.getEntry = () => AsyncValidator((x) => x);

const asyncValidator = (fn) => AsyncValidator(Async.lift(fn));

const SyncValidator = (run) => ({
    run,
    isAsync: false,
    and: (other) => SyncValidator((x) => run(x).and(other.run(x))),
    or: (other) => SyncValidator((x) => run(x).or(other.run(x))),
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
    check: (x) => {
        const res = run(x);

        if (res.toPromise) {
            return res.toPromise().then(({ x }) => x);
        }
        return res.x;
    },
});

SyncValidator.getEntry = () => SyncValidator((x) => x);

const validator = SyncValidator;

module.exports = {
    AsyncValidator,
    SyncValidator,
    validator,
    asyncValidator,
};
