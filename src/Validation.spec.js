const Validation = require("./Validation");
const { Valid, Invalid, Async } = Validation;

describe("Validation", () => {
    describe("and", () => {
        it("Valid and Valid should keep the first Valid value", () => {
            const res = Valid("valid").and(Valid("whatever"));
            expect(res.isValid).toBe(true);
            expect(res.getResult()).toBeUndefined();
        });

        it("Valid and Invalid should keep the Invalid value", () => {
            const res = Valid("valid").and(Invalid(["invalid"]));
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual(["invalid"]);
        });

        it("Valid and Async(Valid) should return an Async(Valid)", async () => {
            const res = Valid("valid").and(Async.valid("whatever"));
            expect(res.toPromise).toBeDefined();

            const valid = await res.toPromise();
            expect(valid.isValid).toBe(true);

            expect(await res.getResult()).toBeUndefined();
        });

        it("Valid and Async(InValid) should return an Async(Invalid)", async () => {
            const res = Valid("valid").and(Async.invalid(["invalid"]));
            expect(res.toPromise).toBeDefined();

            const invalid = await res.toPromise();
            expect(invalid.isValid).toBe(false);

            expect(await res.getResult()).toEqual(["invalid"]);
        });

        it("InValid and Valid should keep the Invalid value", () => {
            const res = Invalid(["invalid"]).and(Valid("valid"));
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual(["invalid"]);
        });

        it("Invalid and Invalid should concat the two Invalid value", () => {
            const res = Invalid(["invalid1"]).and(Invalid(["invalid2"]));
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual(["invalid1", "invalid2"]);
        });

        it("Invalid and Async(Valid) should return an Async(Invalid)", async () => {
            const res = Invalid(["invalid"]).and(Async.valid("valid"));
            expect(res.toPromise).toBeDefined();

            const invalid = await res.toPromise();
            expect(invalid.isValid).toBe(false);

            expect(await res.getResult()).toEqual(["invalid"]);
        });

        it("Invalid and Async(InValid) should return an Async(Invalid)", async () => {
            const res = Invalid(["invalid1"]).and(Async.invalid(["invalid2"]));
            expect(res.toPromise).toBeDefined();

            const invalid = await res.toPromise();
            expect(invalid.isValid).toBe(false);

            expect(await res.getResult()).toEqual(["invalid1", "invalid2"]);
        });

        it("Async(Valid) and Valid should return Async(Valid)", async () => {
            const res = Async.valid("valid").and(Valid("whatever"));
            expect(res.toPromise).toBeDefined();

            const valid = await res.toPromise();
            expect(valid.isValid).toBe(true);

            expect(await res.getResult()).toBeUndefined();
        });

        it("Async(Valid) and Invalid should return Async(Invalid)", async () => {
            const res = Async.valid("valid").and(Invalid(["invalid"]));
            expect(res.toPromise).toBeDefined();

            const invalid = await res.toPromise();
            expect(invalid.isValid).toBe(false);

            expect(await res.getResult()).toEqual(["invalid"]);
        });

        it("Async(Valid) and Async(Valid) should return an Async(Valid)", async () => {
            const res = Async.valid("valid").and(Async.valid("whatever"));
            expect(res.toPromise).toBeDefined();

            const valid = await res.toPromise();

            expect(valid.isValid).toBe(true);

            expect(await res.getResult()).toBeUndefined();
        });

        it("Async(Valid) and Async(InValid) should return an Async(Invalid)", async () => {
            const res = Async.valid("valid").and(Async.invalid(["invalid"]));
            expect(res.toPromise).toBeDefined();

            const invalid = await res.toPromise();
            expect(invalid.isValid).toBe(false);

            expect(await res.getResult()).toEqual(["invalid"]);
        });

        it("Async(Invalid) and Valid should return Async(Invalid)", async () => {
            const res = Async.invalid(["invalid"]).and(Valid("valid"));
            expect(res.toPromise).toBeDefined();

            const invalid = await res.toPromise();
            expect(invalid.isValid).toBe(false);

            expect(await res.getResult()).toEqual(["invalid"]);
        });

        it("Async(Invalid) and Invalid should return Async(Invalid)", async () => {
            const res = Async.invalid(["invalid1"]).and(Invalid(["invalid2"]));
            expect(res.toPromise).toBeDefined();

            const invalid = await res.toPromise();
            expect(invalid.isValid).toBe(false);

            expect(await res.getResult()).toEqual(["invalid1", "invalid2"]);
        });

        it("Async(Invalid) and Async(Valid) should return an Async(Invalid)", async () => {
            const res = Async.invalid(["invalid"]).and(Async.valid("whatever"));
            expect(res.toPromise).toBeDefined();

            const invalid = await res.toPromise();
            expect(invalid.isValid).toBe(false);

            expect(await res.getResult()).toEqual(["invalid"]);
        });

        it("Async(Invalid) and Async(InValid) should return an Async(Invalid)", async () => {
            const res = Async.invalid(["invalid1"]).and(
                Async.invalid(["invalid2"])
            );
            expect(res.toPromise).toBeDefined();

            const invalid = await res.toPromise();
            expect(invalid.isValid).toBe(false);

            expect(await res.getResult()).toEqual(["invalid1", "invalid2"]);
        });
    });

    describe("or", () => {
        it("Valid or Valid should keep the first Valid value", () => {
            const res = Valid("valid").or(Valid("whatever"));
            expect(res.isValid).toBe(true);
            expect(res.getResult()).toBeUndefined();
        });

        it("Valid or InValid should keep the Valid value", () => {
            const res = Valid("valid").or(Invalid(["invalid"]));
            expect(res.isValid).toBe(true);
            expect(res.getResult()).toBeUndefined();
        });

        it("Valid or Async(Valid) return Async(Valid)", async () => {
            const res = Valid("valid").or(Async.valid("whatever"));
            expect(res.toPromise).toBeDefined();

            const valid = await res.toPromise();
            expect(valid.isValid).toBe(true);

            expect(await res.getResult()).toBeUndefined();
        });

        it("Valid or Async(InValid) should return Async(Valid)", async () => {
            const res = Valid("valid").or(Async.invalid(["invalid"]));
            expect(res.toPromise).toBeDefined();

            const valid = await res.toPromise();
            expect(valid.isValid).toBe(true);

            expect(await res.getResult()).toBeUndefined();
        });

        it("Invalid or Valid should keep the Valid value", () => {
            const res = Invalid(["invalid"]).or(Valid("valid"));
            expect(res.isValid).toBe(true);
            expect(res.getResult()).toBeUndefined();
        });

        it("Invalid or Invalid should concat the Invalid value", () => {
            const res = Invalid(["invalid1"]).or(Invalid(["invalid2"]));
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual(["invalid1", "invalid2"]);
        });

        it("Invalid or Async(Valid) return Async(Valid)", async () => {
            const res = Invalid(["invalid"]).or(Async.valid("valid"));
            expect(res.toPromise).toBeDefined();

            const valid = await res.toPromise();
            expect(valid.isValid).toBe(true);

            expect(await res.getResult()).toBeUndefined();
        });

        it("Invalid or Async(InValid) should return Async(Valid)", async () => {
            const res = Invalid(["invalid1"]).or(Async.invalid(["invalid2"]));
            expect(res.toPromise).toBeDefined();

            const invalid = await res.toPromise();
            expect(invalid.isValid).toBe(false);

            expect(await res.getResult()).toEqual(["invalid1", "invalid2"]);
        });

        it("Async(Valid) or Valid should return Async(Valid)", async () => {
            const res = Async.valid("valid").or(Valid("whatever"));
            expect(res.toPromise).toBeDefined();

            const valid = await res.toPromise();
            expect(valid.isValid).toBe(true);

            expect(await res.getResult()).toBeUndefined();
        });

        it("Async(Valid) or InValid should Return Async(Valid)", async () => {
            const res = Async.valid("valid").or(Invalid(["invalid"]));
            expect(res.toPromise).toBeDefined();

            const valid = await res.toPromise();
            expect(valid.isValid).toBe(true);

            expect(await res.getResult()).toBeUndefined();
        });

        it("Async(Valid) or Async(Valid) return Async(Valid)", async () => {
            const res = Async.valid("valid").or(Async.valid("whatever"));
            expect(res.toPromise).toBeDefined();

            const valid = await res.toPromise();
            expect(valid.isValid).toBe(true);

            expect(await res.getResult()).toBeUndefined();
        });

        it("Async(Valid) or Async(InValid) should return Async(Valid)", async () => {
            const res = Async.valid("valid").or(Async.invalid(["invalid"]));
            expect(res.toPromise).toBeDefined();

            const valid = await res.toPromise();
            expect(valid.isValid).toBe(true);

            expect(await res.getResult()).toBeUndefined();
        });

        it("Async(Invalid) or Valid should return Async(Value)", async () => {
            const res = Async.invalid(["invalid"]).or(Valid("valid"));
            expect(res.toPromise).toBeDefined();

            const valid = await res.toPromise();
            expect(valid.isValid).toBe(true);

            expect(await res.getResult()).toBeUndefined();
        });

        it("Async(Invalid) or Invalid should return Async(Invalid)", async () => {
            const res = Async.invalid(["invalid1"]).or(Invalid(["invalid2"]));
            expect(res.toPromise).toBeDefined();

            const invalid = await res.toPromise();
            expect(invalid.isValid).toBe(false);

            expect(await res.getResult()).toEqual(["invalid1", "invalid2"]);
        });

        it("Async(Invalid) or Async(Valid) return Async(Valid)", async () => {
            const res = Async.invalid(["invalid"]).or(Async.valid("valid"));
            expect(res.toPromise).toBeDefined();

            const valid = await res.toPromise();
            expect(valid.isValid).toBe(true);

            expect(await res.getResult()).toBeUndefined();
        });

        it("Async(Invalid) or Async(InValid) should return Async(Valid)", async () => {
            const res = Async.invalid(["invalid1"]).or(
                Async.invalid(["invalid2"])
            );
            expect(res.toPromise).toBeDefined();

            const invalid = await res.toPromise();
            expect(invalid.isValid).toBe(false);

            expect(await res.getResult()).toEqual(["invalid1", "invalid2"]);
        });
    });
});
