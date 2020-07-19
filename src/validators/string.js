const predicate = require("predicate");
const { validator } = require("../Validator");

exports.string = validator((value) =>
    predicate.string(value) ? "value must be a string" : undefined
);

exports.match = (pattern) =>
    validator((value) =>
        predicate.matches(pattern, value)
            ? undefined
            : `value must match pattern ${pattern}`
    );
