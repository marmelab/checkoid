const Validation = require("./Validation");
const { Validator, validator } = require("./Validator");
const Task = require("./Task");

const isObject = validator((value, key) => {
    if (typeof value === "object") {
        return Validation.Valid(value);
    }
    return Validation.Invalid([`${key} is not an object`]);
});

const validateObject = (spec) =>
    isObject.and(
        Validator((obj = {}, parentKey = []) => {
            return Object.keys(spec).reduce((acc, key) => {
                return acc.and(
                    spec[key].run(
                        obj[key],
                        [].concat(parentKey).concat(key).join(".")
                    )
                );
            }, Task.of(Validation.Valid(obj)));
        })
    );

module.exports = validateObject;
