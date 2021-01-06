import * as SwaggerParser from "@apidevtools/swagger-parser";

export const getOpenApiSchemas = async (path: String) => {
    const schema = await SwaggerParser.parse(path);
    return schema.components.schemas;
};
