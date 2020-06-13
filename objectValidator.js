const Validation = require("./Validation");
const { Validator, validator } = require("./Validator");
const Task = require("./Task");
const { formatKey } = require("./utils");

const isObject = validator((value) => {
    if (typeof value === "object") {
        return Validation.Valid(value);
    }
    return Validation.Invalid([{ message: `value is not an object`, value }]);
});

const objectValidator = (spec) =>
    isObject.and(
        Validator((obj = {}) => {
            return Object.keys(spec).reduce((acc, key) => {
                return acc.and(
                    spec[key].run(obj[key]).map((message) =>
                        message.message
                            ? {
                                  key: `${key}${formatKey(message.key)}`,
                                  message: message.message,
                                  value: message.value,
                              }
                            : { key, message, value: obj[key] }
                    )
                );
            }, Task.of(Validation.Valid(obj)));
        })
    );

module.exports = objectValidator;
