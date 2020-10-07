const { validator } = require("../Validator");

exports.isString = validator((value) =>
    typeof value === "string" ? undefined : "value must be a string"
);

exports.match = (pattern) =>
    validator((value) =>
        pattern.test(value) ? undefined : `value must match pattern ${pattern}`
    );
