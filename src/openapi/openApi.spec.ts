import { resolve } from "path";

import {
    getOpenApiSchema,
    schemaToValidator,
    Schema,
    parseOpenApiDocument,
} from "./openapi";
import document from "./parsedDocument";

describe("openapi", () => {
    describe("getOpenApiSchema", () => {
        it("should open and parse openApiSchema json extracting components Schema", async () => {
            expect(
                await getOpenApiSchema(
                    resolve(__dirname, "./openapiSchema.json")
                )
            ).toEqual(document);
        });
        it("should open and parse openApiSchema yml extracting components Schema", async () => {
            expect(
                await getOpenApiSchema(
                    resolve(__dirname, "./openapiSchema.yml")
                )
            ).toEqual(document);
        });
    });

    describe("parseOpenApiDocument", () => {
        it("should create an Order validator from document", () => {
            const validators = parseOpenApiDocument(document);

            expect(validators.Order).toBeDefined();
            expect(
                validators.Order.check({
                    id: 42,
                    petId: 7,
                    quantity: 101,
                    shipDate: "1961-01-25T00:00:00Z",
                    status: "delivered",
                    complete: true,
                })
            ).toBe(undefined);
            expect(validators.Order.check(null)).toEqual([
                {
                    key: ["id"],
                    message: "value must be a number",
                    value: null,
                },
                {
                    key: ["id"],
                    message: "value must be an integer",
                    value: null,
                },
                {
                    key: ["petId"],
                    message: "value must be a number",
                    value: null,
                },
                {
                    key: ["petId"],
                    message: "value must be an integer",
                    value: null,
                },
                {
                    key: ["quantity"],
                    message: "value must be a number",
                    value: null,
                },
                {
                    key: ["quantity"],
                    message: "value must be an integer",
                    value: null,
                },
                {
                    key: ["shipDate"],
                    message: "value must be a string",
                    value: null,
                },
                {
                    key: ["shipDate"],
                    message:
                        "value must be a valid date-time string (yyyy-MM-ddThh:mm:ssZ)",
                    value: null,
                },
                {
                    key: ["status"],
                    message: "value must be a string",
                    value: null,
                },
                {
                    key: ["status"],
                    message:
                        'value must be one of "placed", "approved", "delivered"',
                    value: null,
                },
                {
                    key: ["complete"],
                    message: "value must be a boolean",
                    value: null,
                },
            ]);
        });

        it("should create an Category validator from document", () => {
            const validators = parseOpenApiDocument(document);

            expect(validators.Category).toBeDefined();
            expect(
                validators.Category.check({
                    id: 42,
                    name: "cat",
                })
            ).toBe(undefined);
            expect(validators.Category.check(null)).toEqual([
                {
                    key: ["id"],
                    message: "value must be a number",
                    value: null,
                },
                {
                    key: ["id"],
                    message: "value must be an integer",
                    value: null,
                },
                {
                    key: ["name"],
                    message: "value must be a string",
                    value: null,
                },
            ]);
        });

        it("should create an User validator from document", () => {
            const validators = parseOpenApiDocument(document);

            expect(validators.User).toBeDefined();
            expect(
                validators.User.check({
                    id: 42,
                    username: "john",
                    firstName: "john",
                    lastName: "doe",
                    email: "john@gmail.com",
                    password: "secret",
                    phone: "00000000",
                    userStatus: 0,
                })
            ).toBe(undefined);
            expect(validators.User.check(null)).toEqual([
                {
                    key: ["id"],
                    message: "value must be a number",
                    value: null,
                },
                {
                    key: ["id"],
                    message: "value must be an integer",
                    value: null,
                },
                {
                    key: ["username"],
                    message: "value must be a string",
                    value: null,
                },
                {
                    key: ["firstName"],
                    message: "value must be a string",
                    value: null,
                },
                {
                    key: ["lastName"],
                    message: "value must be a string",
                    value: null,
                },
                {
                    key: ["email"],
                    message: "value must be a string",
                    value: null,
                },
                {
                    key: ["password"],
                    message: "value must be a string",
                    value: null,
                },
                {
                    key: ["phone"],
                    message: "value must be a string",
                    value: null,
                },
                {
                    key: ["userStatus"],
                    message: "value must be a number",
                    value: null,
                },
                {
                    key: ["userStatus"],
                    message: "value must be an integer",
                    value: null,
                },
            ]);
        });

        it("should create a Tag validator from document", () => {
            const validators = parseOpenApiDocument(document);

            expect(validators.Tag).toBeDefined();
            expect(
                validators.Tag.check({
                    id: 42,
                    name: "cat",
                })
            ).toBe(undefined);
            expect(validators.Tag.check(null)).toEqual([
                {
                    key: ["id"],
                    message: "value must be a number",
                    value: null,
                },
                {
                    key: ["id"],
                    message: "value must be an integer",
                    value: null,
                },
                {
                    key: ["name"],
                    message: "value must be a string",
                    value: null,
                },
            ]);
        });

        it("should create a Pet validator from document", () => {
            const validators = parseOpenApiDocument(document);

            expect(validators.Pet).toBeDefined();
            expect(
                validators.Pet.check({
                    id: 42,
                    name: "rantanplan",
                    category: { id: 7, name: "dog" },
                    photoUrls: [],
                    tags: [],
                    status: "pending",
                })
            ).toBe(undefined);
            expect(validators.Pet.check(null)).toEqual([
                {
                    key: ["id"],
                    message: "value must be a number",
                    value: null,
                },
                {
                    key: ["id"],
                    message: "value must be an integer",
                    value: null,
                },
                {
                    key: ["category", "id"],
                    message: "value must be a number",
                    value: null,
                },
                {
                    key: ["category", "id"],
                    message: "value must be an integer",
                    value: null,
                },
                {
                    key: ["category", "name"],
                    message: "value must be a string",
                    value: null,
                },
                {
                    key: ["name"],
                    message: "value must be a string",
                    value: null,
                },
                {
                    key: ["photoUrls"],
                    message: "value must be an array",
                    value: null,
                },
                {
                    key: ["tags"],
                    message: "value must be an array",
                    value: null,
                },
                {
                    key: ["status"],
                    message: "value must be a string",
                    value: null,
                },
                {
                    key: ["status"],
                    message:
                        'value must be one of "available", "pending", "sold"',
                    value: null,
                },
            ]);
        });

        it("should create an ApiResponse validator from document", () => {
            const validators = parseOpenApiDocument(document);

            expect(validators.ApiResponse).toBeDefined();
            expect(
                validators.ApiResponse.check({
                    code: 500,
                    type: "Server error",
                    message: "Something went wrong",
                })
            ).toBe(undefined);
            expect(validators.ApiResponse.check(null)).toEqual([
                {
                    key: ["code"],
                    message: "value must be a number",
                    value: null,
                },
                {
                    key: ["code"],
                    message: "value must be an integer",
                    value: null,
                },
                {
                    key: ["type"],
                    message: "value must be a string",
                    value: null,
                },
                {
                    key: ["message"],
                    message: "value must be a string",
                    value: null,
                },
            ]);
        });
    });

    describe("schemaToValidator", () => {
        describe("string type", () => {
            it("should handle string type schema", () => {
                const schema: Schema = {
                    type: "string",
                };

                const validator = schemaToValidator(schema, document);

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

                const validator = schemaToValidator(schema, document);

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

                const validator = schemaToValidator(schema, document);

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

                const validator = schemaToValidator(schema, document);

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

                const validator = schemaToValidator(schema, document);

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

                const validator = schemaToValidator(schema, document);

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

                const validator = schemaToValidator(schema, document);

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

                const validator = schemaToValidator(schema, document);

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

                const validator = schemaToValidator(schema, document);

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

                const validator = schemaToValidator(schema, document);

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
                const validator = schemaToValidator(schema, document);

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
                const validator = schemaToValidator(schema, document);

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
                const validator = schemaToValidator(schema, document);

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
                const validator = schemaToValidator(schema, document);

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
                const validator = schemaToValidator(schema, document);

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
                const validator = schemaToValidator(schema, document);

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
                const validator = schemaToValidator(schema, document);

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
                const validator = schemaToValidator(schema, document);

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
                const validator = schemaToValidator(schema, document);

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
                const validator = schemaToValidator(schema, document);

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

        describe("boolean type", () => {
            it("should handle type boolean schema", () => {
                const schema: Schema = {
                    type: "boolean",
                };
                const validator = schemaToValidator(schema, document);

                expect(validator.check(true)).toBe(undefined);
                expect(validator.check(false)).toBe(undefined);
                expect(validator.check("false")).toEqual([
                    { message: "value must be a boolean", value: "false" },
                ]);
                expect(validator.check(0)).toEqual([
                    { message: "value must be a boolean", value: 0 },
                ]);
            });
        });

        describe("array type", () => {
            it("should handle type array schema", () => {
                const schema: Schema = {
                    type: "array",
                    items: {
                        type: "string",
                    },
                };

                const validator = schemaToValidator(schema, document);

                expect(validator.check([])).toBe(undefined);
                expect(validator.check(["foo", "bar"])).toBe(undefined);
                expect(validator.check(["foo", "bar", 7])).toEqual([
                    { key: [2], message: "value must be a string", value: 7 },
                ]);
            });
        });

        describe("object type", () => {
            it("should handle type array schema", () => {
                const schema: Schema = {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer",
                        },
                        username: {
                            type: "string",
                        },
                        email: {
                            type: "string",
                            pattern: "@.*?\\.",
                        },
                        password: {
                            type: "string",
                            minLength: 7,
                        },
                        sex: {
                            type: "string",
                            enum: ["M", "F", "N"],
                        },
                    },
                };

                const validator = schemaToValidator(schema, document);

                expect(
                    validator.check({
                        id: 42,
                        username: "john",
                        email: "john@gmail.com",
                        password: "47874fd5sq4f5z7fr",
                        sex: "M",
                    })
                ).toBe(undefined);

                expect(
                    validator.check({
                        id: 42,
                        username: "john",
                        email: "john@gmail.com",
                        password: "secret",
                        sex: "M",
                    })
                ).toEqual([
                    {
                        key: ["password"],
                        message: "value must be at least 7 characters long",
                        value: "secret",
                    },
                ]);
                expect(validator.check("john")).toEqual([
                    { message: "value must be an object", value: "john" },
                    {
                        key: ["id"],
                        message: "value must be a number",
                        value: undefined,
                    },
                    {
                        key: ["id"],
                        message: "value must be an integer",
                        value: undefined,
                    },
                    {
                        key: ["username"],
                        message: "value must be a string",
                        value: undefined,
                    },
                    {
                        key: ["email"],
                        message: "value must be a string",
                        value: undefined,
                    },
                    {
                        key: ["email"],
                        message: "value must match pattern /@.*?\\./",
                        value: undefined,
                    },
                    {
                        key: ["password"],
                        message: "value must be a string",
                        value: undefined,
                    },
                    {
                        key: ["password"],
                        message: "value must be at least 7 characters long",
                        value: undefined,
                    },
                    {
                        key: ["sex"],
                        message: "value must be a string",
                        value: undefined,
                    },
                    {
                        key: ["sex"],
                        message: 'value must be one of "M", "F", "N"',
                        value: undefined,
                    },
                ]);
            });
        });

        describe("allof schema", () => {
            it("should handle schema with allOf prop", () => {
                const schema: Schema = {
                    allOf: [
                        {
                            type: "object",
                            properties: {
                                id: {
                                    type: "string",
                                },
                            },
                        },
                        {
                            type: "object",
                            properties: {
                                name: {
                                    type: "string",
                                },
                            },
                        },
                    ],
                };

                const validator = schemaToValidator(schema, document);

                expect(validator.check(null)).toEqual([
                    {
                        key: ["id"],
                        message: "value must be a string",
                        value: null,
                    },
                    {
                        key: ["name"],
                        message: "value must be a string",
                        value: null,
                    },
                ]);
            });
        });

        describe("anyof schema", () => {
            it("should handle schema with anyOf prop", () => {
                const schema: Schema = {
                    anyOf: [
                        {
                            type: "object",
                            properties: {
                                id: {
                                    type: "string",
                                },
                            },
                        },
                        {
                            type: "object",
                            properties: {
                                name: {
                                    type: "string",
                                },
                            },
                        },
                    ],
                };

                const validator = schemaToValidator(schema, document);

                expect(validator.check(null)).toEqual([
                    {
                        message: "value must pass at least one validation",
                        value: null,
                    },
                    {
                        key: ["id"],
                        message: "value must be a string",
                        value: null,
                    },
                    {
                        key: ["name"],
                        message: "value must be a string",
                        value: null,
                    },
                ]);

                expect(validator.check({ id: "id" })).toBe(undefined);
                expect(validator.check({ name: "name" })).toBe(undefined);
                expect(validator.check({ id: "id", name: "name" })).toBe(
                    undefined
                );
            });
        });
    });
});
