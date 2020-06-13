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
    it("should allow to apply validation to a list of value", async () => {
        const emailValidator = isPresent.and(isEmail);
        const res = await listValidator(emailValidator).check([
            "test@email.com",
            "not an email",
        ]);
        expect(res).toEqual([
            {
                key: "[1]",
                message: "value must be an email",
                value: "not an email",
            },
        ]);
    });

    it("should allow to apply object validation to a list of value", async () => {
        const userValidators = objectValidator({
            name: isPresent,
            email: isEmail,
        });
        const res = await listValidator(userValidators).check([
            { name: "toto", email: "test@email.com" },
            { name: "toto", email: "not an email" },
        ]);
        expect(res).toEqual([
            {
                key: "[1].email",
                message: "value must be an email",
                value: "not an email",
            },
        ]);
    });

    it("should allow to be nested with validate Object", async () => {
        const validators = objectValidator({
            users: listValidator({
                name: isPresent,
                email: isEmail,
            }),
        });
        const res = await validators.check({
            users: [
                "toto",
                { name: "", email: "test@email.com" },
                { name: "toto", email: "not an email" },
            ],
        });
        expect(res).toEqual([
            {
                key: "users[0]",
                message: "value is not an object",
                value: "toto",
            },
            {
                key: "users[0].name",
                message: "value must be present",
                value: undefined,
            },
            {
                key: "users[0].email",
                message: "value must be an email",
                value: undefined,
            },
            {
                key: "users[1].name",
                message: "value must be present",
                value: "",
            },
            {
                key: "users[2].email",
                message: "value must be an email",
                value: "not an email",
            },
        ]);
    });
});