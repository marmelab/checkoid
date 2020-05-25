const { Validator } = require("./Validator");
const Validation = require("./Validation");

const isAbsent = Validator.fromFn((value, key) => {
    if (!!value) {
        return Validation.Invalid([`${key} can be absent`]);
    }
    return Validation.Valid(value);
});
const isEmail = Validator.fromFn((value, key) => {
    if (/@/.test(value)) {
        return Validation.Valid(value);
    }
    return Validation.Invalid([`${key} must be an email`]);
});
const isPresent = Validator.fromFn((value, key) => {
    if (!!value) {
        return Validation.Valid(value);
    }
    return Validation.Invalid([`${key} must be present`]);
});

describe("Validator", () => {
    it("should allow to run validator returning Validation", async () => {
        const validator = Validator.fromFn((value, key) => {
            if (/@/.test(value)) {
                return Validation.Valid(value);
            }
            return Validation.Invalid([`${key} must be an email`]);
        });

        const validValidation = await validator
            .run("some@email.com", "email")
            .toPromise();
        expect(validValidation.x).toBe("some@email.com");

        const invalidValidation = await validator
            .run("I will type whatever I want", "email")
            .toPromise();
        expect(invalidValidation.x).toEqual(["email must be an email"]);
    });

    it("should allow to combine validator with and", async () => {
        const validValidation = await isPresent
            .and(isEmail)
            .run("some@email.com", "email")
            .toPromise();
        expect(validValidation.x).toBe("some@email.com");

        const noValueValidation = await isPresent
            .and(isEmail)
            .run("", "email")
            .toPromise();
        expect(noValueValidation.x).toEqual([
            "email must be present",
            "email must be an email",
        ]);

        const invalidEmailValidation = await isPresent
            .and(isEmail)
            .run("whatever", "email")
            .toPromise();
        expect(invalidEmailValidation.x).toEqual(["email must be an email"]);
    });

    it("should allow to combine validator with or", async () => {
        const emailValidation = await isEmail
            .or(isAbsent)
            .run("some@email.com", "email")
            .toPromise();
        expect(emailValidation.x).toBe("some@email.com");
        expect(emailValidation.isValid).toBe(true);

        const noValueValidation = await isEmail
            .or(isAbsent)
            .run("", "email")
            .toPromise();
        expect(noValueValidation.x).toBe("");
        expect(noValueValidation.isValid).toBe(true);

        const invalidEmailValidation = await isEmail
            .or(isAbsent)
            .run("whatever", "email")
            .toPromise();
        expect(invalidEmailValidation.x).toEqual([
            "email must be an email",
            "email can be absent",
        ]);
        expect(invalidEmailValidation.isValid).toBe(false);
    });

    it("should support async validator function", async () => {
        const isPresentInDb = Validator.fromFn(async (id, key) => {
            await new Promise((resolve) => {
                setTimeout(resolve, 500);
            });
            if (id === "404") {
                return Validation.Invalid([`${key} does not exists`]);
            }

            return Validation.Valid(id);
        });

        const validValidation = await isPresentInDb
            .run("200", "userId")
            .toPromise();
        expect(validValidation.x).toEqual("200");
        expect(validValidation.isValid).toBe(true);

        const invalidValidation = await isPresent
            .and(isPresentInDb)
            .run("404", "userId")
            .toPromise();
        expect(invalidValidation.x).toEqual(["userId does not exists"]);
        expect(invalidValidation.isValid).toBe(false);

        const invalidValidation2 = await isPresent
            .and(isPresentInDb)
            .run("", "userId")
            .toPromise();
        expect(invalidValidation2.x).toEqual(["userId must be present"]);
        expect(invalidValidation2.isValid).toBe(false);
    });
});
