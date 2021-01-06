import * as SwaggerParser from "@apidevtools/swagger-parser";
import { OpenAPIV3 } from "openapi-types";

import {
    isString,
    date,
    dateTime,
    binary,
    base64,
    match,
    oneOf,
} from "../validators/string";

type Schema = OpenAPIV3.SchemaObject;

export const getOpenApiSchema = async (path: string) => {
    const schema = (await SwaggerParser.parse(path)) as OpenAPIV3.Document;

    return schema.components.schemas;
};

export const schemaToValidator = (schema: Schema) => {
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
                        isString.and(oneOf(schema.enum));
                    }
                    if (schema.pattern) {
                        isString.and(match(new RegExp(schema.pattern)));
                    }
                    return isString;
                }
            }
        }
        case "array":
        case "boolean":
        case "integer":
        case "number":
        case "object":
    }
};

export const openApiValidator = async (path: string) => {
    const schemas = await getOpenApiSchema(path);

    Object.keys(schemas).reduce((acc, key) => {
        const schema = schemas[key] as Schema;
        switch (schema.type) {
            case "array":
            case "boolean":
            case "integer":
            case "number":
            case "object":
            case "string":
        }
        return {
            ...acc,
            [key]: schema,
        };
    }, {});
};
