const validate = require("./validate");
const Result = require("./Result");
const { Validation } = require("./Validation");

const isPresent = Validation((key, value) => {
    if (!!value) {
        return Result.Valid(value);
    }
    return Result.Invalid([`${key} must be present`]);
});

const isLongerThanTree = Validation((key, value) => {
    if (value.length > 3) {
        return Result.Valid(value);
    }
    return Result.Invalid([`${key} must be longer than 3`]);
});
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

describe("validate", () => {
    it("should allow to validate an user given a spec", () => {
        const userSpec = {
            name: isPresent.and(isLongerThanTree),
            email: isEmail.or(isAbsent),
        };

        const validateUser = validate(userSpec);

        expect(validateUser({ name: "toto" })).toEqual({ name: "toto" });
        expect(
            validateUser({ name: "toto", email: "toto@gmail.com" })
        ).toEqual({ name: "toto", email: "toto@gmail.com" });

        expect(validateUser({ name: "toto" })).toEqual({ name: "toto" });
        expect(validateUser({ name: "toto", email: "pas un email" })).toEqual([
            "email must be an email",
            "email can be absent",
        ]);
        expect(validateUser({ name: "", email: "" })).toEqual([
            "name must be present",
            "name must be longer than 3",
        ]);
        expect(validateUser({ name: "to", email: "" })).toEqual([
            "name must be longer than 3",
        ]);
    });
});
