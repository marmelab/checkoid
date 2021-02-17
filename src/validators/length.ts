import { validator } from "../Validator";

export const hasLengthOf = (x: number) =>
    validator(
        (value) => value && value.length === x,
        `value has a length of ${x}`
    );

export const hasLengthGt = (min: number) =>
    validator(
        (value) => (value && value.length > min ? true : false),
        `value has a length greater than ${min}`
    );

export const hasLengthGte = (min: number) =>
    validator(
        (value) => value && value.length >= min,
        `value has a length of at least ${min}`
    );

export const hasLengthLt = (max: number) =>
    validator(
        (value) => value && value.length < max,
        `value has a length less than ${max}`
    );

export const hasLengthLte = (max: number) =>
    validator(
        (value) => value && value.length <= max,
        `value has a length of at most ${max}`
    );
