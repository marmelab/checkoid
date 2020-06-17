const Validation = require("./Validation");
const { Validator, validator } = require("./Validator");
const { formatKey, and } = require("./utils");

const isObject = validator((value) => {
    if (typeof value === "object") {
        return Validation.Valid(value);
    }
    return Validation.Invalid([{ message: `value is not an object`, value }]);
});

const objectValidator = (spec) =>
    Validator((obj) =>
        Object.keys(spec)
            .map((key) =>
                spec[key]
                    .beforeHook((v) => v && v[key])
                    .format((message) =>
                        message.message
                            ? {
                                  key: `${key}${formatKey(message.key)}`,
                                  message: message.message,
                                  value: message.value,
                              }
                            : { key, message, value: obj && obj[key] }
                    )
            )
            .reduce(and, isObject)
            .run(obj)
    );

module.exports = objectValidator;
