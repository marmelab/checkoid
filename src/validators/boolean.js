const { validator } = require("../Validator");

const boolean = validator((value) =>
    typeof value === "boolean" ? undefined : "value must be a boolean"
);

const isTrue = validator((value) => {
    value === true ? undefined : "value must be true";
});

const isFalse = validator((value) => {
    value === false ? undefined : "value must be true";
});

const truthy = validator((value) =>
    !!value ? undefined : "value must be truthy"
);

const falsy = validator((value) =>
    !value ? undefined : "value must be falsy"
);

module.exports = {
    boolean,
    isTrue,
    truthy,
    isFalse,
    falsy,
};
