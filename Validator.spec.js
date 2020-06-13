const { validator } = require("./Validator");
const Validation = require("./Validation");

const isAbsent = validator((value) => {
    if (!!value) {
        return Validation.Invalid([`value can be absent`]);
    }
    return Validation.Valid(value);
});
const isEmail = validator((value) => {
    if (/@/.test(value)) {
        return Validation.Valid(value);
    }
    return Validation.Invalid([`value must be an email`]);
});
const isPresent = validator((value) => {
    if (!!value) {
        return Validation.Valid(value);
    }
    return Validation.Invalid([`value must be present`]);
});

describe("Validator", () => {
    it("should allow to run validator returning Validation", async () => {
        const validate = validator((value) => {
            if (/@/.test(value)) {
                return Validation.Valid(value);
            }
            return Validation.Invalid([`value must be an email`]);
        });

        const validValidation = await validate.check("some@email.com", "email");
        expect(validValidation).toBe("some@email.com");

        const invalidValidation = await validate.check(
            "I will type whatever I want",
            "email"
        );
        expect(invalidValidation).toEqual(["value must be an email"]);
    });

    it("should allow to combine validator with and", async () => {
        const validValidation = await isPresent
            .and(isEmail)
            .check("some@email.com", "email");
        expect(validValidation).toBe("some@email.com");

        const noValueValidation = await isPresent
            .and(isEmail)
            .check("", "email");
        expect(noValueValidation).toEqual([
            "value must be present",
            "value must be an email",
        ]);

        const invalidEmailValidation = await isPresent
            .and(isEmail)
            .check("whatever", "email");
        expect(invalidEmailValidation).toEqual(["value must be an email"]);
    });

    it("should allow to combine validator with or", async () => {
        const emailValidation = await isEmail
            .or(isAbsent)
            .check("some@email.com", "email");
        expect(emailValidation).toBe("some@email.com");

        const noValueValidation = await isEmail.or(isAbsent).check("", "email");
        expect(noValueValidation).toBe("");

        const invalidEmailValidation = await isEmail
            .or(isAbsent)
            .check("whatever", "email");
        expect(invalidEmailValidation).toEqual([
            "value must be an email",
            "value can be absent",
        ]);
    });

    it("should support async validator function", async () => {
        const isPresentInDb = validator(async (id, key) => {
            await new Promise((resolve) => {
                setTimeout(resolve, 500);
            });
            if (id === "404") {
                return Validation.Invalid([`user does not exists`]);
            }

            return Validation.Valid(id);
        });

        const validValidation = await isPresentInDb.check("200", "userId");
        expect(validValidation).toEqual("200");

        const invalidValidation = await isPresent
            .and(isPresentInDb)
            .check("404");
        expect(invalidValidation).toEqual(["user does not exists"]);

        const invalidValidation2 = await isPresent.and(isPresentInDb).check("");
        expect(invalidValidation2).toEqual(["value must be present"]);
    });
});
