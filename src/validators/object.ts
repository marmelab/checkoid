import { addKeyToMessage, and } from "../utils";
import { validator } from "../Validator";

export const isObject = validator((value) =>
    typeof value === "object" ? undefined : "value must be an object"
);

export const hasNoExtraneousKeys = (keys) =>
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

export const isExactObject = (keys) => isObject.and(hasNoExtraneousKeys(keys));

export const shape = (spec, exact) => {
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
