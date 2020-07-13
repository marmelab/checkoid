const { validator, Validator } = require("./Validator");
const Validation = require("./Validation");
const { addKeyToMessage, and } = require("./utils");

const isArray = validator((x) => {
    if (Array.isArray(x)) {
        return;
    }

    return { message: "value must be an array", value: x };
});

const listValidator = (validator) =>
    Validator.getEntry().chain((values) =>
        (Array.isArray(values) ? values : [])
            .map((item, key) =>
                validator
                    .beforeHook(() => item)
                    .format((message) => addKeyToMessage(key)(message, values))
            )
            .reduce(and, isArray)
    );

module.exports = listValidator;
