const { Validation } = require("./Validation");
const Result = require("./Result");

describe("Validation", () => {
    it("should allow to run validation returning Result", () => {
        const validation = Validation((value, key) => {
            if (/@/.test(value)) {
                return Result.Valid(value);
            }
            return Result.Invalid([`${key} must be an email`]);
        });

        const validResult = validation.run("some@email.com", "email");
        expect(validResult.x).toBe("some@email.com");

        const invalidResult = validation.run(
            "I will type whatever I want",
            "email"
        );
        expect(invalidResult.x).toEqual(["email must be an email"]);
    });

    it("should allow to combine validation with and", () => {
        const isPresent = Validation((value, key) => {
            if (!!value) {
                return Result.Valid(value);
            }
            return Result.Invalid([`${key} must be present`]);
        });
        const isEmail = Validation((value, key) => {
            if (/@/.test(value)) {
                return Result.Valid(value);
            }
            return Result.Invalid([`${key} must be an email`]);
        });

        const validResult = isPresent
            .and(isEmail)
            .run("some@email.com", "email");
        expect(validResult.x).toBe("some@email.com");

        const noValueResult = isPresent.and(isEmail).run("", "email");
        expect(noValueResult.x).toEqual([
            "email must be present",
            "email must be an email",
        ]);

        const invalidEmailResult = isPresent
            .and(isEmail)
            .run("whatever", "email");
        expect(invalidEmailResult.x).toEqual(["email must be an email"]);
    });

    it("should allow to combine validation with or", () => {
        const isAbsent = Validation((value, key) => {
            if (!!value) {
                return Result.Invalid([`${key} can be absent`]);
            }
            return Result.Valid(value);
        });
        const isEmail = Validation((value, key) => {
            if (/@/.test(value)) {
                return Result.Valid(value);
            }
            return Result.Invalid([`${key} must be an email`]);
        });

        const emailResult = isEmail.or(isAbsent).run("some@email.com", "email");
        expect(emailResult.x).toBe("some@email.com");
        expect(emailResult.isValid).toBe(true);

        const noValueResult = isEmail.or(isAbsent).run("", "email");
        expect(noValueResult.x).toBe("");
        expect(noValueResult.isValid).toBe(true);

        const invalidEmailResult = isEmail
            .or(isAbsent)
            .run("whatever", "email");
        expect(invalidEmailResult.x).toEqual([
            "email must be an email",
            "email can be absent",
        ]);
        expect(invalidEmailResult.isValid).toBe(false);
    });
});
