import { validator } from "../Validator";

export const isNumber = validator(
    <T>(value: T) =>
        typeof value === "number" && !isNaN(value) && isFinite(value),
    "value must be a number"
);

export const isGt = (min: number) =>
    validator((value) => value > min, `value must be greater than ${min}`);

export const isGte = (min: number) =>
    validator((value) => value >= min, `value must be at least ${min}`);

export const isLt = (max: number) =>
    validator((value) => value < max, `value must be less than ${max}`);

export const isLte = (max: number) =>
    validator((value) => value <= max, `value must be at most ${max}`);
