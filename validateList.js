const Task = require("./Task");
const { Validator, validator } = require("./Validator");
const Validation = require("./Validation");
const validateObject = require("./validateObject");

const IsList = validator((value, key) => {
    if (Array.isArray(value)) {
        return Validation.Valid(value);
    }
    return Validation.Invalid([`${key} must be an array`]);
});

const validateList = (spec) => {
    const validator = spec.run
        ? spec
        : Array.isArray(spec)
        ? validateList(spec)
        : validateObject(spec);

    return IsList.and(
        Validator((values, key = []) =>
            values
                .map((value, index) =>
                    validator.run(value, key.concat(`[${index}]`))
                )
                .reduce(
                    (acc, task) => acc.and(task),
                    Task.of(Validation.Valid(values))
                )
        )
    );
};

module.exports = validateList;
