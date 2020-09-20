const { asyncLift, lift } = require("./Validation");

const Validator = (run) => ({
    run,
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
    check: (x) => run(x).getResult(),
});

Validator.getEntry = () => Validator((x) => x);

const asyncValidator = (fn) =>
    Validator(asyncLift(fn)).format((message, value) => ({ message, value }));

const validator = (fn) =>
    Validator(lift(fn)).format((message, value) => ({ message, value }));

module.exports = {
    Validator,
    validator,
    asyncValidator,
};
