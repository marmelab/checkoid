import { validator } from "../Validator";

export const isNumber = validator(
    <T>(value: T) =>
        typeof value === "number" && !isNaN(value) && isFinite(value),
    "value is a number"
);

export const isGt = (min: number) =>
    validator((value) => value > min, `value is greater than ${min}`);

export const isGte = (min: number) =>
    validator((value) => value >= min, `value is at least ${min}`);

export const isLt = (max: number) =>
    validator((value) => value < max, `value is less than ${max}`);

export const isLte = (max: number) =>
    validator((value) => value <= max, `value is at most ${max}`);
