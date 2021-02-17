import { Validator, validator } from "../Validator";

export const anyOf = (validators: Validator<any>[]) => {
    return validators.reduce(
        (finalValidator, validator) => {
            return finalValidator.or(validator);
        },
        validator(() => false, "value pass at least one validation")
    );
};
