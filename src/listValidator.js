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
            .map((item, key) =>
                Validator(() => validator.run(item)).format((message, value) =>
                    message.message
                        ? {
                              key: [].concat(key).concat(message.key || []),
                              message: message.message,
                              value:
                                  typeof message.value !== "undefined"
                                      ? message.value
                                      : value &&
                                        value[key] &&
                                        value[key][message[key]],
                          }
                        : {
                              key: [key],
                              message,
                              value: value && value[key],
                          }
                )
            )
            .reduce(and, isArray)
            .run(values)
    );

module.exports = listValidator;
