import { validator } from "../Validator";

export const isString = validator((value) =>
    typeof value === "string" ? undefined : "value must be a string"
);

export const match = (pattern) =>
    validator((value) =>
        pattern.test(value) ? undefined : `value must match pattern ${pattern}`
    );
