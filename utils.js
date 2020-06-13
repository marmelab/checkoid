exports.formatKey = (key) => {
    if (!key) {
        return "";
    }
    return /^\[\d\]/.test(key) ? key : `.${key}`;
};
