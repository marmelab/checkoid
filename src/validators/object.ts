import { addKeyToMessage, and } from "../utils";
import { validator, Validator } from "../Validator";
import { SyncValidation, AsyncValidation } from "../Validation";

export const isObject = validator((value) =>
    typeof value === "object" ? undefined : "value must be an object"
);

export const hasNoExtraneousKeys = (keys: string[]) =>
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

export const isExactObject = (keys: string[]) =>
    isObject.and(hasNoExtraneousKeys(keys));

interface shape {
    (
        spec: {
            [k: string]: Validator<SyncValidation | AsyncValidation>;
        },
        exact?: boolean
    ): Validator<AsyncValidation>;
}
interface shape {
    (
        spec: {
            [k: string]: Validator<SyncValidation>;
        },
        exact?: boolean
    ): Validator<SyncValidation>;
}

export const shape: shape = (
    spec: {
        [k: string]: Validator<SyncValidation | AsyncValidation>;
    },
    exact?: boolean
) => {
    const isObjectValidator = exact
        ? isExactObject(Object.keys(spec))
        : isObject;

    const o = Object.keys(spec).map((key) =>
        spec[key].beforeHook((v) => v && v[key]).afterHook(addKeyToMessage(key))
    );
    return Object.keys(spec)
        .map((key) =>
            spec[key]
                .beforeHook((v) => v && v[key])
                .afterHook(addKeyToMessage(key))
        )
        .reduce(and, isObjectValidator);
};
