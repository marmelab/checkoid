const Validation = require("./Validation");
const { validator, Validator } = require("./Validator");
const { formatKey, and } = require("./utils");

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
                .format((message, value) =>
                    message.message
                        ? {
                              key: `${key}${formatKey(message.key)}`,
                              message: message.message,
                              value:
                                  typeof message.value !== "undefined"
                                      ? message.value
                                      : value &&
                                        value[key] &&
                                        value[key][message[key]],
                          }
                        : { key, message, value: value && value[key] }
                )
        )
        .reduce(and, isObject);

module.exports = objectValidator;
