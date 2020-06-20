const { validator, AsyncValidator, SyncValidator } = require("./Validator");
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
    (validator.isAsync ? AsyncValidator : SyncValidator)
        .getEntry()
        .chain((values) =>
            (Array.isArray(values) ? values : [])
                .map((item, key) =>
                    validator
                        .beforeHook(() => item)
                        .format((message) =>
                            addKeyToMessage(key)(message, values)
                        )
                )
                .reduce(and, isArray)
        );

module.exports = listValidator;
