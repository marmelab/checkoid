const { validator } = require("./Validator");
const { addKeyToMessage, and } = require("./utils");

const isObject = validator((value) => {
    if (typeof value === "object") {
        return;
    }
    return { message: `value is not an object`, value };
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
