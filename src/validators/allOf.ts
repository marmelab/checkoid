import { Validator, validator } from "../Validator";

export const allOf = (validators: Validator<any>[]) => {
    return validators.reduce(
        (finalValidator, validator) => {
            return finalValidator.and(validator);
        },
        validator(() => true, "value pass all validation")
    );
};
