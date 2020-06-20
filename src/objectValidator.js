const Validation = require("./Validation");
const { validator } = require("./Validator");
const { addKeyToMessage, and } = require("./utils");

const isObject = validator((value) => {
    if (typeof value === "object") {
        return Validation.Valid(value);
    }
    return Validation.Invalid([{ message: `value is not an object`, value }]);
});

const objectValidator = (spec) =>
    Object.keys(spec)
        .map((key) =>
            spec[key]
                .beforeHook((v) => v && v[key])
                .format(addKeyToMessage(key))
        )
        .reduce(and, isObject);

module.exports = objectValidator;
