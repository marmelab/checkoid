import { shape } from "./object";
import { validator, asyncValidator } from "../Validator";
import { hasLengthGt } from "./length";
import { match } from "./string";

const isPresent = validator((value) => {
    return !!value;
}, `value is present`);

const isLongerThanTree = hasLengthGt(3);

const isAbsent = validator((value) => {
    return !value;
}, `value is absent`);
const isEmail = match(/@/).format(() => `value is an email`);

const isPresentInDb = asyncValidator(async (id) => {
    await new Promise((resolve) => {
        setTimeout(resolve, 1);
    });
    return id && id !== 404 ? true : false;
}, `user does not exists`);

describe("shape", () => {
    it("should allow to create a validator for an user object given a simple spec", () => {
        const userSpec = {
            name: isPresent,
            email: isEmail,
        };

        const UserValidator = shape(userSpec);

        expect(UserValidator.check({ name: "toto" })).toEqual([
            {
                key: ["email"],
                valid: false,
                inverted: false,
                predicate: "value is an email",
            },
        ]);
        expect(
            UserValidator.check({ name: "toto", email: "toto@gmail.com" })
        ).toBeUndefined();

        expect(
            UserValidator.check({ name: "toto", email: "not an email" })
        ).toEqual([
            {
                key: ["email"],
                valid: false,
                inverted: false,
                predicate: "value is an email",
                value: "not an email",
            },
        ]);
        expect(UserValidator.check({ name: "", email: "" })).toEqual([
            {
                key: ["name"],
                valid: false,
                inverted: false,
                predicate: "value is present",
                value: "",
            },
            {
                key: ["email"],
                valid: false,
                inverted: false,
                predicate: "value is an email",
                value: "",
            },
        ]);

        expect(UserValidator.check("toto")).toEqual([
            {
                valid: false,
                inverted: false,
                predicate: "value is an object",
                value: "toto",
            },
            {
                key: ["name"],
                valid: false,
                inverted: false,
                predicate: "value is present",
                value: undefined,
            },
            {
                key: ["email"],
                valid: false,
                inverted: false,
                predicate: "value is an email",
                value: undefined,
            },
        ]);
    });

    it("should return error when object contains extra key and exact is true", () => {
        const userSpec = {
            name: isPresent,
            email: isEmail,
        };
        const UserValidator = shape(userSpec);
        const ExactUserValidator = shape(userSpec, true);

        expect(
            UserValidator.check({
                name: "toto",
                email: "toto@gmail.com",
                firstName: "tototoo",
            })
        ).toBeUndefined();

        expect(
            ExactUserValidator.check({
                name: "toto",
                email: "toto@gmail.com",
                firstName: "tototoo",
            })
        ).toEqual([
            {
                valid: false,
                inverted: false,
                predicate: "Value has only the following keys: name,email",
                value: {
                    name: "toto",
                    email: "toto@gmail.com",
                    firstName: "tototoo",
                },
            },
        ]);
    });

    it("should return an async validator if at least one validator in spec is async", async () => {
        const userSpec = {
            id: isPresentInDb,
            name: isPresent,
            email: isEmail,
        };

        const UserValidator = shape(userSpec);

        const promise = UserValidator.check({
            id: null,
            email: "not an email",
            name: "toto",
        });

        expect(promise.then).toBeDefined();

        expect(await promise).toEqual([
            {
                key: ["id"],
                valid: false,
                inverted: false,
                predicate: "user does not exists",
                value: null,
            },
            {
                key: ["email"],
                valid: false,
                inverted: false,
                predicate: "value is an email",
                value: "not an email",
            },
        ]);
    });

    it("should allow to create a validator for an user object given a spec", () => {
        const userSpec = {
            name: isPresent.and(isLongerThanTree),
            email: isEmail.or(isAbsent),
        };

        const UserValidator = shape(userSpec);

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
                valid: false,
                inverted: false,
                predicate: "value is an email",
                value: "not an email",
            },
            {
                key: ["email"],
                valid: false,
                inverted: false,
                predicate: "value is absent",
                value: "not an email",
            },
        ]);
        expect(UserValidator.check({ name: "", email: "" })).toEqual([
            {
                key: ["name"],
                valid: false,
                inverted: false,
                predicate: "value is present",
                value: "",
            },
            {
                key: ["name"],
                valid: false,
                inverted: false,
                predicate: "value has a length greater than 3",
                value: "",
            },
        ]);
        expect(UserValidator.check({ name: "to", email: "" })).toEqual([
            {
                key: ["name"],
                valid: false,
                inverted: false,
                predicate: "value has a length greater than 3",
                value: "to",
            },
        ]);
    });

    it("should allow to nest shape", () => {
        const spec = {
            user: shape({
                name: isPresent.and(isLongerThanTree),
                email: isEmail.or(isAbsent),
            }),
        };

        const ComplexValidator = shape(spec);

        expect(
            ComplexValidator.check({ user: { name: "toto" } })
        ).toBeUndefined();
        expect(
            ComplexValidator.check({
                name: "toto",
                email: "toto@gmail.com",
            })
        ).toEqual([
            {
                key: ["user"],
                valid: false,
                inverted: false,
                predicate: "value is an object",
                value: undefined,
            },
            {
                key: ["user", "name"],
                valid: false,
                inverted: false,
                predicate: "value is present",
                value: undefined,
            },
            {
                key: ["user", "name"],
                valid: false,
                inverted: false,
                predicate: "value has a length greater than 3",
                value: undefined,
            },
        ]);
    });
});
