import { resolve } from "path";
import { OpenAPIV3 } from "openapi-types";

import { getOpenApiSchema, schemaToValidator, Schema } from "./openapi";

const schemas = {
    Order: {
        type: "object",
        properties: {
            id: {
                type: "integer",
                format: "int64",
            },
            petId: {
                type: "integer",
                format: "int64",
            },
            quantity: {
                type: "integer",
                format: "int32",
            },
            shipDate: {
                type: "string",
                format: "date-time",
            },
            status: {
                type: "string",
                description: "Order Status",
                enum: ["placed", "approved", "delivered"],
            },
            complete: {
                type: "boolean",
                default: false,
            },
        },
        xml: {
            name: "Order",
        },
    },
    Category: {
        type: "object",
        properties: {
            id: {
                type: "integer",
                format: "int64",
            },
            name: {
                type: "string",
            },
        },
        xml: {
            name: "Category",
        },
    },
    User: {
        type: "object",
        properties: {
            id: {
                type: "integer",
                format: "int64",
            },
            username: {
                type: "string",
            },
            firstName: {
                type: "string",
            },
            lastName: {
                type: "string",
            },
            email: {
                type: "string",
            },
            password: {
                type: "string",
            },
            phone: {
                type: "string",
            },
            userStatus: {
                type: "integer",
                format: "int32",
                description: "User Status",
            },
        },
        xml: {
            name: "User",
        },
    },
    Tag: {
        type: "object",
        properties: {
            id: {
                type: "integer",
                format: "int64",
            },
            name: {
                type: "string",
            },
        },
        xml: {
            name: "Tag",
        },
    },
    Pet: {
        type: "object",
        required: ["name", "photoUrls"],
        properties: {
            id: {
                type: "integer",
                format: "int64",
            },
            category: {
                $ref: "#/components/schemas/Category",
            },
            name: {
                type: "string",
                example: "doggie",
            },
            photoUrls: {
                type: "array",
                xml: {
                    name: "photoUrl",
                    wrapped: true,
                },
                items: {
                    type: "string",
                },
            },
            tags: {
                type: "array",
                xml: {
                    name: "tag",
                    wrapped: true,
                },
                items: {
                    $ref: "#/components/schemas/Tag",
                },
            },
            status: {
                type: "string",
                description: "pet status in the store",
                enum: ["available", "pending", "sold"],
            },
        },
        xml: {
            name: "Pet",
        },
    },
    ApiResponse: {
        type: "object",
        properties: {
            code: {
                type: "integer",
                format: "int32",
            },
            type: {
                type: "string",
            },
            message: {
                type: "string",
            },
        },
    },
};

