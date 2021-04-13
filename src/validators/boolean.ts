import { validator } from "../Validator";

export const isBoolean = validator(
    (value) => typeof value === "boolean",
    "value is a boolean"
);

export const isTrue = validator((value) => {
    return value === true;
}, "value is true");

export const isFalse = validator((value) => {
    return value === false;
}, "value is false");
