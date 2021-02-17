import { addKeyToMessage, and } from "../utils";
import { validator, Validator, getEntry } from "../Validator";
import { SyncValidation, AsyncValidation } from "../Validation";

export const isObject = validator(
    (value) => value !== null && typeof value === "object",
    "value is an object"
);

export const acceptKeys = (keys: string[]) =>
    validator((value) => {
        if (!value || typeof value !== "object") {
            return true;
        }
        const extraneousKeys = Object.keys(value).filter(
            (key) => !keys.includes(key)
        );

        return extraneousKeys.length <= 0;
    }, `value accept only the following keys: ${keys.join(",")}`);

export const isExactObject = (keys: string[]) => isObject.and(acceptKeys(keys));

export const hasKeys = (keys: string[]) =>
    validator((value) => {
        if (!value || typeof value !== "object") {
            return false;
        }
        const objectKeys = Object.keys(value);

        const missingKeys = keys.filter((x) => !objectKeys.includes(x));

        return missingKeys.length === 0;
    }, `value has the following keys: ${keys.join(",")}`);

export const objectOf = (
    validator: Validator<SyncValidation | AsyncValidation>
) => {
    return getEntry().chain((value: any) => {
        const object = typeof value === "object" && value !== null ? value : {};
        return Object.keys(object)
            .map((key) => {
                return validator
                    .beforeHook((value) => value[key])
                    .afterHook((message) =>
                        addKeyToMessage(key)(message, object)
                    );
            })
            .reduce(and, isObject);
    });
};

interface Shape {
    (
        spec: {
            [k: string]: Validator<SyncValidation | AsyncValidation>;
        },
        exact?: boolean,
        requiredKeys?: string[]
    ): Validator<AsyncValidation>;
}
interface Shape {
    (
        spec: {
            [k: string]: Validator<SyncValidation>;
        },
        exact?: boolean,
        requiredKeys?: string[]
    ): Validator<SyncValidation>;
}

export const isAbsent = validator(
    (value) => value == null || value === undefined,
    "value is null"
);

export const shape: Shape = (
    spec: {
        [k: string]: Validator<SyncValidation | AsyncValidation>;
    },
    exact?: boolean,
    requiredKeys?: string[]
) => {
    const isObjectValidator = exact
        ? isExactObject(Object.keys(spec))
        : isObject;

    return Object.keys(spec)
        .map((key) => {
            const keyValidator = spec[key];
            if (!requiredKeys || (requiredKeys && requiredKeys.includes(key))) {
                return keyValidator
                    .beforeHook((v) => v && v[key])
                    .afterHook(addKeyToMessage(key));
            }
            return keyValidator
                .or(isAbsent)
                .beforeHook((v) => v && v[key])
                .afterHook(addKeyToMessage(key));
        })
        .reduce(and, isObjectValidator);
};
