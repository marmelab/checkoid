import * as SwaggerParser from "@apidevtools/swagger-parser";
import { OpenAPIV3 } from "openapi-types";

import { Validator } from "../Validator";
import { SyncValidation } from "../Validation";

import {
    isString,
    date,
    dateTime,
    binary,
    base64,
    match,
    oneOf,
} from "../validators/string";

import {
    isNumber,
    isInteger,
    isGt,
    isGte,
    isLt,
    isLte,
    isMultipleOf,
} from "../validators/number";

import { isBoolean } from "../validators/boolean";

import { arrayOf } from "../validators/array";
import { shape } from "../validators/object";

export type Schema = OpenAPIV3.SchemaObject;

export const getOpenApiSchema = async (path: string) => {
    const schema = (await SwaggerParser.parse(path)) as OpenAPIV3.Document;

    return schema.components.schemas;
};

export const configureNumberValidator = (schema: Schema) => {
    let numberValidator =
        schema.format === "number" ? isNumber : isNumber.and(isInteger);
    if (schema.minimum) {
        numberValidator = schema.exclusiveMinimum
            ? numberValidator.and(isGt(schema.minimum))
            : numberValidator.and(isGte(schema.minimum));
    }
    if (schema.maximum) {
        numberValidator = schema.exclusiveMaximum
            ? numberValidator.and(isLt(schema.maximum))
            : numberValidator.and(isLte(schema.maximum));
    }
    if (schema.multipleOf) {
        numberValidator = numberValidator.and(isMultipleOf(schema.multipleOf));
    }
    return numberValidator;
};

export const schemaToValidator = (
    schema: Schema
): Validator<SyncValidation> => {
    switch (schema.type) {
        case "string": {
            switch (schema.format) {
                case "date-time":
                    return isString.and(dateTime);
                case "date":
                    return isString.and(date);
                case "binary":
                    return isString.and(binary);
                case "byte":
                    return isString.and(base64);
                default: {
                    if (schema.enum) {
                        return isString.and(oneOf(schema.enum));
                    }
                    if (schema.pattern) {
                        return isString.and(match(new RegExp(schema.pattern)));
                    }
                    return isString;
                }
            }
        }
        case "integer":
        case "number": {
            return configureNumberValidator(schema);
        }
        case "boolean":
            return isBoolean;
        case "array":
            return arrayOf(
                schemaToValidator(schema.items as OpenAPIV3.ArraySchemaObject)
            );
        case "object":
            return shape(schemasToValidators(schema.properties));
    }
};

export const schemasToValidators = (schemas: {
    [key: string]:
        | OpenAPIV3.ReferenceObject
        | OpenAPIV3.ArraySchemaObject
        | OpenAPIV3.NonArraySchemaObject;
}): { [key: string]: Validator<SyncValidation> } => {
    return Object.keys(schemas).reduce((acc, key) => {
        const schema = schemas[key] as Schema;
        return {
            ...acc,
            [key]: schemaToValidator(schema),
        };
    }, {});
};

export const openApiValidator = async (path: string) => {
    const schemas = await getOpenApiSchema(path);

    return schemasToValidators(schemas);
};
