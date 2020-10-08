const { validator } = require("../Validator");

const isBoolean = validator((value) =>
    typeof value === "boolean" ? undefined : "value must be a boolean"
);

const isTrue = validator((value) => {
    value === true ? undefined : "value must be true";
});

const isFalse = validator((value) => {
    value === false ? undefined : "value must be true";
});

module.exports = {
    isBoolean,
    isTrue,
    isFalse,
};
