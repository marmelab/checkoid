import { validator } from "../Validator";

export const isString = validator(
    (value) => typeof value === "string",
    "value must be a string"
);

export const match = (pattern: RegExp) =>
    validator(
        (value) => pattern.test(value),
        `value must match pattern ${pattern}`
    );
