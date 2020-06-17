const objectValidator = require("./objectValidator");
const Validation = require("./Validation");
const { validator } = require("./Validator");

const isPresent = validator((value) => {
    if (!!value) {
        return Validation.Valid(value);
    }
    return Validation.Invalid([`value must be present`]);
});

const isLongerThanTree = validator((value) => {
    if (value && value.length > 3) {
        return Validation.Valid(value);
    }
    return Validation.Invalid([`value must be longer than 3`]);
});
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

describe("objectValidator", () => {
    it("should allow to create a validator for an user object given a simple spec", () => {
        const userSpec = {
            name: isPresent,
            email: isEmail,
        };

        const UserValidator = objectValidator(userSpec);

        expect(UserValidator.check({ name: "toto" })).toEqual([
            { key: ["email"], message: "value must be an email" },
        ]);
        expect(
            UserValidator.check({ name: "toto", email: "toto@gmail.com" })
        ).toEqual({ name: "toto", email: "toto@gmail.com" });

        expect(
            UserValidator.check({ name: "toto", email: "not an email" })
        ).toEqual([
            {
                key: ["email"],
                message: "value must be an email",
                value: "not an email",
            },
        ]);
        expect(UserValidator.check({ name: "", email: "" })).toEqual([
            { key: ["name"], message: "value must be present", value: "" },
            { key: ["email"], message: "value must be an email", value: "" },
        ]);

        expect(UserValidator.check("toto")).toEqual([
            { message: "value is not an object", value: "toto" },
            {
                key: ["name"],
                message: "value must be present",
                value: undefined,
            },
            {
                key: ["email"],
                message: "value must be an email",
                value: undefined,
            },
        ]);
    });

    it("should allow to create a validator for an user object given a spec", () => {
        const userSpec = {
            name: isPresent.and(isLongerThanTree),
            email: isEmail.or(isAbsent),
        };

        const UserValidator = objectValidator(userSpec);

        expect(UserValidator.check({ name: "toto" })).toEqual({
            name: "toto",
        });
        expect(
            UserValidator.check({ name: "toto", email: "toto@gmail.com" })
        ).toEqual({ name: "toto", email: "toto@gmail.com" });

        expect(UserValidator.check({ name: "toto" })).toEqual({
            name: "toto",
        });
        expect(
            UserValidator.check({ name: "toto", email: "not an email" })
        ).toEqual([
            {
                key: ["email"],
                message: "value must be an email",
                value: "not an email",
            },
            {
                key: ["email"],
                message: "value can be absent",
                value: "not an email",
            },
        ]);
        expect(UserValidator.check({ name: "", email: "" })).toEqual([
            { key: ["name"], message: "value must be present", value: "" },
            {
                key: ["name"],
                message: "value must be longer than 3",
                value: "",
            },
        ]);
        expect(UserValidator.check({ name: "to", email: "" })).toEqual([
            {
                key: ["name"],
                message: "value must be longer than 3",
                value: "to",
            },
        ]);
    });

    it("should allow to nest objectValidator", () => {
        const spec = {
            user: objectValidator({
                name: isPresent.and(isLongerThanTree),
                email: isEmail.or(isAbsent),
            }),
        };

        const ComplexValidator = objectValidator(spec);

        expect(ComplexValidator.check({ user: { name: "toto" } })).toEqual({
            user: {
                name: "toto",
            },
        });
        expect(
            ComplexValidator.check({
                name: "toto",
                email: "toto@gmail.com",
            })
        ).toEqual([
            { key: ["user"], message: "value is not an object" },
            { key: ["user", "name"], message: "value must be present" },
            { key: ["user", "name"], message: "value must be longer than 3" },
        ]);
    });
});
