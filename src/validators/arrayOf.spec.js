import { arrayOf } from "./array";
import { shape } from "./object";
import { validator, asyncValidator } from "../Validator";
import { match } from "./string";

const isEmail = match(/@/).format(() => `value must be an email`);

const isPresent = validator((value) => {
    if (!!value) {
        return;
    }
    return `value must be present`;
});

const isPresentInDb = asyncValidator(async (id) => {
    await new Promise((resolve) => {
        setTimeout(resolve, 1);
    });
    if (!id || id === 404) {
        return `user does not exists`;
    }
});

describe("arrayOf", () => {
    it("should allow to apply validation to a list of value", () => {
        const emailValidator = isPresent.and(isEmail);
        const res = arrayOf(emailValidator).check([
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

    it("should allow to apply asyncValidation to a list of value", async () => {
        const areIdsPresentIndDb = arrayOf(isPresentInDb);
        const res = areIdsPresentIndDb.check([201, 404, 200]);
        expect(res.then).toBeDefined();
        expect(await res).toEqual([
            {
                key: [1],
                message: "user does not exists",
                value: 404,
            },
        ]);
    });

    it("should return appropriate error if value is no array", () => {
        const emailValidator = isPresent.and(isEmail);
        const res = arrayOf(emailValidator).check("Hi, trust me I am a list");
        expect(res).toEqual([
            {
                message: "value must be an array",
                value: "Hi, trust me I am a list",
            },
        ]);
    });

    it("should allow to apply object validation to a list of value", () => {
        const userValidators = shape({
            name: isPresent,
            email: isEmail,
        });
        const res = arrayOf(userValidators).check([
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
        const emailarrayOfs = arrayOf(emailValidator);
        const res = arrayOf(emailarrayOfs).check([
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
        const validators = shape({
            users: arrayOf(
                shape({
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
                message: "value must be an object",
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
