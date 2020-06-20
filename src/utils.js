exports.and = (validator1, validator2) => validator1.and(validator2);

const path = (keys, obj) => keys.reduce((acc, key) => acc && acc[key], obj);
exports.path;

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

exports.addKeyToMessage = (key) => (msg, entry) => {
    const message = normalizeMessage(msg);
    const newKey = keysToPath(key, message.key);

    return {
        ...message,
        key: newKey,
        value: isDefined(message.value) ? message.value : path(newKey, entry),
    };
};
