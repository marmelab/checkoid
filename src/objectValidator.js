const Validation = require("./Validation");
const { Validator, validator } = require("./Validator");
const { formatKey } = require("./utils");

const isObject = validator((value) => {
    if (typeof value === "object") {
        return Validation.Valid(value);
    }
    return Validation.Invalid([{ message: `value is not an object`, value }]);
});

const objectValidator = (spec) =>
    Validator((obj) =>
        Object.keys(spec)
            .reduce((acc, key) => {
                return acc.and(
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
                );
            }, isObject)
            .run(obj)
    );

module.exports = objectValidator;
