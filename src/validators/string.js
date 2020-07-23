const { validator } = require("../Validator");

exports.string = validator((value) =>
    typeof value === "string" ? undefined : "value must be a string"
);

exports.match = (pattern, message) =>
    validator((value) =>
        pattern.test(value)
            ? undefined
            : message || `value must match pattern ${pattern}`
    );
