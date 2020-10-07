const { validator } = require("../Validator");

const hasLengthOf = (x) =>
    validator((value) =>
        value && value.length === x
            ? undefined
            : `value must have a length of ${x}`
    );

const hasLengthGt = (min) =>
    validator((value) =>
        value && value.length > min
            ? undefined
            : `value must have a length greater than ${min}`
    );

const hasLengthGte = (min) =>
    validator((value) =>
        value && value.length >= min
            ? undefined
            : `value must have a length of at least ${min}`
    );

const hasLengthLt = (max) =>
    validator((value) =>
        value && value.length < max
            ? undefined
            : `value must have a length less than ${max}`
    );

const hasLengthLte = (max) =>
    validator((value) =>
        value && value.length <= max
            ? undefined
            : `value must have a length of at most ${max}`
    );

module.exports = {
    hasLengthOf,
    hasLengthGt,
    hasLengthGte,
    hasLengthLt,
    hasLengthLte,
};
