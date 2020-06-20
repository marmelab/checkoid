const Task = require("./Task");

// Valid will keep it's original value
const Valid = (x) => ({
    x,
    isValid: true,
    and: (other) => {
        if (other.fork) {
            return Task.of(Valid(x)).and(other);
        }

        return other.isValid ? Valid(x) : Invalid(other.x);
    },
    or: (other) => Valid(x), // no matter the other we keep the valid value
    format: (fn) => Valid(x),
    fold: (onValid, onInvalid) => onValid(x),
});

exports.Valid = Valid;

// Invalid will concat other invalid value to its value
const Invalid = (x) => ({
    x,
    isValid: false,
    and: (other) => {
        if (other.fork) {
            return Task.of(Invalid(x)).and(other);
        }

        return other.isValid ? Invalid(x) : Invalid(x.concat(other.x));
    },
    or: (other) =>
        other.fork
            ? Task.of(Invalid(x)).or(other)
            : other.isValid
            ? Valid(other.x)
            : Invalid(x.concat(other.x)),
    format: (fn) => Invalid(x.map(fn)), // allows to apply function to invalid message
    fold: (onValid, onInvalid) => onInvalid(x),
});

module.exports = { Valid, Invalid };
