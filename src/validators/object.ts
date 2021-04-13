import { addKeyToMessage, and } from "../utils";
import { validator, Validator } from "../Validator";
import { SyncValidation, AsyncValidation } from "../Validation";

export const isObject = validator(
    (value) => typeof value === "object",
    "value is an object"
);

export const acceptKeys = (keys: string[]) =>
    validator((value) => {
        if (typeof value !== "object") {
            return true;
        }
        const extraneousKeys = Object.keys(value).filter(
            (key) => !keys.includes(key)
        );

        return extraneousKeys.length <= 0;
    }, `Value accept only the following keys: ${keys.join(",")}`);

export const isExactObject = (keys: string[]) => isObject.and(acceptKeys(keys));

interface Shape {
    (
        spec: {
            [k: string]: Validator<SyncValidation | AsyncValidation>;
        },
        exact?: boolean
    ): Validator<AsyncValidation>;
}
interface Shape {
    (
        spec: {
            [k: string]: Validator<SyncValidation>;
        },
        exact?: boolean
    ): Validator<SyncValidation>;
}

export const shape: Shape = (
    spec: {
        [k: string]: Validator<SyncValidation | AsyncValidation>;
    },
    exact?: boolean
) => {
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
