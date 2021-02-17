import { ValidationResult } from "./Validation";

export const and = (validator1: any, validator2: any) =>
    validator1.and(validator2);

export const andMany = ([firstValidator, ...validators]: any[]) =>
    validators.reduce(and, firstValidator);

/**
 *
 * Retrieve the value at a given path.
 *
 * @param keys path composed of a list of keys
 * @param obj the object we want to get the value from
 */
export const path = (keys: string[], obj: Object) =>
    // @ts-ignore
    keys.reduce((acc, key) => acc && acc[key], obj);

const isDefined = (value: any) => {
    return typeof value !== "undefined";
};

const keysToPath = (
    key1: string | number,
    key2: (string | number)[] | undefined
): string[] => [].concat(key1).concat(isDefined(key2) ? key2 : []);

const normalizeMessage = (
    message: string | ValidationResult
): ValidationResult => {
    if (typeof message === "string") {
        return {
            predicate: message,
            valid: false,
            inverted: false,
            value: null,
        };
    }
    return message;
};

export const addKeyToMessage = (key: string | number) => (
    msg: string | ValidationResult,
    entry: any
) => {
    const message = normalizeMessage(msg);
    const newKey = keysToPath(key, message.key);

    return {
        ...message,
        key: newKey,
        value: isDefined(message.value) ? message.value : path(newKey, entry),
    };
};