describe("openapi", () => {
    describe("getOpenApiSchema", () => {
        it("should open and parse openApiSchema json extracting components Schema", async () => {
            expect(
                await getOpenApiSchema(
                    resolve(__dirname, "./openapiSchema.json")
                )
            ).toEqual(schemas);
        });
        it("should open and parse openApiSchema yml extracting components Schema", async () => {
            expect(
                await getOpenApiSchema(
                    resolve(__dirname, "./openapiSchema.yml")
                )
            ).toEqual(schemas);
        });
    });

    describe("schemaToValidator", () => {
        describe("string type", () => {
            it("should handle string type schema", () => {
                const schema: Schema = {
                    type: "string",
                };

                const validator = schemaToValidator(schema);

                expect(validator.check("A simple string")).toBe(undefined);
                expect(validator.check(45)).toEqual([
                    { message: "value must be a string", value: 45 },
                ]);
            });

            it("should handle string type schema with format date-time", () => {
                const schema: Schema = {
                    type: "string",
                    format: "date-time",
                };

                const validator = schemaToValidator(schema);

                expect(validator.check("2017-07-21T17:32:28Z")).toBe(undefined);
                expect(validator.check("A simple string")).toEqual([
                    {
                        message:
                            "value must be a valid date-time string (yyyy-MM-ddThh:mm:ssZ)",
                        value: "A simple string",
                    },
                ]);
                expect(validator.check(45)).toEqual([
                    { message: "value must be a string", value: 45 },
                    {
                        message:
                            "value must be a valid date-time string (yyyy-MM-ddThh:mm:ssZ)",
                        value: 45,
                    },
                ]);
            });

            it("should handle string type schema with format date", () => {
                const schema: Schema = {
                    type: "string",
                    format: "date",
                };

                const validator = schemaToValidator(schema);

                expect(validator.check("2017-07-21")).toBe(undefined);
                expect(validator.check("A simple string")).toEqual([
                    {
                        message:
                            "value must be a valid date string (yyyy-MM-dd)",
                        value: "A simple string",
                    },
                ]);
                expect(validator.check(45)).toEqual([
                    { message: "value must be a string", value: 45 },
                    {
                        message:
                            "value must be a valid date string (yyyy-MM-dd)",
                        value: 45,
                    },
                ]);
            });

            it("should handle string type schema with format binary", () => {
                const schema: Schema = {
                    type: "string",
                    format: "binary",
                };

                const validator = schemaToValidator(schema);

                expect(validator.check("011110")).toBe(undefined);
                expect(validator.check("A simple string")).toEqual([
                    {
                        message: "value must be a valid binary string",
                        value: "A simple string",
                    },
                ]);
                expect(validator.check(45)).toEqual([
                    { message: "value must be a string", value: 45 },
                    {
                        message: "value must be a valid binary string",
                        value: 45,
                    },
                ]);
            });

            it("should handle string type schema with format byte", () => {
                const schema: Schema = {
                    type: "string",
                    format: "byte",
                };

                const validator = schemaToValidator(schema);

                expect(validator.check("U3dhZ2dlciByb2Nrcw==")).toBe(undefined);
                expect(validator.check("A simple string")).toEqual([
                    {
                        message: "value must be a valid base64 string",
                        value: "A simple string",
                    },
                ]);
                expect(validator.check(45)).toEqual([
                    { message: "value must be a string", value: 45 },
                    {
                        message: "value must be a valid base64 string",
                        value: 45,
                    },
                ]);
            });

            it("should handle string type schema with enum", () => {
                const schema: Schema = {
                    type: "string",
                    enum: ["one", "two", "three"],
                };

                const validator = schemaToValidator(schema);

                expect(validator.check("one")).toBe(undefined);
                expect(validator.check("two")).toBe(undefined);
                expect(validator.check("three")).toBe(undefined);
                expect(validator.check("four")).toEqual([
                    {
                        message: 'value must be one of "one", "two", "three"',
                        value: "four",
                    },
                ]);
                expect(validator.check(45)).toEqual([
                    { message: "value must be a string", value: 45 },
                    {
                        message: 'value must be one of "one", "two", "three"',
                        value: 45,
                    },
                ]);
            });

            it("should handle string type schema with pattern", () => {
                const schema: Schema = {
                    type: "string",
                    pattern: "@.*?\\.",
                };

                const validator = schemaToValidator(schema);

                expect(validator.check("test@gmail.com")).toBe(undefined);
                expect(validator.check("A simple string")).toEqual([
                    {
                        message: "value must match pattern /@.*?\\./",
                        value: "A simple string",
                    },
                ]);
                expect(validator.check(45)).toEqual([
                    { message: "value must be a string", value: 45 },
                    {
                        message: "value must match pattern /@.*?\\./",
                        value: 45,
                    },
                ]);
            });

            it("should handle string type schema with minLength", () => {
                const schema: Schema = {
                    type: "string",
                    minLength: 20,
                };

                const validator = schemaToValidator(schema);

                expect(validator.check("A string that pass validation")).toBe(
                    undefined
                );
                expect(validator.check("A too small string")).toEqual([
                    {
                        message: "value must be at least 20 characters long",
                        value: "A too small string",
                    },
                ]);
                expect(validator.check(45)).toEqual([
                    { message: "value must be a string", value: 45 },
                    {
                        message: "value must be at least 20 characters long",
                        value: 45,
                    },
                ]);
            });

            it("should handle string type schema with maxLength", () => {
                const schema: Schema = {
                    type: "string",
                    maxLength: 50,
                };

                const validator = schemaToValidator(schema);

                expect(validator.check("A string that pass validation")).toBe(
                    undefined
                );
                expect(
                    validator.check(
                        "A string that is way too long. Seriously, what did you expect ?"
                    )
                ).toEqual([
                    {
                        message: "value must be at most 50 characters long",
                        value:
                            "A string that is way too long. Seriously, what did you expect ?",
                    },
                ]);
                expect(validator.check(45)).toEqual([
                    { message: "value must be a string", value: 45 },
                    {
                        message: "value must be at most 50 characters long",
                        value: 45,
                    },
                ]);
            });

            it("should handle absurdly complex string type schema", () => {
                const schema: Schema = {
                    type: "string",
                    format: "binary",
                    pattern: "^000",
                    enum: ["0001", "00010", "00011"],
                    minLength: 3,
                    maxLength: 5,
                };

                const validator = schemaToValidator(schema);

                expect(validator.check("0001")).toBe(undefined);
                expect(validator.check(45)).toEqual([
                    { message: "value must be a string", value: 45 },
                    {
                        message: "value must be a valid binary string",
                        value: 45,
                    },
                    {
                        message:
                            'value must be one of "0001", "00010", "00011"',
                        value: 45,
                    },
                    { message: "value must match pattern /^000/", value: 45 },
                    {
                        message: "value must be at least 3 characters long",
                        value: 45,
                    },
                    {
                        message: "value must be at most 5 characters long",
                        value: 45,
                    },
                ]);
            });
        });
        describe("number type", () => {
            it("should handle number type schema", () => {
                const schema: Schema = {
                    type: "number",
                };
                const validator = schemaToValidator(schema);

                expect(validator.check(42.5)).toBe(undefined);
                expect(validator.check("A string")).toEqual([
                    { message: "value must be a number", value: "A string" },
                ]);
                expect(validator.check("42")).toEqual([
                    { message: "value must be a number", value: "42" },
                ]);
            });
            it("should handle number type schema with minimum", () => {
                const schema: Schema = {
                    type: "number",
                    minimum: 10,
                };
                const validator = schemaToValidator(schema);

                expect(validator.check(42.5)).toBe(undefined);
                expect(validator.check(10)).toBe(undefined);
                expect(validator.check(7.5)).toEqual([
                    { message: "value must be at least 10", value: 7.5 },
                ]);
            });
            it("should handle number type schema with minimum and exclusiveMinimum", () => {
                const schema: Schema = {
                    type: "number",
                    minimum: 10,
                    exclusiveMinimum: true,
                };
                const validator = schemaToValidator(schema);

                expect(validator.check(42.5)).toBe(undefined);
                expect(validator.check(10)).toEqual([
                    { message: "value must be greater than 10", value: 10 },
                ]);
                expect(validator.check(7.5)).toEqual([
                    { message: "value must be greater than 10", value: 7.5 },
                ]);
            });
            it("should handle number type schema with maximum", () => {
                const schema: Schema = {
                    type: "number",
                    maximum: 100,
                };
                const validator = schemaToValidator(schema);

                expect(validator.check(42.5)).toBe(undefined);
                expect(validator.check(100)).toBe(undefined);
                expect(validator.check(101.5)).toEqual([
                    { message: "value must be at most 100", value: 101.5 },
                ]);
            });
            it("should handle number type schema with maximum and exclusiveMaximum", () => {
                const schema: Schema = {
                    type: "number",
                    maximum: 100,
                    exclusiveMaximum: true,
                };
                const validator = schemaToValidator(schema);

                expect(validator.check(42.5)).toBe(undefined);
                expect(validator.check(100)).toEqual([
                    { message: "value must be less than 100", value: 100 },
                ]);
                expect(validator.check(101.5)).toEqual([
                    { message: "value must be less than 100", value: 101.5 },
                ]);
            });
        });
        describe("integer type", () => {
            it("should handle integer type schema", () => {
                const schema: Schema = {
                    type: "integer",
                };
                const validator = schemaToValidator(schema);

                expect(validator.check(42)).toBe(undefined);
                expect(validator.check(42.5)).toEqual([
                    { message: "value must be an integer", value: 42.5 },
                ]);
                expect(validator.check("A string")).toEqual([
                    { message: "value must be a number", value: "A string" },
                    { message: "value must be an integer", value: "A string" },
                ]);
                expect(validator.check("42")).toEqual([
                    { message: "value must be a number", value: "42" },
                    { message: "value must be an integer", value: "42" },
                ]);
            });
            it("should handle number type schema with minimum", () => {
                const schema: Schema = {
                    type: "integer",
                    minimum: 10,
                };
                const validator = schemaToValidator(schema);

                expect(validator.check(42)).toBe(undefined);
                expect(validator.check(10)).toBe(undefined);
                expect(validator.check(7.5)).toEqual([
                    { message: "value must be an integer", value: 7.5 },
                    { message: "value must be at least 10", value: 7.5 },
                ]);
            });
            it("should handle number type schema with minimum and exclusiveMinimum", () => {
                const schema: Schema = {
                    type: "integer",
                    minimum: 10,
                    exclusiveMinimum: true,
                };
                const validator = schemaToValidator(schema);

                expect(validator.check(42)).toBe(undefined);
                expect(validator.check(10)).toEqual([
                    { message: "value must be greater than 10", value: 10 },
                ]);
                expect(validator.check(7.5)).toEqual([
                    { message: "value must be an integer", value: 7.5 },
                    { message: "value must be greater than 10", value: 7.5 },
                ]);
            });
            it("should handle number type schema with maximum", () => {
                const schema: Schema = {
                    type: "integer",
                    maximum: 100,
                };
                const validator = schemaToValidator(schema);

                expect(validator.check(42)).toBe(undefined);
                expect(validator.check(100)).toBe(undefined);
                expect(validator.check(101.5)).toEqual([
                    { message: "value must be an integer", value: 101.5 },
                    { message: "value must be at most 100", value: 101.5 },
                ]);
            });
            it("should handle number type schema with maximum and exclusiveMaximum", () => {
                const schema: Schema = {
                    type: "integer",
                    maximum: 100,
                    exclusiveMaximum: true,
                };
                const validator = schemaToValidator(schema);

                expect(validator.check(42)).toBe(undefined);
                expect(validator.check(100)).toEqual([
                    { message: "value must be less than 100", value: 100 },
                ]);
                expect(validator.check(101.5)).toEqual([
                    { message: "value must be an integer", value: 101.5 },
                    { message: "value must be less than 100", value: 101.5 },
                ]);
            });
        });
    });
});
