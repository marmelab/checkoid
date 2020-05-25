const Task = require("./Task");

// run is a function that return a Task of a Result
const Validation = (run) => ({
    run,
    and: (other) => Validation((x, key) => run(x, key).and(other.run(x, key))),
    or: (other) => Validation((x, key) => run(x, key).or(other.run(x, key))),
});

Validation.fromFn = (fn) =>
    Validation((x, key) => Task.fromAsync(async () => fn(x, key)));

exports.Validation = Validation;
