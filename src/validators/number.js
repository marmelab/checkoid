const { validator } = require("../Validator");

const number = validator((value) =>
    typeof value === "number" && !isNaN(number) && isFinite(number)
        ? undefined
        : "value must be a number"
);

const greater = (min) =>
    validator((value) =>
        value > min ? undefined : `value must be greater than ${min}`
    );

const greaterEq = (min) =>
    validator((value) =>
        value >= min ? undefined : `value must be at least ${min}`
    );

const less = (max) =>
    validator((value) =>
        value < max ? undefined : `value must be less than ${max}`
    );

const lessEq = (max) =>
    validator((value) =>
        value <= max ? undefined : `value must be at most ${max}`
    );

const odd = validator((value) =>
    value % 2 === 1 ? undefined : "value must be odd"
);

const even = validator((value) =>
    value % 2 === 0 ? undefined : "value must be even"
);

module.exports = {
    number,
    greater,
    greaterEq,
    less,
    lessEq,
    odd,
    even,
};
