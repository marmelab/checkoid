import * as SwaggerParser from "@apidevtools/swagger-parser";
import { OpenAPIV3 } from "openapi-types";

import { Validator, validator } from "../Validator";
import { SyncValidation } from "../Validation";
import { path } from "../utils";

import {
    isString,
    date,
    dateTime,
    binary,
    base64,
    match,
    oneOf,
    minLength,
    maxLength,
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
import { shape, isObject } from "../validators/object";

export type Schema = OpenAPIV3.SchemaObject;

export const getOpenApiSchema = async (path: string) => {
    return (SwaggerParser.parse(path) as unknown) as OpenAPIV3.Document;
};

const isReferenceObject = (
    schema: any
): schema is OpenAPIV3.ReferenceObject => {
    return schema.$ref;
};
export const configureNumberValidator = (schema: Schema) => {
    let numberValidator =
        schema.type === "number" ? isNumber : isNumber.and(isInteger);
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

const getStringFormatValidator = (format: String | undefined) => {
    switch (format) {
        case "date-time":
            return isString.and(dateTime);
        case "date":
            return isString.and(date);
        case "binary":
            return isString.and(binary);
        case "byte":
            return isString.and(base64);
        default: {
            return isString;
        }
    }
};

export const configStringValidator = (schema: Schema) => {
    let resultValidator = getStringFormatValidator(schema.format);

    if (schema.enum) {
        resultValidator = resultValidator.and(oneOf(schema.enum));
    }
    if (schema.pattern) {
        resultValidator = resultValidator.and(
            match(new RegExp(schema.pattern))
        );
    }

    if (schema.minLength) {
        resultValidator = resultValidator.and(minLength(schema.minLength));
    }

    if (schema.maxLength) {
        resultValidator = resultValidator.and(maxLength(schema.maxLength));
    }

    return resultValidator;
};

export const schemaToValidator = (
    schema: Schema | OpenAPIV3.ReferenceObject,
    document: OpenAPIV3.Document
): Validator<SyncValidation> => {
    if (isReferenceObject(schema)) {
        const keys = schema.$ref.replace("#/", "").split("/");

        return schemaToValidator(path(keys, document), document);
    }
    if (!schema.type) {
        if (schema.allOf) {
            return schema.allOf.reduce(
                (finalValidator, schema) => {
                    return finalValidator.and(
                        schemaToValidator(schema, document)
                    );
                },
                validator(() => undefined)
            );
        }
        if (schema.anyOf) {
            return schema.anyOf.reduce(
                (finalValidator, schema) => {
                    return finalValidator.or(
                        schemaToValidator(schema, document)
                    );
                },
                validator(() => "value must pass at least one validation")
            );
        }
        // @TODO handle schema with no type but oneOf, or not props
        throw new Error("Unhandled schema");
    }
    switch (schema.type) {
        case "string": {
            return configStringValidator(schema);
        }
        case "integer":
        case "number": {
            return configureNumberValidator(schema);
        }
        case "boolean":
            return isBoolean;
        case "array":
            return arrayOf(
                schemaToValidator(
                    schema.items as OpenAPIV3.ArraySchemaObject,
                    document
                )
            );
        case "object": {
            if (schema.properties) {
                return shape(schemasToValidators(schema.properties, document));
            }
            return isObject;
        }
        default:
            throw new Error("Unexpected schema type");
    }
};

export const schemasToValidators = (
    schemas: {
        [key: string]:
            | OpenAPIV3.ArraySchemaObject
            | OpenAPIV3.NonArraySchemaObject
            | OpenAPIV3.ReferenceObject;
    },
    document: OpenAPIV3.Document
): { [key: string]: Validator<SyncValidation> } => {
    return Object.keys(schemas).reduce((acc, key) => {
        const schema = schemas[key];
        return {
            ...acc,
            [key]: schemaToValidator(schema, document),
        };
    }, {});
};

export const parseOpenApiDocument = (
    document: OpenAPIV3.Document
): { [key: string]: Validator<SyncValidation> } => {
    return schemasToValidators(document.components.schemas, document);
};

export const openApiValidator = async (path: string) => {
    const document = await getOpenApiSchema(path);

    return parseOpenApiDocument(document);
};
