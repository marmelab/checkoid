import * as SwaggerParser from "@apidevtools/swagger-parser";
import { OpenAPIV3 } from "openapi-types";

import { Validator, validator, createValidator } from "../Validator";
import { SyncValidation } from "../Validation";
import { path, andMany } from "../utils";

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

import { oneOf as oneOfComplex } from "../validators/oneOf";
import { anyOf } from "../validators/anyOf";
import { allOf } from "../validators/allOf";

import { isBoolean } from "../validators/boolean";

import { arrayOf, hasUniqueItems } from "../validators/array";
import {
    shape,
    isObject,
    objectOf,
    hasMinimumKeys,
    hasMaximumKeys,
} from "../validators/object";

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
            return allOf(
                schema.allOf.map((schema) =>
                    schemaToValidator(schema, document)
                )
            );
        }
        if (schema.anyOf) {
            return anyOf(
                schema.anyOf.map((schema) => {
                    return schemaToValidator(schema, document);
                })
            );
        }
        if (schema.oneOf) {
            return oneOfComplex(
                schema.oneOf.map((schema) =>
                    schemaToValidator(schema, document)
                )
            );
        }
        if (schema.not) {
            return schemaToValidator(schema.not, document).not();
        }
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
            const arrayValidator = arrayOf(
                schemaToValidator(
                    schema.items as OpenAPIV3.ArraySchemaObject,
                    document
                )
            );
            if (schema.uniqueItems) {
                return arrayValidator.and(hasUniqueItems);
            }
            return arrayValidator;
        case "object": {
            const propertiesValidator = schema.properties
                ? shape(
                      schemasToValidators(schema.properties, document),
                      !schema.additionalProperties,
                      schema.required || []
                  )
                : null;

            const additionalPropertiesValidator =
                schema.additionalProperties &&
                typeof schema.additionalProperties == "object"
                    ? objectOf(
                          schemaToValidator(
                              schema.additionalProperties,
                              document
                          )
                      ).beforeHook((value) => {
                          if (
                              !schema.properties ||
                              typeof value !== "object" ||
                              value === null
                          ) {
                              return value;
                          }
                          const ignoredKeys = Object.keys(schema.properties);

                          return Object.keys(value).reduce((acc, key) => {
                              if (ignoredKeys.includes(key)) {
                                  return acc;
                              }

                              return {
                                  ...acc,
                                  [key]: value[key],
                              };
                          }, {});
                      })
                    : null;

            const maxPropertiesValidator = schema.maxProperties
                ? hasMaximumKeys(schema.maxProperties)
                : null;

            const minPropertiesValidator = schema.minProperties
                ? hasMinimumKeys(schema.minProperties)
                : null;

            const validators = [
                propertiesValidator,
                additionalPropertiesValidator,
                maxPropertiesValidator,
                minPropertiesValidator,
            ].filter((v) => !!v);

            if (!validators.length) {
                return isObject;
            }

            return andMany(validators);
        }
        default:
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
