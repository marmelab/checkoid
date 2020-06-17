const Task = require("./Task");

// run is a function that return a Task of a Validation
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
    check: (x) =>
        run(x)
            .toPromise()
            .then(({ x }) => x),
});

Validator.getEntry = () => Validator((x) => x);

const validator = (fn) => Validator(Task.lift(fn));

exports.Validator = Validator;
exports.validator = validator;
