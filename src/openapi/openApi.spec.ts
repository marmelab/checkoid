import { resolve } from "path";
import { getOpenApiSchemas } from "./openapi";

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
    describe("getOpenApiSchemas", () => {
        it("should open and parse openApiSchema json extracting components Schema", async () => {
            expect(
                await getOpenApiSchemas(
                    resolve(__dirname, "./openapiSchema.json")
                )
            ).toEqual(schemas);
        });
        it("should open and parse openApiSchema yml extracting components Schema", async () => {
            expect(
                await getOpenApiSchemas(
                    resolve(__dirname, "./openapiSchema.yml")
                )
            ).toEqual(schemas);
        });
    });
});
