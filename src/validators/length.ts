import { validator } from "../Validator";

export const hasLengthOf = (x) =>
    validator((value) =>
        value && value.length === x
            ? undefined
            : `value must have a length of ${x}`
    );

export const hasLengthGt = (min) =>
    validator((value) =>
        value && value.length > min
            ? undefined
            : `value must have a length greater than ${min}`
    );

export const hasLengthGte = (min) =>
    validator((value) =>
        value && value.length >= min
            ? undefined
            : `value must have a length of at least ${min}`
    );

export const hasLengthLt = (max) =>
    validator((value) =>
        value && value.length < max
            ? undefined
            : `value must have a length less than ${max}`
    );

export const hasLengthLte = (max) =>
    validator((value) =>
        value && value.length <= max
            ? undefined
            : `value must have a length of at most ${max}`
    );
