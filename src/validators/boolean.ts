import { validator } from "../Validator";

export const isBoolean = validator(
    (value) => typeof value === "boolean",
    "value must be a boolean"
);

export const isTrue = validator((value) => {
    return value === true;
}, "value must be true");

export const isFalse = validator((value) => {
    return value === false;
}, "value must be true");
