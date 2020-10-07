const { validator } = require("../Validator");

const isNumber = validator((value) =>
    typeof value === "number" && !isNaN(number) && isFinite(number)
        ? undefined
        : "value must be a number"
);

const isGt = (min) =>
    validator((value) =>
        value > min ? undefined : `value must be greater than ${min}`
    );

const isGte = (min) =>
    validator((value) =>
        value >= min ? undefined : `value must be at least ${min}`
    );

const isLt = (max) =>
    validator((value) =>
        value < max ? undefined : `value must be less than ${max}`
    );

const isLte = (max) =>
    validator((value) =>
        value <= max ? undefined : `value must be at most ${max}`
    );

module.exports = {
    isNumber,
    isGt,
    isGte,
    isLt,
    isLte,
};
