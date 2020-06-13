const Task = require("./Task");
const { Validator, validator } = require("./Validator");
const Validation = require("./Validation");
const objectValidator = require("./objectValidator");
const { formatKey } = require("./utils");

const listValidator = (spec) => {
    const validator = spec.run
        ? spec
        : Array.isArray(spec)
        ? listValidator(spec)
        : objectValidator(spec);

    return Validator((values) => {
        if (!Array.isArray(values)) {
            return Task.of(
                Validation.Invalid([
                    { message: "value must be an array", value: values },
                ])
            );
        }
        return values
            .map((value, key) =>
                validator.run(value).map((message) =>
                    message.message
                        ? {
                              key: `[${key}]${formatKey(message.key)}`,
                              message: message.message,
                              value: message.value,
                          }
                        : {
                              key: `[${key}]`,
                              message,
                              value,
                          }
                )
            )
            .reduce(
                (acc, task) => acc.and(task),
                Task.of(Validation.Valid(values))
            );
    });
};

module.exports = listValidator;
