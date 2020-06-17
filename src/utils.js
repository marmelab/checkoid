exports.formatKey = (key) => {
    if (!key) {
        return "";
    }
    return /^\[\d\]/.test(key) ? key : `.${key}`;
};

exports.and = (validator1, validator2) => validator1.and(validator2);
