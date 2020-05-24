// run is a function that return a Result
const Validation = (run) => ({
    run,
    and: (other) => Validation((x, key) => run(x, key).and(other.run(x, key))),
    or: (other) => Validation((x, key) => run(x, key).or(other.run(x, key))),
});

exports.Validation = Validation;
