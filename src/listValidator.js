const { Validator, validator } = require("./Validator");
const Validation = require("./Validation");
const { formatKey, and } = require("./utils");

const isArray = validator((x) => {
    if (Array.isArray(x)) {
        return Validation.Valid();
    }

    return Validation.Invalid([
        { message: "value must be an array", value: x },
    ]);
});

const listValidator = (validator) =>
    Validator((values) =>
        (Array.isArray(values) ? values : [])
            .map((value, key) =>
                Validator(() => validator.run(value)).format((message) =>
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
            .reduce(and, isArray)
            .run(values)
    );

module.exports = listValidator;
