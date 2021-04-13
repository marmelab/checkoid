import { validator } from "../Validator";

export const isString = validator(
    (value) => typeof value === "string",
    "value is a string"
);

export const match = (pattern: RegExp) =>
    validator((value) => pattern.test(value), `value match pattern ${pattern}`);
