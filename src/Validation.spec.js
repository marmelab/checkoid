const Validation = require("./Validation");
const { Valid, Invalid } = Validation;

describe("Validation", () => {
    describe("and", () => {
        it("Valid and Valid should keep the first Valid value", () => {
            const res = Valid("valid").and(Valid("whatever"));
            expect(res.isValid).toBe(true);
            expect(res.x).toBe("valid");
        });

        it("Valid and Invalid should keep the Invalid value", () => {
            const res = Valid("valid").and(Invalid(["invalid"]));
            expect(res.isValid).toBe(false);
            expect(res.x).toEqual(["invalid"]);
        });

        it("InValid and Valid should keep the Invalid value", () => {
            const res = Invalid(["invalid"]).and(Valid("valid"));
            expect(res.isValid).toBe(false);
            expect(res.x).toEqual(["invalid"]);
        });

        it("Invalid and Invalid should concat the two Invalid value", () => {
            const res = Invalid(["invalid1"]).and(Invalid(["invalid2"]));
            expect(res.isValid).toBe(false);
            expect(res.x).toEqual(["invalid1", "invalid2"]);
        });
    });

    describe("or", () => {
        it("Valid or Valid should keep the first Valid value", () => {
            const res = Valid("valid").or(Valid("whatever"));
            expect(res.isValid).toBe(true);
            expect(res.x).toBe("valid");
        });

        it("Valid or InValid should keep the Valid value", () => {
            const res = Valid("valid").or(Invalid(["invalid"]));
            expect(res.isValid).toBe(true);
            expect(res.x).toBe("valid");
        });

        it("Invalid or Valid should keep the Valid value", () => {
            const res = Invalid(["invalid"]).or(Valid("valid"));
            expect(res.isValid).toBe(true);
            expect(res.x).toBe("valid");
        });

        it("Invalid or Invalid should concat the Invalid value", () => {
            const res = Invalid(["invalid1"]).or(Invalid(["invalid2"]));
            expect(res.isValid).toBe(false);
            expect(res.x).toEqual(["invalid1", "invalid2"]);
        });
    });
});
