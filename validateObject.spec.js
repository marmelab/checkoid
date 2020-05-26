const validateObject = require("./validateObject");
const Validation = require("./Validation");
const { validator } = require("./Validator");

const isPresent = validator((value, key) => {
    if (!!value) {
        return Validation.Valid(value);
    }
    return Validation.Invalid([`${key} must be present`]);
});

const isLongerThanTree = validator((value, key) => {
    if (value && value.length > 3) {
        return Validation.Valid(value);
    }
    return Validation.Invalid([`${key} must be longer than 3`]);
});
const isAbsent = validator((value, key) => {
    if (!!value) {
        return Validation.Invalid([`${key} can be absent`]);
    }
    return Validation.Valid(value);
});
const isEmail = validator((value, key) => {
    if (/@/.test(value)) {
        return Validation.Valid(value);
    }
    return Validation.Invalid([`${key} must be an email`]);
});

describe("validateObject", () => {
    it("should allow to validateObject an user object given a simple spec", async () => {
        const userSpec = {
            name: isPresent,
            email: isEmail,
        };

        const UserValidator = validateObject(userSpec);

        expect(await UserValidator.check({ name: "toto" })).toEqual([
            "email must be an email",
        ]);
        expect(
            await UserValidator.check({ name: "toto", email: "toto@gmail.com" })
        ).toEqual({ name: "toto", email: "toto@gmail.com" });

        expect(
            await UserValidator.check({ name: "toto", email: "pas un email" })
        ).toEqual(["email must be an email"]);
        expect(await UserValidator.check({ name: "", email: "" })).toEqual([
            "name must be present",
            "email must be an email",
        ]);
    });

    it("should allow to validateObject an user object given a spec", async () => {
        const userSpec = {
            name: isPresent.and(isLongerThanTree),
            email: isEmail.or(isAbsent),
        };

        const UserValidator = validateObject(userSpec);

        expect(await UserValidator.check({ name: "toto" })).toEqual({
            name: "toto",
        });
        expect(
            await UserValidator.check({ name: "toto", email: "toto@gmail.com" })
        ).toEqual({ name: "toto", email: "toto@gmail.com" });

        expect(await UserValidator.check({ name: "toto" })).toEqual({
            name: "toto",
        });
        expect(
            await UserValidator.check({ name: "toto", email: "pas un email" })
        ).toEqual(["email must be an email", "email can be absent"]);
        expect(await UserValidator.check({ name: "", email: "" })).toEqual([
            "name must be present",
            "name must be longer than 3",
        ]);
        expect(await UserValidator.check({ name: "to", email: "" })).toEqual([
            "name must be longer than 3",
        ]);
    });

    it("should allow to nest validateObject", async () => {
        const spec = {
            user: validateObject({
                name: isPresent.and(isLongerThanTree),
                email: isEmail.or(isAbsent),
            }),
        };

        const ComplexValidator = validateObject(spec);

        expect(
            await ComplexValidator.check({ user: { name: "toto" } })
        ).toEqual({
            user: {
                name: "toto",
            },
        });
        expect(
            await ComplexValidator.check({
                name: "toto",
                email: "toto@gmail.com",
            })
        ).toEqual([
            "user.name must be present",
            "user.name must be longer than 3",
        ]);
    });
});
