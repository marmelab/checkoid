const listValidator = require("./listValidator");
const objectValidator = require("./objectValidator");
const Validation = require("./Validation");
const { validator } = require("./Validator");

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

describe("listValidator", () => {
    it("should allow to apply validation to a list of value", () => {
        const emailValidator = isPresent.and(isEmail);
        const res = listValidator(emailValidator).check([
            "test@email.com",
            "not an email",
        ]);
        expect(res).toEqual([
            {
                key: [1],
                message: "value must be an email",
                value: "not an email",
            },
        ]);
    });

    it("should return appropriate error if value is no array", () => {
        const emailValidator = isPresent.and(isEmail);
        const res = listValidator(emailValidator).check(
            "Hi, trust me I am a list"
        );
        expect(res).toEqual([
            {
                message: "value must be an array",
                value: "Hi, trust me I am a list",
            },
        ]);
    });

    it("should allow to apply object validation to a list of value", () => {
        const userValidators = objectValidator({
            name: isPresent,
            email: isEmail,
        });
        const res = listValidator(userValidators).check([
            { name: "toto", email: "test@email.com" },
            { name: "toto", email: "not an email" },
        ]);
        expect(res).toEqual([
            {
                key: [1, "email"],
                message: "value must be an email",
                value: "not an email",
            },
        ]);
    });

    it("should allow to apply list validation to a list of list", () => {
        const emailValidator = isPresent.and(isEmail);
        const emailListValidators = listValidator(emailValidator);
        const res = listValidator(emailListValidators).check([
            ["test@email.com", "not an email"],
            ["not an email"],
        ]);
        expect(res).toEqual([
            {
                key: [0, 1],
                message: "value must be an email",
                value: "not an email",
            },
            {
                key: [1, 0],
                message: "value must be an email",
                value: "not an email",
            },
        ]);
    });

    it("should allow to be nested with validate Object", () => {
        const validators = objectValidator({
            users: listValidator(
                objectValidator({
                    name: isPresent,
                    email: isEmail,
                })
            ),
        });
        const res = validators.check({
            users: [
                "toto",
                { name: "", email: "test@email.com" },
                { name: "toto", email: "not an email" },
            ],
        });
        expect(res).toEqual([
            {
                key: ["users", 0],
                message: "value is not an object",
                value: "toto",
            },
            {
                key: ["users", 0, "name"],
                message: "value must be present",
                value: undefined,
            },
            {
                key: ["users", 0, "email"],
                message: "value must be an email",
                value: undefined,
            },
            {
                key: ["users", 1, "name"],
                message: "value must be present",
                value: "",
            },
            {
                key: ["users", 2, "email"],
                message: "value must be an email",
                value: "not an email",
            },
        ]);

        expect(
            validators.check({
                users: "A list of user :P",
            })
        ).toEqual([
            {
                key: ["users"],
                message: "value must be an array",
                value: "A list of user :P",
            },
        ]);
    });
});
