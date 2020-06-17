const { validator } = require("./Validator");
const Validation = require("./Validation");
const { addKeyToMessage, and } = require("./utils");

const isArray = validator((x) => {
    if (Array.isArray(x)) {
        return Validation.Valid();
    }

    return Validation.Invalid([
        { message: "value must be an array", value: x },
    ]);
});

const listValidator = (validator) =>
    validator.mapWithEntry((values) =>
        (Array.isArray(values) ? values : [])
            .map((item, key) =>
                validator
                    .run(item)
                    .format((message) => addKeyToMessage(key)(message, values))
            )
            .reduce(and, isArray.run(values))
    );

module.exports = listValidator;
