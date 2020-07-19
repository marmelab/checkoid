const predicate = require("predicate");
const { validator } = require("../Validator");

const length = (l) =>
    validator((value) =>
        predicate.equal(value.length, l)
            ? undefined
            : `value must have a length of ${l}`
    );

const lengthGt = (l) =>
    validator((value) =>
        predicate.greater(value.length, l)
            ? undefined
            : `value must have a length greater than ${l}`
    );

const lengthGte = (l) =>
    validator((value) =>
        predicate.greaterEq(value.length, l)
            ? undefined
            : `value must have a length of at least ${l}`
    );

const lengthLt = (l) =>
    validator((value) =>
        predicate.less(value.length, l)
            ? undefined
            : `value must have a length less than ${l}`
    );

const lengthLte = (l) =>
    validator((value) =>
        predicate.lessEq(value.length, l)
            ? undefined
            : `value must have a length of at most ${l}`
    );

module.exports = {
    length,
    lengthGt,
    lengthGte,
    lengthLt,
    lengthLte,
};
