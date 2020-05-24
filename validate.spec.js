const validate = require("./validate");
const Result = require("./Result");
const { Validation } = require("./Validation");

const isPresent = Validation((value, key) => {
    if (!!value) {
        return Result.Valid(value);
    }
    return Result.Invalid([`${key} must be present`]);
});

const isLongerThanTree = Validation((value, key) => {
    if (value && value.length > 3) {
        return Result.Valid(value);
    }
    return Result.Invalid([`${key} must be longer than 3`]);
});
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

describe("validate", () => {
    it("should allow to validate an user given a spec", () => {
        const userSpec = {
            name: isPresent.and(isLongerThanTree),
            email: isEmail.or(isAbsent),
        };

        const UserValidation = validate(userSpec);

        expect(UserValidation.run({ name: "toto" }).x).toEqual({
            name: "toto",
        });
        expect(
            UserValidation.run({ name: "toto", email: "toto@gmail.com" }).x
        ).toEqual({ name: "toto", email: "toto@gmail.com" });

        expect(UserValidation.run({ name: "toto" }).x).toEqual({
            name: "toto",
        });
        expect(
            UserValidation.run({ name: "toto", email: "pas un email" }).x
        ).toEqual(["email must be an email", "email can be absent"]);
        expect(UserValidation.run({ name: "", email: "" }).x).toEqual([
            "name must be present",
            "name must be longer than 3",
        ]);
        expect(UserValidation.run({ name: "to", email: "" }).x).toEqual([
            "name must be longer than 3",
        ]);
    });

    it("should allow to nest validate", () => {
        const spec = {
            user: validate({
                name: isPresent.and(isLongerThanTree),
                email: isEmail.or(isAbsent),
            }),
        };

        const ComplexValidation = validate(spec);

        expect(ComplexValidation.run({ user: { name: "toto" } }).x).toEqual({
            user: {
                name: "toto",
            },
        });
        expect(
            ComplexValidation.run({ name: "toto", email: "toto@gmail.com" }).x
        ).toEqual([
            "user.name must be present",
            "user.name must be longer than 3",
        ]);
    });
});
