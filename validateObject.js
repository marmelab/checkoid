const Validation = require("./Validation");
const { Validator } = require("./Validator");
const Task = require("./Task");

const validateObject = (spec) =>
    Validator((obj = {}, parentKey = []) => {
        return Object.keys(spec).reduce((acc, key) => {
            return acc.and(
                spec[key].run(
                    obj[key],
                    [].concat(parentKey).concat(key).join(".")
                )
            );
        }, Task.of(Validation.Valid(obj)));
    });

module.exports = validateObject;
