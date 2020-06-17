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
                .format((message) =>
                    message.message
                        ? {
                              key: `${key}${formatKey(message.key)}`,
                              message: message.message,
                              value: message.value,
                          }
                        : { key, message, value: message.value }
                )
                .chain((x) =>
                    Validator.getValue().map((value) =>
                        x.format((msg) =>
                            typeof msg.value !== "undefined"
                                ? msg
                                : {
                                      ...msg,
                                      value: value && value[msg.key],
                                  }
                        )
                    )
                )
        )
        .reduce(and, isObject);

module.exports = objectValidator;
