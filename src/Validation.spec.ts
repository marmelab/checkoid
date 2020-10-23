import { Valid, Invalid, Async } from "./Validation";

describe("Validation", () => {
    describe("and", () => {
        it("Valid and Valid should keep the first Valid value", () => {
            const res = Valid().and(Valid());

            expect(res.isValid).toBe(true);
            expect(res.getResult()).toBeUndefined();
        });

        it("Valid and Invalid should keep the Invalid value", () => {
            const res = Valid().and(
                Invalid([{ message: "invalid", value: "invalid value" }])
            );
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual([
                { message: "invalid", value: "invalid value" },
            ]);
        });

        it("Valid and Async(Valid) should return an Async(Valid)", async () => {
            const res = Valid().and(Async.valid());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBe(undefined);

            expect(await res.getResult()).toBeUndefined();
        });

        it("Valid and Async(InValid) should return an Async(Invalid)", async () => {
            const res = Valid().and(
                Async.invalid([{ message: "invalid", value: "invalid value" }])
            );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                { message: "invalid", value: "invalid value" },
            ]);
        });

        it("InValid and Valid should keep the Invalid value", () => {
            const res = Invalid([
                { message: "invalid", value: "invalid value" },
            ]).and(Valid());
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual([
                { message: "invalid", value: "invalid value" },
            ]);
        });

        it("Invalid and Invalid should concat the two Invalid value", () => {
            const res = Invalid([
                { message: "invalid1", value: "invalid value" },
            ]).and(Invalid([{ message: "invalid2", value: "invalid value" }]));
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual([
                { message: "invalid1", value: "invalid value" },
                { message: "invalid2", value: "invalid value" },
            ]);
        });

        it("Invalid and Async(Valid) should return an Async(Invalid)", async () => {
            const res = Invalid([
                { message: "invalid", value: "invalid value" },
            ]).and(Async.valid());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                { message: "invalid", value: "invalid value" },
            ]);
        });

        it("Invalid and Async(InValid) should return an Async(Invalid)", async () => {
            const res = Invalid([
                { message: "invalid1", value: "invalid value" },
            ]).and(
                Async.invalid([{ message: "invalid2", value: "invalid value" }])
            );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                { message: "invalid1", value: "invalid value" },
                { message: "invalid2", value: "invalid value" },
            ]);
        });

        it("Async(Valid) and Valid should return Async(Valid)", async () => {
            const res = Async.valid().and(Valid());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("Async(Valid) and Invalid should return Async(Invalid)", async () => {
            const res = Async.valid().and(
                Invalid([{ message: "invalid", value: "invalid value" }])
            );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                { message: "invalid", value: "invalid value" },
            ]);
        });

        it("Async(Valid) and Async(Valid) should return an Async(Valid)", async () => {
            const res = Async.valid().and(Async.valid());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("Async(Valid) and Async(InValid) should return an Async(Invalid)", async () => {
            const res = Async.valid().and(
                Async.invalid([{ message: "invalid", value: "invalid value" }])
            );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                { message: "invalid", value: "invalid value" },
            ]);
        });

        it("Async(Invalid) and Valid should return Async(Invalid)", async () => {
            const res = Async.invalid([
                { message: "invalid", value: "invalid value" },
            ]).and(Valid());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                { message: "invalid", value: "invalid value" },
            ]);
        });

        it("Async(Invalid) and Invalid should return Async(Invalid)", async () => {
            const res = Async.invalid([
                { message: "invalid1", value: "invalid value" },
            ]).and(Invalid([{ message: "invalid2", value: "invalid value" }]));
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                { message: "invalid1", value: "invalid value" },
                { message: "invalid2", value: "invalid value" },
            ]);
        });

        it("Async(Invalid) and Async(Valid) should return an Async(Invalid)", async () => {
            const res = Async.invalid([
                { message: "invalid", value: "invalid value" },
            ]).and(Async.valid());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                { message: "invalid", value: "invalid value" },
            ]);
        });

        it("Async(Invalid) and Async(InValid) should return an Async(Invalid)", async () => {
            const res = Async.invalid([
                { message: "invalid1", value: "invalid value" },
            ]).and(
                Async.invalid([{ message: "invalid2", value: "invalid value" }])
            );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                { message: "invalid1", value: "invalid value" },
                { message: "invalid2", value: "invalid value" },
            ]);
        });
    });

    describe("or", () => {
        it("Valid or Valid should keep the first Valid value", () => {
            const res = Valid().or(Valid());
            expect(res.isValid).toBe(true);
            expect(res.getResult()).toBeUndefined();
        });

        it("Valid or InValid should keep the Valid value", () => {
            const res = Valid().or(
                Invalid([{ message: "invalid", value: "invalid value" }])
            );
            expect(res.isValid).toBe(true);
            expect(res.getResult()).toBeUndefined();
        });

        it("Valid or Async(Valid) return Async(Valid)", async () => {
            const res = Valid().or(Async.valid());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("Valid or Async(InValid) should return Async(Valid)", async () => {
            const res = Valid().or(
                Async.invalid([{ message: "invalid", value: "invalid value" }])
            );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("Invalid or Valid should keep the Valid value", () => {
            const res = Invalid([
                { message: "invalid", value: "invalid value" },
            ]).or(Valid());
            expect(res.isValid).toBe(true);
            expect(res.getResult()).toBeUndefined();
        });

        it("Invalid or Invalid should concat the Invalid value", () => {
            const res = Invalid([
                { message: "invalid1", value: "invalid value" },
            ]).or(Invalid([{ message: "invalid2", value: "invalid value" }]));
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual([
                { message: "invalid1", value: "invalid value" },
                { message: "invalid2", value: "invalid value" },
            ]);
        });

        it("Invalid or Async(Valid) return Async(Valid)", async () => {
            const res = Invalid([
                { message: "invalid", value: "invalid value" },
            ]).or(Async.valid());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("Invalid or Async(InValid) should return Async(Valid)", async () => {
            const res = Invalid([
                { message: "invalid1", value: "invalid value" },
            ]).or(
                Async.invalid([{ message: "invalid2", value: "invalid value" }])
            );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                { message: "invalid1", value: "invalid value" },
                { message: "invalid2", value: "invalid value" },
            ]);
        });

        it("Async(Valid) or Valid should return Async(Valid)", async () => {
            const res = Async.valid().or(Valid());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("Async(Valid) or InValid should Return Async(Valid)", async () => {
            const res = Async.valid().or(
                Invalid([{ message: "invalid", value: "invalid value" }])
            );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("Async(Valid) or Async(Valid) return Async(Valid)", async () => {
            const res = Async.valid().or(Async.valid());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("Async(Valid) or Async(InValid) should return Async(Valid)", async () => {
            const res = Async.valid().or(
                Async.invalid([{ message: "invalid", value: "invalid value" }])
            );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("Async(Invalid) or Valid should return Async(Value)", async () => {
            const res = Async.invalid([
                { message: "invalid", value: "invalid value" },
            ]).or(Valid());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("Async(Invalid) or Invalid should return Async(Invalid)", async () => {
            const res = Async.invalid([
                { message: "invalid1", value: "invalid value" },
            ]).or(Invalid([{ message: "invalid2", value: "invalid value" }]));
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                { message: "invalid1", value: "invalid value" },
                { message: "invalid2", value: "invalid value" },
            ]);
        });

        it("Async(Invalid) or Async(Valid) return Async(Valid)", async () => {
            const res = Async.invalid([
                { message: "invalid", value: "invalid value" },
            ]).or(Async.valid());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("Async(Invalid) or Async(InValid) should return Async(Valid)", async () => {
            const res = Async.invalid([
                { message: "invalid1", value: "invalid value" },
            ]).or(
                Async.invalid([{ message: "invalid2", value: "invalid value" }])
            );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                { message: "invalid1", value: "invalid value" },
                { message: "invalid2", value: "invalid value" },
            ]);
        });
    });
});
