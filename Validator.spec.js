const { Validator } = require("./Validator");
const Result = require("./Result");

const isAbsent = Validator.fromFn((value, key) => {
    if (!!value) {
        return Result.Invalid([`${key} can be absent`]);
    }
    return Result.Valid(value);
});
const isEmail = Validator.fromFn((value, key) => {
    if (/@/.test(value)) {
        return Result.Valid(value);
    }
    return Result.Invalid([`${key} must be an email`]);
});
const isPresent = Validator.fromFn((value, key) => {
    if (!!value) {
        return Result.Valid(value);
    }
    return Result.Invalid([`${key} must be present`]);
});

describe("Validator", () => {
    it("should allow to run validator returning Result", async () => {
        const validator = Validator.fromFn((value, key) => {
            if (/@/.test(value)) {
                return Result.Valid(value);
            }
            return Result.Invalid([`${key} must be an email`]);
        });

        const validResult = await validator
            .run("some@email.com", "email")
            .toPromise();
        expect(validResult.x).toBe("some@email.com");

        const invalidResult = await validator
            .run("I will type whatever I want", "email")
            .toPromise();
        expect(invalidResult.x).toEqual(["email must be an email"]);
    });

    it("should allow to combine validator with and", async () => {
        const validResult = await isPresent
            .and(isEmail)
            .run("some@email.com", "email")
            .toPromise();
        expect(validResult.x).toBe("some@email.com");

        const noValueResult = await isPresent
            .and(isEmail)
            .run("", "email")
            .toPromise();
        expect(noValueResult.x).toEqual([
            "email must be present",
            "email must be an email",
        ]);

        const invalidEmailResult = await isPresent
            .and(isEmail)
            .run("whatever", "email")
            .toPromise();
        expect(invalidEmailResult.x).toEqual(["email must be an email"]);
    });

    it("should allow to combine validator with or", async () => {
        const emailResult = await isEmail
            .or(isAbsent)
            .run("some@email.com", "email")
            .toPromise();
        expect(emailResult.x).toBe("some@email.com");
        expect(emailResult.isValid).toBe(true);

        const noValueResult = await isEmail
            .or(isAbsent)
            .run("", "email")
            .toPromise();
        expect(noValueResult.x).toBe("");
        expect(noValueResult.isValid).toBe(true);

        const invalidEmailResult = await isEmail
            .or(isAbsent)
            .run("whatever", "email")
            .toPromise();
        expect(invalidEmailResult.x).toEqual([
            "email must be an email",
            "email can be absent",
        ]);
        expect(invalidEmailResult.isValid).toBe(false);
    });

    it("should support async validator function", async () => {
        const isPresentInDb = Validator.fromFn(async (id, key) => {
            await new Promise((resolve) => {
                setTimeout(resolve, 500);
            });
            if (id === "404") {
                return Result.Invalid([`${key} does not exists`]);
            }

            return Result.Valid(id);
        });

        const validResult = await isPresentInDb
            .run("200", "userId")
            .toPromise();
        expect(validResult.x).toEqual("200");
        expect(validResult.isValid).toBe(true);

        const invalidResult = await isPresent
            .and(isPresentInDb)
            .run("404", "userId")
            .toPromise();
        expect(invalidResult.x).toEqual(["userId does not exists"]);
        expect(invalidResult.isValid).toBe(false);

        const invalidResult2 = await isPresent
            .and(isPresentInDb)
            .run("", "userId")
            .toPromise();
        expect(invalidResult2.x).toEqual(["userId must be present"]);
        expect(invalidResult2.isValid).toBe(false);
    });
});
