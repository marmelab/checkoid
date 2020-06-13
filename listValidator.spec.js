const listValidator = require("./listValidator");
const objectValidator = require("./objectValidator");
const Validation = require("./Validation");
const { validator } = require("./Validator");

const isEmail = validator((value, key) => {
    if (/@/.test(value)) {
        return Validation.Valid(value);
    }
    return Validation.Invalid([`${key} must be an email`]);
});
const isPresent = validator((value, key) => {
    if (!!value) {
        return Validation.Valid(value);
    }
    return Validation.Invalid([`${key} must be present`]);
});

describe("listValidator", () => {
    it("should allow to apply validation to a list of value", async () => {
        const emailValidator = isPresent.and(isEmail);
        const res = await listValidator(emailValidator).check([
            "test@email.com",
            "not an email",
        ]);
        expect(res).toEqual(["[1] must be an email"]);
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
        expect(res).toEqual(["[1].email must be an email"]);
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
                { name: "", email: "test@email.com" },
                { name: "toto", email: "not an email" },
            ],
        });
        expect(res).toEqual([
            "users[0].name must be present",
            "users[1].email must be an email",
        ]);
    });
});
