const { validator } = require("./Validator");
const Validation = require("./Validation");

const isAbsent = validator((value, key) => {
    if (!!value) {
        return Validation.Invalid([`${key} can be absent`]);
    }
    return Validation.Valid(value);
});
const isEmail = validator((value, key) => {
    if (/@/.test(value)) {
        return Validation.Valid(value);
    }
    return Validation.Invalid([`${key} must be an email`]);
});
const isPresent = validator((value, key) => {
    if (!!value) {
        return Validation.Valid(value);
    }
    return Validation.Invalid([`${key} must be present`]);
});

describe("Validator", () => {
    it("should allow to run validator returning Validation", async () => {
        const validate = validator((value, key) => {
            if (/@/.test(value)) {
                return Validation.Valid(value);
            }
            return Validation.Invalid([`${key} must be an email`]);
        });

        const validValidation = await validate.check("some@email.com", "email");
        expect(validValidation.x).toBe("some@email.com");

        const invalidValidation = await validate.check(
            "I will type whatever I want",
            "email"
        );
        expect(invalidValidation.x).toEqual(["email must be an email"]);
    });

    it("should allow to combine validator with and", async () => {
        const validValidation = await isPresent
            .and(isEmail)
            .check("some@email.com", "email");
        expect(validValidation.x).toBe("some@email.com");

        const noValueValidation = await isPresent
            .and(isEmail)
            .check("", "email");
        expect(noValueValidation.x).toEqual([
            "email must be present",
            "email must be an email",
        ]);

        const invalidEmailValidation = await isPresent
            .and(isEmail)
            .check("whatever", "email");
        expect(invalidEmailValidation.x).toEqual(["email must be an email"]);
    });

    it("should allow to combine validator with or", async () => {
        const emailValidation = await isEmail
            .or(isAbsent)
            .check("some@email.com", "email");
        expect(emailValidation.x).toBe("some@email.com");
        expect(emailValidation.isValid).toBe(true);

        const noValueValidation = await isEmail.or(isAbsent).check("", "email");
        expect(noValueValidation.x).toBe("");
        expect(noValueValidation.isValid).toBe(true);

        const invalidEmailValidation = await isEmail
            .or(isAbsent)
            .check("whatever", "email");
        expect(invalidEmailValidation.x).toEqual([
            "email must be an email",
            "email can be absent",
        ]);
        expect(invalidEmailValidation.isValid).toBe(false);
    });

    it("should support async validator function", async () => {
        const isPresentInDb = validator(async (id, key) => {
            await new Promise((resolve) => {
                setTimeout(resolve, 500);
            });
            if (id === "404") {
                return Validation.Invalid([`${key} does not exists`]);
            }

            return Validation.Valid(id);
        });

        const validValidation = await isPresentInDb.check("200", "userId");
        expect(validValidation.x).toEqual("200");
        expect(validValidation.isValid).toBe(true);

        const invalidValidation = await isPresent
            .and(isPresentInDb)
            .check("404", "userId");
        expect(invalidValidation.x).toEqual(["userId does not exists"]);
        expect(invalidValidation.isValid).toBe(false);

        const invalidValidation2 = await isPresent
            .and(isPresentInDb)
            .check("", "userId");
        expect(invalidValidation2.x).toEqual(["userId must be present"]);
        expect(invalidValidation2.isValid).toBe(false);
    });
});
