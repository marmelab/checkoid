const { validator } = require("../Validator");

const length = (x) =>
    validator((value) =>
        value.length === x ? undefined : `value must have a length of ${x}`
    );

const lengthGt = (min) =>
    validator((value) =>
        value.length > min
            ? undefined
            : `value must have a length greater than ${min}`
    );

const lengthGte = (min) =>
    validator((value) =>
        value.length >= min
            ? undefined
            : `value must have a length of at least ${min}`
    );

const lengthLt = (max) =>
    validator((value) =>
        value.length < max
            ? undefined
            : `value must have a length less than ${max}`
    );

const lengthLte = (max) =>
    validator((value) =>
        value.length <= max
            ? undefined
            : `value must have a length of at most ${max}`
    );

module.exports = {
    length,
    lengthGt,
    lengthGte,
    lengthLt,
    lengthLte,
};
