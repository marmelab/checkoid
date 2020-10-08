import { validator } from "../Validator";

export const isBoolean = validator((value) =>
    typeof value === "boolean" ? undefined : "value must be a boolean"
);

export const isTrue = validator((value) => {
    value === true ? undefined : "value must be true";
});

export const isFalse = validator((value) => {
    value === false ? undefined : "value must be true";
});
