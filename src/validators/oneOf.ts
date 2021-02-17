import { Validator, validator, createValidator } from "../Validator";

export const oneOf = ([firstValidator, ...validators]: Validator<any>[]) => {
    const xorValidator = validators.reduce((finalValidator, validatorItem) => {
        return finalValidator.xor(validatorItem);
    }, firstValidator);

    return xorValidator.chain((v: any) => {
        if (v.isValid) {
            return createValidator(() => v);
        }

        return validator(() => false, "value pass only one validation").and(
            createValidator(() => v)
        );
    });
};
