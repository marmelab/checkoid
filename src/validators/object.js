const { addKeyToMessage, and } = require("../utils");
const { validator } = require("../Validator");

const isObject = validator((value) =>
    typeof value === "object" ? undefined : "value must be an object"
);

const hasNoExtraneousKeys = (keys) =>
    validator((value) => {
        if (typeof value !== "object") {
            return;
        }
        const extraneousKeys = Object.keys(value).filter(
            (key) => !keys.includes(key)
        );

        return extraneousKeys.length > 0
            ? `Value has extraneous keys: ${extraneousKeys.join(", ")}`
            : undefined;
    });

const isExactObject = (keys) => isObject.and(hasNoExtraneousKeys(keys));

const shape = (spec, exact) => {
    const isObjectValidator = exact
        ? isExactObject(Object.keys(spec))
        : isObject;

    return Object.keys(spec)
        .map((key) =>
            spec[key]
                .beforeHook((v) => v && v[key])
                .afterHook(addKeyToMessage(key))
        )
        .reduce(and, isObjectValidator);
};

module.exports = {
    isObject,
    isExactObject,
    hasNoExtraneousKeys,
    shape,
};
