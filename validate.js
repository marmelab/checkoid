const Result = require("./Result");
const { Validation } = require("./Validation");

const validate = (spec) =>
    Validation((obj = {}, parentKey = []) => {
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
