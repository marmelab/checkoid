import { Validator } from "./Validator";
import { SyncValidation, AsyncValidation } from "./Validation";

export const and = <
    A extends SyncValidation | AsyncValidation,
    B extends SyncValidation | AsyncValidation
>(
    validator1: Validator<A>,
    validator2: Validator<B>
) => validator1.and(validator2);

export const path = (keys, obj) =>
    keys.reduce((acc, key) => acc && acc[key], obj);

const isDefined = (value) => {
    return typeof value !== "undefined";
};

const keysToPath = (key1, key2) =>
    [].concat(key1).concat(isDefined(key2) ? key2 : []);

const normalizeMessage = (message) => {
    if (typeof message === "string") {
        return { message };
    }
    return message;
};

export const addKeyToMessage = (key) => (msg, entry) => {
    const message = normalizeMessage(msg);
    const newKey = keysToPath(key, message.key);

    return {
        ...message,
        key: newKey,
        value: isDefined(message.value) ? message.value : path(newKey, entry),
    };
};
