const Task = require("./Task");

// run is a function that return a Task of a Result
const Validator = (run) => ({
    run,
    and: (other) => Validator((x, key) => run(x, key).and(other.run(x, key))),
    or: (other) => Validator((x, key) => run(x, key).or(other.run(x, key))),
});

Validator.fromFn = (fn) => Validator((x, key) => Task.fromFn(() => fn(x, key)));

exports.Validator = Validator;
