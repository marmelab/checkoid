const Result = require("./Result");
const { Validator } = require("./Validator");

const validate = (spec) =>
    Validator((obj = {}, parentKey = []) => {
        return Object.keys(spec).reduce((acc, key) => {
            return acc.and(
                spec[key].run(
                    obj[key],
                    [].concat(parentKey).concat(key).join(".")
                )
            );
        }, Result.Valid(obj));
    });

module.exports = validate;
