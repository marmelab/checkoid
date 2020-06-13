const Task = require("./Task");

// run is a function that return a Task of a Validation
const Validator = (run) => ({
    run,
    and: (other) => Validator((x) => run(x).and(other.run(x))),
    or: (other) => Validator((x) => run(x).or(other.run(x))),
    check: (x) =>
        run(x)
            .toPromise()
            .then(({ x }) => x),
});

const validator = (fn) => Validator((x) => Task.fromFn(() => fn(x)));

exports.Validator = Validator;
exports.validator = validator;
