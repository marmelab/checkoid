// run is a function that return a Result
const Validation = (run) => ({
    run,
    and: (other) => Validation((key, x) => run(key, x).and(other.run(key, x))),
    or: (other) => Validation((key, x) => run(key, x).or(other.run(key, x))),
});

exports.Validation = Validation;
