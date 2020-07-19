const predicate = require("predicate");
const { validator, Validator } = require("../Validator");
const { and, addKeyToMessage } = require("../utils");

const array = validator((value) =>
    predicate.array(value) ? undefined : "value must be an array"
);

const arrayOf = (validator) =>
    Validator.getEntry().chain((values) =>
        (predicate.array(values) ? values : [])
            .map((item, key) =>
                validator
                    .beforeHook(() => item)
                    .format((message) => addKeyToMessage(key)(message, values))
            )
            .reduce(
                and,
                array.format((message, value) => ({ message, value }))
            )
    );

module.exports = {
    array,
    arrayOf,
};
