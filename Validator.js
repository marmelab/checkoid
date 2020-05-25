const Task = require("./Task");

// run is a function that return a Task of a Validation
const Validator = (run) => ({
    run,
    and: (other) => Validator((x, key) => run(x, key).and(other.run(x, key))),
    or: (other) => Validator((x, key) => run(x, key).or(other.run(x, key))),
    check: (x, key) => run(x, key).toPromise(),
});

const validator = (fn) => Validator((x, key) => Task.fromFn(() => fn(x, key)));

exports.Validator = Validator;
exports.validator = validator;
