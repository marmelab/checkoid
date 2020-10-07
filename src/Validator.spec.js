const { validator, asyncValidator } = require("./Validator");
const { match } = require("./validators/string");

const isEmpty = validator((value) => {
    if (!!value) {
        return `value is optional`;
    }
});
const isEmail = match(/@/).format(() => `value must be an email`);
const isPresent = validator((value) => {
    if (!!value) {
        return;
    }
    return `value must be present`;
});

describe("Validator", () => {
    describe("validator", () => {
        it("should allow to run validator returning Validation", () => {
            const validate = validator((value) => {
                if (/@/.test(value)) {
                    return;
                }
                return `value must be an email`;
            });

            const validValidation = validate.check("some@email.com");
            expect(validValidation).toBeUndefined();

            const invalidValidation = validate.check(
                "I will type whatever I want"
            );
            expect(invalidValidation).toEqual([
                {
                    message: "value must be an email",
                    value: "I will type whatever I want",
                },
            ]);
        });

        it("should allow to combine validator with and", () => {
            const validValidation = isPresent
                .and(isEmail)
                .check("some@email.com");
            expect(validValidation).toBeUndefined();

            const noValueValidation = isPresent.and(isEmail).check("");
            expect(noValueValidation).toEqual([
                { message: "value must be present", value: "" },
                { message: "value must be an email", value: "" },
            ]);

            const invalidEmailValidation = isPresent
                .and(isEmail)
                .check("whatever");
            expect(invalidEmailValidation).toEqual([
                { message: "value must be an email", value: "whatever" },
            ]);
        });

        it("should allow to combine validator with or", () => {
            const emailValidation = isEmail.or(isEmpty).check("some@email.com");
            expect(emailValidation).toBeUndefined();

            const noValueValidation = isEmail.or(isEmpty).check("");
            expect(noValueValidation).toBeUndefined();

            const invalidEmailValidation = isEmail
                .or(isEmpty)
                .check("whatever");
            expect(invalidEmailValidation).toEqual([
                { message: "value must be an email", value: "whatever" },
                { message: "value is optional", value: "whatever" },
            ]);
        });
    });

    describe("asyncValidator", () => {
        const isPresentInDb = asyncValidator(async (id) => {
            await new Promise((resolve) => {
                setTimeout(resolve, 1);
            });
            if (id === "404") {
                return `user does not exists`;
            }
        });
        it("should support async validator function", async () => {
            const validValidation = await isPresentInDb.check("200");
            expect(validValidation).toBeUndefined();

            const invalidValidation = await isPresent
                .and(isPresentInDb)
                .check("404");
            expect(invalidValidation).toEqual([
                { message: "user does not exists", value: "404" },
            ]);

            const invalidValidation2 = await isPresent
                .and(isPresentInDb)
                .check("");
            expect(invalidValidation2).toEqual([
                { message: "value must be present", value: "" },
            ]);
        });

        it("should return a Validator.Async when concatenated with a Validator.sync", async () => {
            const andValidator = isPresentInDb.and(isPresent);

            const andPromise = andValidator.check("404");

            expect(andPromise.then).toBeDefined();
            expect(await andPromise).toEqual([
                { message: "user does not exists", value: "404" },
            ]);

            const orValidator = isPresentInDb.or(isEmpty);

            const orPromise = orValidator.check("404");

            expect(orPromise.then).toBeDefined();
            expect(await orPromise).toEqual([
                { message: "user does not exists", value: "404" },
                { message: "value is optional", value: "404" },
            ]);
        });

        it("should return a Validator.Async when concatenated to a Validator.sync", async () => {
            const andValidator = isPresent.and(isPresentInDb);

            const andPromise = andValidator.check("404");

            expect(andPromise.then).toBeDefined();
            expect(await andPromise).toEqual([
                { message: "user does not exists", value: "404" },
            ]);

            const orValidator = isEmpty.or(isPresentInDb);

            const orPromise = orValidator.check("404");

            expect(orPromise.then).toBeDefined();
            expect(await orPromise).toEqual([
                { message: "value is optional", value: "404" },
                { message: "user does not exists", value: "404" },
            ]);
        });
    });
});
