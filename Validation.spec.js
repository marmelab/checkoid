const { Validation } = require("./Validation");
const Result = require("./Result");

describe("Validation", () => {
    it("should allow to run validation return ning Result", () => {
        const validation = Validation((key, value) => {
            if (/@/.test(value)) {
                return Result.Valid(value);
            }
            return Result.Invalid([`${key} must be an email`]);
        });

        const validResult = validation.run("email", "some@email.com");
        expect(validResult.x).toBe("some@email.com");

        const invalidResult = validation.run(
            "email",
            "I will type whatever I want"
        );
        expect(invalidResult.x).toEqual(["email must be an email"]);
    });

    it("should allow to combine validation with and", () => {
        const isPresent = Validation((key, value) => {
            if (!!value) {
                return Result.Valid(value);
            }
            return Result.Invalid([`${key} must be present`]);
        });
        const isEmail = Validation((key, value) => {
            if (/@/.test(value)) {
                return Result.Valid(value);
            }
            return Result.Invalid([`${key} must be an email`]);
        });

        const validResult = isPresent
            .and(isEmail)
            .run("email", "some@email.com");
        expect(validResult.x).toBe("some@email.com");

        const noValueResult = isPresent.and(isEmail).run("email", "");
        expect(noValueResult.x).toEqual([
            "email must be present",
            "email must be an email",
        ]);

        const invalidEmailResult = isPresent
            .and(isEmail)
            .run("email", "whatever");
        expect(invalidEmailResult.x).toEqual(["email must be an email"]);
    });

    it("should allow to combine validation with or", () => {
        const isAbsent = Validation((key, value) => {
            if (!!value) {
                return Result.Invalid([`${key} can be absent`]);
            }
            return Result.Valid(value);
        });
        const isEmail = Validation((key, value) => {
            if (/@/.test(value)) {
                return Result.Valid(value);
            }
            return Result.Invalid([`${key} must be an email`]);
        });

        const emailResult = isEmail.or(isAbsent).run("email", "some@email.com");
        expect(emailResult.x).toBe("some@email.com");
        expect(emailResult.isValid).toBe(true);

        const noValueResult = isEmail.or(isAbsent).run("email", "");
        expect(noValueResult.x).toBe("");
        expect(noValueResult.isValid).toBe(true);

        const invalidEmailResult = isEmail
            .or(isAbsent)
            .run("email", "whatever");
        expect(invalidEmailResult.x).toEqual([
            "email must be an email",
            "email can be absent",
        ]);
        expect(invalidEmailResult.isValid).toBe(false);
    });
});
