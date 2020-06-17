const { validator, Validator } = require("./Validator");
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
    validator.chain((x) =>
        Validator.getEntry().chain((values) =>
            (Array.isArray(values) ? values : [])
                .map((item, key) =>
                    Validator(() => validator.run(item)).format(
                        addKeyToMessage(key)
                    )
                )
                .reduce(and, isArray)
        )
    );

module.exports = listValidator;
