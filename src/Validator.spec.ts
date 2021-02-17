import { validator, asyncValidator } from "./Validator";
import { match } from "./validators/string";

const isEmpty = validator((value) => {
    return !value ? true : false;
}, "value is optional");
const isEmail = match(/@/).format(() => `value is an email`);
const isPresent = validator((value) => {
    return !!value;
}, "value is present");

describe("Validator", () => {
    describe("validator", () => {
        it("should allow to run validator returning Validation", () => {
            const validate = validator((value) => {
                return /@/.test(value);
            }, "value is an email");

            const validValidation = validate.check("some@email.com");
            expect(validValidation).toBeUndefined();

            const invalidValidation = validate.check(
                "I will type whatever I want"
            );
            expect(invalidValidation).toEqual([
                {
                    predicate: "value is an email",
                    valid: false,
                    value: "I will type whatever I want",
                    inverted: false,
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
                {
                    predicate: "value is present",
                    valid: false,
                    value: "",
                    inverted: false,
                },
                {
                    predicate: "value is an email",
                    valid: false,
                    value: "",
                    inverted: false,
                },
            ]);

            const invalidEmailValidation = isPresent
                .and(isEmail)
                .check("whatever");
            expect(invalidEmailValidation).toEqual([
                {
                    predicate: "value is an email",
                    valid: false,
                    value: "whatever",
                    inverted: false,
                },
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
                {
                    predicate: "value is an email",
                    valid: false,
                    value: "whatever",
                    inverted: false,
                },
                {
                    predicate: "value is optional",
                    valid: false,
                    value: "whatever",
                    inverted: false,
                },
            ]);
        });
    });

    describe("asyncValidator", () => {
        const isPresentInDb = asyncValidator(async (id) => {
            await new Promise((resolve) => {
                setTimeout(resolve, 1);
            });
            return id !== "404";
        }, `user does not exists`);
        it("should support async validator function", async () => {
            const validValidation = await isPresentInDb.check("200");
            expect(validValidation).toBeUndefined();

            const invalidValidation = await isPresent
                .and(isPresentInDb)
                .check("404");
            expect(invalidValidation).toEqual([
                {
                    predicate: "user does not exists",
                    valid: false,
                    value: "404",
                    inverted: false,
                },
            ]);

            const invalidValidation2 = await isPresent
                .and(isPresentInDb)
                .check("");
            expect(invalidValidation2).toEqual([
                {
                    predicate: "value is present",
                    valid: false,
                    value: "",
                    inverted: false,
                },
            ]);
        });

        it("should return a Validator.Async when concatenated with a Validator.sync", async () => {
            const andValidator = isPresentInDb.and(isPresent);

            const andPromise = andValidator.check("404");

            expect(andPromise.then).toBeDefined();
            expect(await andPromise).toEqual([
                {
                    predicate: "user does not exists",
                    valid: false,
                    value: "404",
                    inverted: false,
                },
            ]);

            const orValidator = isPresentInDb.or(isEmpty);

            const orPromise = orValidator.check("404");

            expect(orPromise.then).toBeDefined();
            expect(await orPromise).toEqual([
                {
                    predicate: "user does not exists",
                    valid: false,
                    value: "404",
                    inverted: false,
                },
                {
                    predicate: "value is optional",
                    valid: false,
                    value: "404",
                    inverted: false,
                },
            ]);
        });

        it("should return a Validator.Async when concatenated to a Validator.sync", async () => {
            const andValidator = isPresent.and(isPresentInDb);

            const andPromise = andValidator.check("404");

            expect(andPromise.then).toBeDefined();
            expect(await andPromise).toEqual([
                {
                    predicate: "user does not exists",
                    valid: false,
                    value: "404",
                    inverted: false,
                },
            ]);

            const orValidator = isEmpty.or(isPresentInDb);

            const orPromise = orValidator.check("404");

            expect(orPromise.then).toBeDefined();
            expect(await orPromise).toEqual([
                {
                    predicate: "value is optional",
                    valid: false,
                    value: "404",
                    inverted: false,
                },
                {
                    predicate: "user does not exists",
                    valid: false,
                    value: "404",
                    inverted: false,
                },
            ]);
        });
    });
});
