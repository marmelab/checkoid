const { validator, asyncValidator } = require("./Validator");
const { match } = require("./validators/string");

const isEmpty = validator((value) => {
    if (!!value) {
        return `value is optional`;
    }
});
const isEmail = match(/@/, `value must be an email`);
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
            expect(invalidValidation).toEqual(["value must be an email"]);
        });

        it("should allow to combine validator with and", () => {
            const validValidation = isPresent
                .and(isEmail)
                .check("some@email.com");
            expect(validValidation).toBeUndefined();

            const noValueValidation = isPresent.and(isEmail).check("");
            expect(noValueValidation).toEqual([
                "value must be present",
                "value must be an email",
            ]);

            const invalidEmailValidation = isPresent
                .and(isEmail)
                .check("whatever");
            expect(invalidEmailValidation).toEqual(["value must be an email"]);
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
                "value must be an email",
                "value is optional",
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
            expect(invalidValidation).toEqual(["user does not exists"]);

            const invalidValidation2 = await isPresent
                .and(isPresentInDb)
                .check("");
            expect(invalidValidation2).toEqual(["value must be present"]);
        });

        it("should return a Validator.Async when concatenated with a Validator.sync", async () => {
            const andValidator = isPresentInDb.and(isPresent);

            const andPromise = andValidator.check("404");

            expect(andPromise.then).toBeDefined();
            expect(await andPromise).toEqual(["user does not exists"]);

            const orValidator = isPresentInDb.or(isEmpty);

            const orPromise = orValidator.check("404");

            expect(orPromise.then).toBeDefined();
            expect(await orPromise).toEqual([
                "user does not exists",
                "value is optional",
            ]);
        });

        it("should return a Validator.Async when concatenated to a Validator.sync", async () => {
            const andValidator = isPresent.and(isPresentInDb);

            const andPromise = andValidator.check("404");

            expect(andPromise.then).toBeDefined();
            expect(await andPromise).toEqual(["user does not exists"]);

            const orValidator = isEmpty.or(isPresentInDb);

            const orPromise = orValidator.check("404");

            expect(orPromise.then).toBeDefined();
            expect(await orPromise).toEqual([
                "value is optional",
                "user does not exists",
            ]);
        });
    });
});
