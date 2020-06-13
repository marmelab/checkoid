const Task = require("./Task");
const { Validator, validator } = require("./Validator");
const Validation = require("./Validation");
const objectValidator = require("./objectValidator");
const { formatKey } = require("./utils");

const IsList = validator((value, key) => {
    if (Array.isArray(value)) {
        return Validation.Valid(value);
    }
    return Validation.Invalid([`${key} must be an array`]);
});

const listValidator = (spec) => {
    const validator = spec.run
        ? spec
        : Array.isArray(spec)
        ? listValidator(spec)
        : objectValidator(spec);

    return IsList.and(
        Validator((values) =>
            values
                .map((value, key) =>
                    validator.run(value).map((message) =>
                        message.key
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
                )
        )
    );
};

module.exports = listValidator;
