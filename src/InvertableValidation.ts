export interface ValidationResult {
    value: any;
    message: string;
    key?: string[];
}

interface ValidValidation {
    isValid: true;
    validResults: ValidationResult[];
    invalidResults: ValidationResult[];
    and(
        other: ValidValidation | InvalidValidation
    ): ValidValidation | InvalidValidation;
    getResult: () => undefined;
}
interface InvalidValidation {
    isValid: false;
    validResults: ValidationResult[];
    invalidResults: ValidationResult[];
    and(other: ValidValidation | InvalidValidation): InvalidValidation;
    getResult: () => ValidationResult[];
}

const isValidValidation = (
    value: ValidValidation | InvalidValidation
): value is ValidValidation => value.isValid;

const isInvalidValidation = (
    value: ValidValidation | InvalidValidation
): value is InvalidValidation => value.isValid === false;

export const createValidValidation = (
    validResults: ValidationResult[],
    invalidResults: ValidationResult[] = []
): ValidValidation => ({
    validResults,
    invalidResults,
    isValid: true,
    and(other: ValidValidation | InvalidValidation) {
        return isInvalidValidation(other)
            ? createInvalidValidation(
                  other.invalidResults,
                  validResults.concat(other.validResults)
              )
            : createValidValidation(validResults.concat(other.validResults));
    },
    getResult() {
        return undefined;
    },
});

export const createInvalidValidation = (
    invalidResults: ValidationResult[],
    validResults: ValidationResult[] = []
): InvalidValidation => ({
    validResults,
    invalidResults,
    isValid: false,
    and(other: ValidValidation | InvalidValidation) {
        return createInvalidValidation(
            invalidResults.concat(other.invalidResults),
            validResults.concat(other.validResults)
        );
    },
    getResult() {
        return invalidResults;
    },
});
