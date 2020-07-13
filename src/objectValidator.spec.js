const objectValidator = require("./objectValidator");
const { validator, asyncValidator } = require("./Validator");

const isPresent = validator((value) => {
    if (!!value) {
        return;
    }
    return `value must be present`;
});

const isLongerThanTree = validator((value) => {
    if (value && value.length > 3) {
        return;
    }
    return `value must be longer than 3`;
});
const isAbsent = validator((value) => {
    if (!!value) {
        return `value can be absent`;
    }
});
const isEmail = validator((value) => {
    if (/@/.test(value)) {
        return;
    }
    return `value must be an email`;
});

const isPresentInDb = asyncValidator(async (id) => {
    await new Promise((resolve) => {
        setTimeout(resolve, 1);
    });
    if (!id || id === "404") {
        return `user does not exists`;
    }
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
        ).toBeUndefined();

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

    it("should return an async validator if at least one validator in spec is async", async () => {
        const userSpec = {
            id: isPresentInDb,
            name: isPresent,
            email: isEmail,
        };

        const UserValidator = objectValidator(userSpec);

        const promise = UserValidator.check({
            id: null,
            email: "not an email",
            name: "toto",
        });

        expect(promise.then).toBeDefined();

        expect(await promise).toEqual([
            { key: ["id"], message: "user does not exists", value: null },
            {
                key: ["email"],
                message: "value must be an email",
                value: "not an email",
            },
        ]);
    });

    it("should allow to create a validator for an user object given a spec", () => {
        const userSpec = {
            name: isPresent.and(isLongerThanTree),
            email: isEmail.or(isAbsent),
        };

        const UserValidator = objectValidator(userSpec);

        expect(UserValidator.check({ name: "toto" })).toBeUndefined();
        expect(
            UserValidator.check({ name: "toto", email: "toto@gmail.com" })
        ).toBeUndefined();

        expect(UserValidator.check({ name: "toto" })).toBeUndefined();
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

        expect(
            ComplexValidator.check({ user: { name: "toto" } })
        ).toBeUndefined();
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
