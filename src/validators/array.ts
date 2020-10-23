import { validator, Validator } from "../Validator";
import { and, addKeyToMessage } from "../utils";

export const isArray = validator((value) =>
    Array.isArray(value) ? undefined : "value must be an array"
);

export const arrayOf = (validator) =>
    Validator.getEntry().chain((values) =>
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
