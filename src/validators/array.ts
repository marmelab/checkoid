import { validator, Validator, getEntry } from "../Validator";
import { SyncValidation, AsyncValidation } from "../Validation";
import { and, addKeyToMessage } from "../utils";

export const isArray = validator(
    (value: any) => Array.isArray(value),
    "value is an array"
);
export const hasUniqueItems = validator((values: any[]) => {
    if (!Array.isArray(values)) {
        return false;
    }
    return (
        new Set(values.map((value) => JSON.stringify(value))).size ===
        values.length
    );
}, "value items are unique");

export const arrayOf = <T extends SyncValidation | AsyncValidation>(
    validator: Validator<T>
): Validator<T> =>
    //@ts-ignore
    getEntry().chain((values) =>
        (Array.isArray(values) ? values : [])
            .map((item, key) =>
                validator
                    .beforeHook(() => item)
                    .afterHook((message) =>
                        addKeyToMessage(key)(message, values)
                    )
            )
            .reduce(and, isArray)
    );
