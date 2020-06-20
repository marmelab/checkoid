const { Async } = require("./Validation");

const Validator = (run) => ({
    run,
    isAsync: true,
    and: (other) => Validator((x) => run(x).and(other.run(x))),
    or: (other) => Validator((x) => run(x).or(other.run(x))),
    // also known as contraMap
    beforeHook: (fn) => Validator((x) => run(fn(x))),
    format: (fn) =>
        Validator(run).chain((x) =>
            Validator.getEntry().map((entry) =>
                x.format((message) => fn(message, entry))
            )
        ),
    map: (fn) => Validator((x) => fn(run(x))),
    chain: (fn) => Validator((x) => fn(run(x)).run(x)),
    check: (x) => {
        const res = run(x);

        if (res.toPromise) {
            return res.toPromise().then(({ x }) => x);
        }
        return res.x;
    },
});

Validator.getEntry = () => Validator((x) => x);

const asyncValidator = (fn) => Validator(Async.lift(fn));

const validator = Validator;

module.exports = {
    Validator,
    validator,
    asyncValidator,
};
