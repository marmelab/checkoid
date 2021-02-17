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
            expect(
                validators.Order.check({
                    id: "unique",
                    petId: "this one",
                    quantity: "a lot",
                    shipDate: "As soon as possible",
                    status: "hurry",
                    complete: "now",
                })
            ).toEqual([
                {
                    inverted: false,
                    key: ["id"],
                    predicate: "value is a number",
                    valid: false,
                    value: "unique",
                },
                {
                    inverted: false,
                    key: ["id"],
                    predicate: "value is an integer",
                    valid: false,
                    value: "unique",
                },
                {
                    inverted: false,
                    key: ["id"],
                    predicate: "value is null",
                    valid: false,
                    value: "unique",
                },
                {
                    inverted: false,
                    key: ["petId"],
                    predicate: "value is a number",
                    valid: false,
                    value: "this one",
                },
                {
                    inverted: false,
                    key: ["petId"],
                    predicate: "value is an integer",
                    valid: false,
                    value: "this one",
                },
                {
                    inverted: false,
                    key: ["petId"],
                    predicate: "value is null",
                    valid: false,
                    value: "this one",
                },
                {
                    inverted: false,
                    key: ["quantity"],
                    predicate: "value is a number",
                    valid: false,
                    value: "a lot",
                },
                {
                    inverted: false,
                    key: ["quantity"],
                    predicate: "value is an integer",
                    valid: false,
                    value: "a lot",
                },
                {
                    inverted: false,
                    key: ["quantity"],
                    predicate: "value is null",
                    valid: false,
                    value: "a lot",
                },
                {
                    inverted: false,
                    key: ["shipDate"],
                    predicate:
                        "value is a valid date-time string (yyyy-MM-ddThh:mm:ssZ)",
                    valid: false,
                    value: "As soon as possible",
                },
                {
                    inverted: false,
                    key: ["shipDate"],
                    predicate: "value is null",
                    valid: false,
                    value: "As soon as possible",
                },
                {
                    inverted: false,
                    key: ["status"],
                    predicate:
                        'value is one of "placed", "approved", "delivered"',
                    valid: false,
                    value: "hurry",
                },
                {
                    inverted: false,
                    key: ["status"],
                    predicate: "value is null",
                    valid: false,
                    value: "hurry",
                },
                {
                    inverted: false,
                    key: ["complete"],
                    predicate: "value is a boolean",
                    valid: false,
                    value: "now",
                },
                {
                    inverted: false,
                    key: ["complete"],
                    predicate: "value is null",
                    valid: false,
                    value: "now",
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
            expect(validators.Category.check({ id: "id", name: 42 })).toEqual([
                {
                    inverted: false,
                    key: ["id"],
                    predicate: "value is a number",
                    valid: false,
                    value: "id",
                },
                {
                    inverted: false,
                    key: ["id"],
                    predicate: "value is an integer",
                    valid: false,
                    value: "id",
                },
                {
                    inverted: false,
                    key: ["id"],
                    predicate: "value is null",
                    valid: false,
                    value: "id",
                },
                {
                    inverted: false,
                    key: ["name"],
                    predicate: "value is a string",
                    valid: false,
                    value: 42,
                },
                {
                    inverted: false,
                    key: ["name"],
                    predicate: "value is null",
                    valid: false,
                    value: 42,
                },
            ]);
            expect(validators.Category.check(null)).toEqual([
                {
                    predicate: "value is an object",
                    valid: false,
                    inverted: false,
                    value: null,
                },
            ]);
            expect(validators.Category.check({})).toEqual(undefined);
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
                    predicate: "value is an object",
                    valid: false,
                    inverted: false,
                    value: null,
                },
                {
                    key: ["id"],
                    predicate: "value is a number",
                    valid: false,
                    inverted: false,
                    value: null,
                },
                {
                    key: ["id"],
                    predicate: "value is an integer",
                    valid: false,
                    inverted: false,
                    value: null,
                },
                {
                    key: ["username"],
                    predicate: "value is a string",
                    valid: false,
                    inverted: false,
                    value: null,
                },
                {
                    key: ["firstName"],
                    predicate: "value is a string",
                    valid: false,
                    inverted: false,
                    value: null,
                },
                {
                    key: ["lastName"],
                    predicate: "value is a string",
                    valid: false,
                    inverted: false,
                    value: null,
                },
                {
                    key: ["email"],
                    predicate: "value is a string",
                    valid: false,
                    inverted: false,
                    value: null,
                },
                {
                    key: ["password"],
                    predicate: "value is a string",
                    valid: false,
                    inverted: false,
                    value: null,
                },
                {
                    key: ["userStatus"],
                    predicate: "value is a number",
                    valid: false,
                    inverted: false,
                    value: null,
                },
                {
                    key: ["userStatus"],
                    predicate: "value is an integer",
                    valid: false,
                    inverted: false,
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
                    inverted: false,
                    predicate: "value is an object",
                    valid: false,
                    value: null,
                },
                {
                    key: ["id"],
                    predicate: "value is a number",
                    valid: false,
                    inverted: false,
                    value: null,
                },
                {
                    key: ["id"],
                    predicate: "value is an integer",
                    valid: false,
                    inverted: false,
                    value: null,
                },
                {
                    key: ["name"],
                    predicate: "value is a string",
                    valid: false,
                    inverted: false,
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
                    inverted: false,
                    predicate: "value is an object",
                    valid: false,
                    value: null,
                },
                {
                    inverted: false,
                    key: ["name"],
                    predicate: "value is a string",
                    valid: false,
                    value: null,
                },
                {
                    inverted: false,
                    key: ["photoUrls"],
                    predicate: "value is an array",
                    valid: false,
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
            expect(validators.ApiResponse.check({ foo: "bar" })).toEqual([
                {
                    inverted: false,
                    predicate:
                        "value accept only the following keys: code,type,message",
                    valid: false,
                    value: {
                        foo: "bar",
                    },
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
                    {
                        predicate: "value is a string",
                        valid: false,
                        inverted: false,
                        value: 45,
                    },
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
                        predicate:
                            "value is a valid date-time string (yyyy-MM-ddThh:mm:ssZ)",
                        valid: false,
                        inverted: false,
                        value: "A simple string",
                    },
                ]);
                expect(validator.check(45)).toEqual([
                    {
                        predicate: "value is a string",
                        valid: false,
                        inverted: false,
                        value: 45,
                    },
                    {
                        predicate:
                            "value is a valid date-time string (yyyy-MM-ddThh:mm:ssZ)",

                        valid: false,
                        inverted: false,
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
                        predicate: "value is a valid date string (yyyy-MM-dd)",
                        valid: false,
                        inverted: false,
                        value: "A simple string",
                    },
                ]);
                expect(validator.check(45)).toEqual([
                    {
                        predicate: "value is a string",
                        valid: false,
                        inverted: false,
                        value: 45,
                    },
                    {
                        predicate: "value is a valid date string (yyyy-MM-dd)",
                        valid: false,
                        inverted: false,
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
                        predicate: "value is a valid binary string",
                        valid: false,
                        inverted: false,
                        value: "A simple string",
                    },
                ]);
                expect(validator.check(45)).toEqual([
                    {
                        predicate: "value is a string",
                        valid: false,
                        inverted: false,
                        value: 45,
                    },
                    {
                        predicate: "value is a valid binary string",
                        valid: false,
                        inverted: false,
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
                        predicate: "value is a valid base64 string",
                        valid: false,
                        inverted: false,
                        value: "A simple string",
                    },
                ]);
                expect(validator.check(45)).toEqual([
                    {
                        predicate: "value is a string",
                        valid: false,
                        inverted: false,
                        value: 45,
                    },
                    {
                        predicate: "value is a valid base64 string",
                        valid: false,
                        inverted: false,
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
                        predicate: 'value is one of "one", "two", "three"',
                        valid: false,
                        inverted: false,
                        value: "four",
                    },
                ]);
                expect(validator.check(45)).toEqual([
                    {
                        predicate: "value is a string",
                        valid: false,
                        inverted: false,
                        value: 45,
                    },
                    {
                        predicate: 'value is one of "one", "two", "three"',
                        valid: false,
                        inverted: false,
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
                        predicate: "value match pattern /@.*?\\./",
                        valid: false,
                        inverted: false,
                        value: "A simple string",
                    },
                ]);
                expect(validator.check(45)).toEqual([
                    {
                        predicate: "value is a string",
                        valid: false,
                        inverted: false,
                        value: 45,
                    },
                    {
                        predicate: "value match pattern /@.*?\\./",
                        valid: false,
                        inverted: false,
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
                        predicate: "value is at least 20 characters long",
                        valid: false,
                        inverted: false,
                        value: "A too small string",
                    },
                ]);
                expect(validator.check(45)).toEqual([
                    {
                        predicate: "value is a string",
                        valid: false,
                        inverted: false,
                        value: 45,
                    },
                    {
                        predicate: "value is at least 20 characters long",
                        valid: false,
                        inverted: false,
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
                        predicate: "value is at most 50 characters long",
                        valid: false,
                        inverted: false,
                        value:
                            "A string that is way too long. Seriously, what did you expect ?",
                    },
                ]);
                expect(validator.check(45)).toEqual([
                    {
                        predicate: "value is a string",
                        valid: false,
                        inverted: false,
                        value: 45,
                    },
                    {
                        predicate: "value is at most 50 characters long",
                        valid: false,
                        inverted: false,
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
                    {
                        predicate: "value is a string",
                        valid: false,
                        inverted: false,
                        value: 45,
                    },
                    {
                        predicate: "value is a valid binary string",
                        valid: false,
                        inverted: false,
                        value: 45,
                    },
                    {
                        predicate: 'value is one of "0001", "00010", "00011"',
                        valid: false,
                        inverted: false,
                        value: 45,
                    },
                    {
                        predicate: "value match pattern /^000/",
                        valid: false,
                        inverted: false,
                        value: 45,
                    },
                    {
                        predicate: "value is at least 3 characters long",
                        valid: false,
                        inverted: false,
                        value: 45,
                    },
                    {
                        predicate: "value is at most 5 characters long",
                        valid: false,
                        inverted: false,
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
                    {
                        predicate: "value is a number",
                        valid: false,
                        inverted: false,
                        value: "A string",
                    },
                ]);
                expect(validator.check("42")).toEqual([
                    {
                        predicate: "value is a number",
                        valid: false,
                        inverted: false,
                        value: "42",
                    },
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
                    {
                        predicate: "value is at least 10",
                        valid: false,
                        inverted: false,
                        value: 7.5,
                    },
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
                    {
                        predicate: "value is greater than 10",
                        valid: false,
                        inverted: false,
                        value: 10,
                    },
                ]);
                expect(validator.check(7.5)).toEqual([
                    {
                        predicate: "value is greater than 10",
                        valid: false,
                        inverted: false,
                        value: 7.5,
                    },
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
                    {
                        predicate: "value is at most 100",
                        valid: false,
                        inverted: false,
                        value: 101.5,
                    },
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
                    {
                        predicate: "value is less than 100",
                        valid: false,
                        inverted: false,
                        value: 100,
                    },
                ]);
                expect(validator.check(101.5)).toEqual([
                    {
                        predicate: "value is less than 100",
                        valid: false,
                        inverted: false,
                        value: 101.5,
                    },
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
                    {
                        predicate: "value is an integer",
                        valid: false,
                        inverted: false,
                        value: 42.5,
                    },
                ]);
                expect(validator.check("A string")).toEqual([
                    {
                        predicate: "value is a number",
                        valid: false,
                        inverted: false,
                        value: "A string",
                    },
                    {
                        predicate: "value is an integer",
                        valid: false,
                        inverted: false,
                        value: "A string",
                    },
                ]);
                expect(validator.check("42")).toEqual([
                    {
                        predicate: "value is a number",
                        valid: false,
                        inverted: false,
                        value: "42",
                    },
                    {
                        predicate: "value is an integer",
                        valid: false,
                        inverted: false,
                        value: "42",
                    },
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
                    {
                        predicate: "value is an integer",
                        valid: false,
                        inverted: false,
                        value: 7.5,
                    },
                    {
                        predicate: "value is at least 10",
                        valid: false,
                        inverted: false,
                        value: 7.5,
                    },
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
                    {
                        predicate: "value is greater than 10",
                        valid: false,
                        inverted: false,
                        value: 10,
                    },
                ]);
                expect(validator.check(7.5)).toEqual([
                    {
                        predicate: "value is an integer",
                        valid: false,
                        inverted: false,
                        value: 7.5,
                    },
                    {
                        predicate: "value is greater than 10",
                        valid: false,
                        inverted: false,
                        value: 7.5,
                    },
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
                    {
                        predicate: "value is an integer",
                        valid: false,
                        inverted: false,
                        value: 101.5,
                    },
                    {
                        predicate: "value is at most 100",
                        valid: false,
                        inverted: false,
                        value: 101.5,
                    },
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
                    {
                        predicate: "value is less than 100",
                        valid: false,
                        inverted: false,
                        value: 100,
                    },
                ]);
                expect(validator.check(101.5)).toEqual([
                    {
                        predicate: "value is an integer",
                        valid: false,
                        inverted: false,
                        value: 101.5,
                    },
                    {
                        predicate: "value is less than 100",
                        valid: false,
                        inverted: false,
                        value: 101.5,
                    },
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
                    {
                        predicate: "value is a boolean",
                        valid: false,
                        inverted: false,
                        value: "false",
                    },
                ]);
                expect(validator.check(0)).toEqual([
                    {
                        predicate: "value is a boolean",
                        valid: false,
                        inverted: false,
                        value: 0,
                    },
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
                    {
                        key: [2],
                        predicate: "value is a string",
                        valid: false,
                        inverted: false,
                        value: 7,
                    },
                ]);
            });

            it("should check uniqueness if uniqueItems is set to true", () => {
                const schema: Schema = {
                    type: "array",
                    uniqueItems: true,
                    items: {
                        type: "string",
                    },
                };

                const validator = schemaToValidator(schema, document);

                expect(validator.check([])).toBe(undefined);
                expect(validator.check(["foo", "bar"])).toBe(undefined);
                expect(validator.check(["foo", "bar", "foo"])).toEqual([
                    {
                        predicate: "value items are unique",
                        valid: false,
                        inverted: false,
                        value: ["foo", "bar", "foo"],
                    },
                ]);
            });

            it("should check uniqueness should work with object too", () => {
                const schema: Schema = {
                    type: "array",
                    uniqueItems: true,
                    items: {
                        type: "object",
                    },
                };

                const validator = schemaToValidator(schema, document);

                expect(validator.check([])).toBe(undefined);
                expect(
                    validator.check([{ value: "foo" }, { value: "bar" }])
                ).toBe(undefined);
                expect(
                    validator.check([
                        { value: "foo" },
                        { value: "bar" },
                        { value: "foo" },
                    ])
                ).toEqual([
                    {
                        predicate: "value items are unique",
                        valid: false,
                        inverted: false,
                        value: [
                            { value: "foo" },
                            { value: "bar" },
                            { value: "foo" },
                        ],
                    },
                ]);
            });
        });

        describe("object type", () => {
            it("should handle type object schema", () => {
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
                        predicate: "value is at least 7 characters long",
                        valid: false,
                        inverted: false,
                        value: "secret",
                    },
                    {
                        key: ["password"],
                        predicate: "value is null",
                        valid: false,
                        inverted: false,
                        value: "secret",
                    },
                ]);
                expect(validator.check("john")).toEqual([
                    {
                        predicate: "value is an object",
                        valid: false,
                        inverted: false,
                        value: "john",
                    },
                ]);
            });

            it("should handle type object schema with required props", () => {
                const schema: Schema = {
                    type: "object",
                    required: [],
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
                        predicate: "value is at least 7 characters long",
                        valid: false,
                        inverted: false,
                        value: "secret",
                    },
                    {
                        inverted: false,
                        predicate: "value is null",
                        valid: false,
                        key: ["password"],
                        value: "secret",
                    },
                ]);

                expect(validator.check("john")).toEqual([
                    {
                        predicate: "value is an object",
                        valid: false,
                        value: "john",
                        inverted: false,
                    },
                ]);
            });

            it("should handle type object schema with additionalProperties props", () => {
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
                    additionalProperties: { type: "string" },
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
                        password: "47874fd5sq4f5z7fr",
                        sex: "M",
                        foo: "bar",
                    })
                ).toBe(undefined);

                expect(
                    validator.check({
                        id: 42,
                        username: "john",
                        email: "john@gmail.com",
                        password: "47874fd5sq4f5z7fr",
                        sex: "M",
                        foo: 42,
                    })
                ).toEqual([
                    {
                        inverted: false,
                        key: ["foo"],
                        predicate: "value is a string",
                        valid: false,
                        value: 42,
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
                            required: ["id"],
                        },
                        {
                            type: "object",
                            properties: {
                                name: {
                                    type: "string",
                                },
                            },
                            required: ["name"],
                        },
                    ],
                };

                const validator = schemaToValidator(schema, document);

                expect(validator.check(null)).toEqual([
                    {
                        inverted: false,
                        predicate: "value is an object",
                        valid: false,
                        value: null,
                    },
                    {
                        key: ["id"],
                        predicate: "value is a string",
                        valid: false,
                        inverted: false,
                        value: null,
                    },
                    {
                        inverted: false,
                        predicate: "value is an object",
                        valid: false,
                        value: null,
                    },
                    {
                        key: ["name"],
                        predicate: "value is a string",
                        valid: false,
                        inverted: false,
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
                            type: "string",
                            pattern: "foo",
                        },
                        {
                            type: "string",
                            pattern: "bar",
                        },
                    ],
                };

                const validator = schemaToValidator(schema, document);

                expect(validator.check(null)).toEqual([
                    {
                        predicate: "value pass at least one validation",
                        valid: false,
                        inverted: false,
                        value: null,
                    },
                    {
                        predicate: "value is a string",
                        valid: false,
                        inverted: false,
                        value: null,
                    },
                    {
                        predicate: "value match pattern /foo/",
                        valid: false,
                        inverted: false,
                        value: null,
                    },
                    {
                        predicate: "value is a string",
                        valid: false,
                        inverted: false,
                        value: null,
                    },
                    {
                        predicate: "value match pattern /bar/",
                        valid: false,
                        inverted: false,
                        value: null,
                    },
                ]);

                expect(validator.check("a string")).toEqual([
                    {
                        predicate: "value pass at least one validation",
                        valid: false,
                        inverted: false,
                        value: "a string",
                    },
                    {
                        predicate: "value match pattern /foo/",
                        valid: false,
                        inverted: false,
                        value: "a string",
                    },
                    {
                        predicate: "value match pattern /bar/",
                        valid: false,
                        inverted: false,
                        value: "a string",
                    },
                ]);

                expect(validator.check("foo")).toBe(undefined);
                expect(validator.check("bar")).toBe(undefined);
                expect(validator.check("foobar")).toBe(undefined);
            });
        });

        describe("oneof schema", () => {
            it("should handle schema with oneOf prop", () => {
                const schema: Schema = {
                    oneOf: [
                        {
                            type: "string",
                            pattern: "foo",
                        },
                        {
                            type: "string",
                            pattern: "bar",
                        },
                    ],
                };

                const validator = schemaToValidator(schema, document);

                expect(validator.check(null)).toEqual([
                    {
                        predicate: "value pass only one validation",
                        valid: false,
                        inverted: false,
                        value: null,
                    },
                    {
                        predicate: "value is a string",
                        valid: false,
                        inverted: false,
                        value: null,
                    },
                    {
                        predicate: "value match pattern /foo/",
                        valid: false,
                        inverted: false,
                        value: null,
                    },
                    {
                        predicate: "value is a string",
                        valid: false,
                        inverted: false,
                        value: null,
                    },
                    {
                        predicate: "value match pattern /bar/",
                        valid: false,
                        inverted: false,
                        value: null,
                    },
                ]);

                expect(validator.check("a string")).toEqual([
                    {
                        predicate: "value pass only one validation",
                        valid: false,
                        inverted: false,
                        value: "a string",
                    },
                    {
                        predicate: "value match pattern /foo/",
                        valid: false,
                        inverted: false,
                        value: "a string",
                    },
                    {
                        predicate: "value match pattern /bar/",
                        valid: false,
                        inverted: false,
                        value: "a string",
                    },
                ]);

                expect(validator.check("foo")).toBe(undefined);
                expect(validator.check("bar")).toBe(undefined);
                expect(validator.check("foobar")).toEqual([
                    {
                        predicate: "value pass only one validation",
                        valid: false,
                        inverted: false,
                        value: "foobar",
                    },
                    {
                        predicate: "value is a string",
                        valid: true,
                        inverted: true,
                        value: "foobar",
                    },
                    {
                        predicate: "value match pattern /foo/",
                        valid: true,
                        inverted: true,
                        value: "foobar",
                    },
                    {
                        predicate: "value is a string",
                        valid: true,
                        inverted: true,
                        value: "foobar",
                    },
                    {
                        predicate: "value match pattern /bar/",
                        valid: true,
                        inverted: true,
                        value: "foobar",
                    },
                ]);
            });
        });

        describe("not schema", () => {
            it("should handle schema with not prop", () => {
                const schema: Schema = {
                    not: {
                        type: "string",
                    },
                };

                const validator = schemaToValidator(schema, document);

                expect(validator.check(null)).toBeUndefined();
                expect(validator.check(42)).toBeUndefined();

                expect(validator.check("a string")).toEqual([
                    {
                        predicate: "value is a string",
                        valid: true,
                        inverted: true,
                        value: "a string",
                    },
                ]);
            });
        });
    });
});
