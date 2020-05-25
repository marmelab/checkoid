const validateObject = require("./validateObject");
const Validation = require("./Validation");
const { Validator } = require("./Validator");

const isPresent = Validator((value, key) => {
    if (!!value) {
        return Validation.Valid(value);
    }
    return Validation.Invalid([`${key} must be present`]);
});

const isLongerThanTree = Validator((value, key) => {
    if (value && value.length > 3) {
        return Validation.Valid(value);
    }
    return Validation.Invalid([`${key} must be longer than 3`]);
});
const isAbsent = Validator((value, key) => {
    if (!!value) {
        return Validation.Invalid([`${key} can be absent`]);
    }
    return Validation.Valid(value);
});
const isEmail = Validator((value, key) => {
    if (/@/.test(value)) {
        return Validation.Valid(value);
    }
    return Validation.Invalid([`${key} must be an email`]);
});

describe("validateObject", () => {
    it("should allow to validateObject an user object given a spec", () => {
        const userSpec = {
            name: isPresent.and(isLongerThanTree),
            email: isEmail.or(isAbsent),
        };

        const UserValidator = validateObject(userSpec);

        expect(UserValidator.run({ name: "toto" }).x).toEqual({
            name: "toto",
        });
        expect(
            UserValidator.run({ name: "toto", email: "toto@gmail.com" }).x
        ).toEqual({ name: "toto", email: "toto@gmail.com" });

        expect(UserValidator.run({ name: "toto" }).x).toEqual({
            name: "toto",
        });
        expect(
            UserValidator.run({ name: "toto", email: "pas un email" }).x
        ).toEqual(["email must be an email", "email can be absent"]);
        expect(UserValidator.run({ name: "", email: "" }).x).toEqual([
            "name must be present",
            "name must be longer than 3",
        ]);
        expect(UserValidator.run({ name: "to", email: "" }).x).toEqual([
            "name must be longer than 3",
        ]);
    });

    it("should allow to nest validateObject", () => {
        const spec = {
            user: validateObject({
                name: isPresent.and(isLongerThanTree),
                email: isEmail.or(isAbsent),
            }),
        };

        const ComplexValidator = validateObject(spec);

        expect(ComplexValidator.run({ user: { name: "toto" } }).x).toEqual({
            user: {
                name: "toto",
            },
        });
        expect(
            ComplexValidator.run({ name: "toto", email: "toto@gmail.com" }).x
        ).toEqual([
            "user.name must be present",
            "user.name must be longer than 3",
        ]);
    });
});
