export interface ValidationResult {
    value: any;
    predicate: string;
    valid: boolean;
    key?: string[];
}

interface ValidValidation {
    isValid: true;
    validResults: ValidationResult[];
    invalidResults: ValidationResult[];
    and(
        other: ValidValidation | InvalidValidation
    ): ValidValidation | InvalidValidation;
    and(other: ValidValidation): ValidValidation;
    and(other: InvalidValidation): InvalidValidation;
    or(other: ValidValidation | InvalidValidation): ValidValidation;
    not(): InvalidValidation;
    getResult: () => undefined;
}
interface InvalidValidation {
    isValid: false;
    validResults: ValidationResult[];
    invalidResults: ValidationResult[];
    and(other: ValidValidation | InvalidValidation): InvalidValidation;
    or(
        other: ValidValidation | InvalidValidation
    ): ValidValidation | InvalidValidation;
    or(other: ValidValidation): ValidValidation;
    or(other: InvalidValidation): InvalidValidation;
    not(): ValidValidation;
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
    and(other: any): any {
        if (isInvalidValidation(other)) {
            return createInvalidValidation(
                invalidResults.concat(other.invalidResults),
                validResults.concat(other.validResults)
            );
        }

        if (isValidValidation(other)) {
            return createValidValidation(
                validResults.concat(other.validResults),
                invalidResults.concat(other.invalidResults)
            );
        }
    },
    or(other: ValidValidation | InvalidValidation) {
        if (isInvalidValidation(other)) {
            return createValidValidation(
                validResults.concat(other.validResults),
                invalidResults.concat(other.invalidResults)
            );
        }
        if (isValidValidation(other)) {
            return createValidValidation(
                validResults.concat(other.validResults),
                invalidResults.concat(other.invalidResults)
            );
        }
    },
    not() {
        return createInvalidValidation(validResults, invalidResults);
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
    or(other: any): any {
        if (isInvalidValidation(other)) {
            return createInvalidValidation(
                invalidResults.concat(other.invalidResults),
                validResults.concat(other.validResults)
            );
        }

        if (isValidValidation(other)) {
            return createValidValidation(
                validResults.concat(other.validResults),
                invalidResults.concat(other.invalidResults)
            );
        }
    },
    not() {
        return createValidValidation(invalidResults, validResults);
    },
    getResult() {
        return invalidResults;
    },
});
