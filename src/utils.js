exports.formatKey = (key) => {
    if (!key) {
        return "";
    }
    return /^\[\d\]/.test(key) ? key : `.${key}`;
};

exports.and = (validator1, validator2) => validator1.and(validator2);

exports.addKeyToMessage = (key) => (message, entry) =>
    message.message
        ? {
              key: [].concat(key).concat(message.key || []),
              message: message.message,
              value:
                  typeof message.value !== "undefined"
                      ? message.value
                      : entry && entry[key] && entry[key][message[key]],
          }
        : { key: [key], message, value: entry && entry[key] };
