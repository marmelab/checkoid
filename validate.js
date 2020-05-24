const Result = require("./Result");

const validate = (spec) => (obj) => {
    return Object.keys(spec).reduce((acc, key) => {
        return acc.and(spec[key].run(key, obj[key]));
    }, Result.Valid(obj)).x;
};

module.exports = validate;
