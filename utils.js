exports.formatKey = (key) => (/^\[\d\]/.test(key) ? key : `.${key}`);
