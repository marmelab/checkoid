import { validator, Validator, getEntry } from "../Validator";
import { SyncValidation, AsyncValidation } from "../Validation";
import { and, addKeyToMessage } from "../utils";

export const isArray = validator(
    (value: any) => Array.isArray(value),
    "value must be an array"
);

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
