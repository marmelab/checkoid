import { validator } from "../Validator";

export const isString = validator(
    (value) => typeof value === "string",
    "value is a string"
);

export const match = (pattern: RegExp) =>
    validator((value) => pattern.test(value), `value match pattern ${pattern}`);

const dateTimeRe = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
export const dateTime = match(dateTimeRe).format(
    () => `value must be a valid date-time string (yyyy-MM-ddThh:mm:ssZ)`
);

const dateRe = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
export const date = match(dateRe).format(
    () => `value must be a valid date string (yyyy-MM-dd)`
);

const base64Re = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
export const base64 = match(base64Re).format(
    () => `value must be a valid base64 string`
);

const binaryRe = /^[0-1]{1,}$/;
export const binary = match(binaryRe).format(
    () => `value must be a valid binary string`
);

export const oneOf = (values: string[]) =>
    validator(
        (value) => (values.indexOf(value) !== -1 ? true : false),
        `Value is one of ${values.map((value) => `"${value}"`).join(", ")}`
    );
