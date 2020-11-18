import { valid, invalid, asyncValidation } from "./Validation";

describe("Validation", () => {
    describe("and", () => {
        it("Valid and Valid should keep the first Valid value", () => {
            const res = valid().and(valid());

            expect(res.isValid).toBe(true);
            expect(res.getResult()).toBeUndefined();
        });

        it("Valid and Invalid should keep the Invalid value", () => {
            const res = valid().and(
                invalid([{ message: "invalid", value: "invalid value" }])
            );
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual([
                { message: "invalid", value: "invalid value" },
            ]);
        });

        it("Valid and asyncValidation(Valid) should return an asyncValidation(Valid)", async () => {
            const res = valid().and(asyncValidation.valid());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBe(undefined);

            expect(await res.getResult()).toBeUndefined();
        });

        it("Valid and asyncValidation(InValid) should return an asyncValidation(Invalid)", async () => {
            const res = valid().and(
                asyncValidation.invalid([
                    { message: "invalid", value: "invalid value" },
                ])
            );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                { message: "invalid", value: "invalid value" },
            ]);
        });

        it("InValid and Valid should keep the Invalid value", () => {
            const res = invalid([
                { message: "invalid", value: "invalid value" },
            ]).and(valid());
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual([
                { message: "invalid", value: "invalid value" },
            ]);
        });

        it("Invalid and Invalid should concat the two Invalid value", () => {
            const res = invalid([
                { message: "invalid1", value: "invalid value" },
            ]).and(invalid([{ message: "invalid2", value: "invalid value" }]));
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual([
                { message: "invalid1", value: "invalid value" },
                { message: "invalid2", value: "invalid value" },
            ]);
        });

        it("Invalid and asyncValidation(Valid) should return an asyncValidation(Invalid)", async () => {
            const res = invalid([
                { message: "invalid", value: "invalid value" },
            ]).and(asyncValidation.valid());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                { message: "invalid", value: "invalid value" },
            ]);
        });

        it("Invalid and asyncValidation(InValid) should return an asyncValidation(Invalid)", async () => {
            const res = invalid([
                { message: "invalid1", value: "invalid value" },
            ]).and(
                asyncValidation.invalid([
                    { message: "invalid2", value: "invalid value" },
                ])
            );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                { message: "invalid1", value: "invalid value" },
                { message: "invalid2", value: "invalid value" },
            ]);
        });

        it("asyncValidation(Valid) and Valid should return asyncValidation(Valid)", async () => {
            const res = asyncValidation.valid().and(valid());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("asyncValidation(Valid) and Invalid should return asyncValidation(Invalid)", async () => {
            const res = asyncValidation
                .valid()
                .and(invalid([{ message: "invalid", value: "invalid value" }]));
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                { message: "invalid", value: "invalid value" },
            ]);
        });

        it("asyncValidation(Valid) and asyncValidation(Valid) should return an asyncValidation(Valid)", async () => {
            const res = asyncValidation.valid().and(asyncValidation.valid());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("asyncValidation(Valid) and asyncValidation(InValid) should return an asyncValidation(Invalid)", async () => {
            const res = asyncValidation
                .valid()
                .and(
                    asyncValidation.invalid([
                        { message: "invalid", value: "invalid value" },
                    ])
                );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                { message: "invalid", value: "invalid value" },
            ]);
        });

        it("asyncValidation(Invalid) and Valid should return asyncValidation(Invalid)", async () => {
            const res = asyncValidation
                .invalid([{ message: "invalid", value: "invalid value" }])
                .and(valid());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                { message: "invalid", value: "invalid value" },
            ]);
        });

        it("asyncValidation(Invalid) and Invalid should return asyncValidation(Invalid)", async () => {
            const res = asyncValidation
                .invalid([{ message: "invalid1", value: "invalid value" }])
                .and(
                    invalid([{ message: "invalid2", value: "invalid value" }])
                );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                { message: "invalid1", value: "invalid value" },
                { message: "invalid2", value: "invalid value" },
            ]);
        });

        it("asyncValidation(Invalid) and asyncValidation(Valid) should return an asyncValidation(Invalid)", async () => {
            const res = asyncValidation
                .invalid([{ message: "invalid", value: "invalid value" }])
                .and(asyncValidation.valid());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                { message: "invalid", value: "invalid value" },
            ]);
        });

        it("asyncValidation(Invalid) and asyncValidation(InValid) should return an asyncValidation(Invalid)", async () => {
            const res = asyncValidation
                .invalid([{ message: "invalid1", value: "invalid value" }])
                .and(
                    asyncValidation.invalid([
                        { message: "invalid2", value: "invalid value" },
                    ])
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
            const res = valid().or(valid());
            expect(res.isValid).toBe(true);
            expect(res.getResult()).toBeUndefined();
        });

        it("Valid or InValid should keep the Valid value", () => {
            const res = valid().or(
                invalid([{ message: "invalid", value: "invalid value" }])
            );
            expect(res.isValid).toBe(true);
            expect(res.getResult()).toBeUndefined();
        });

        it("Valid or asyncValidation(Valid) return asyncValidation(Valid)", async () => {
            const res = valid().or(asyncValidation.valid());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("Valid or asyncValidation(InValid) should return asyncValidation(Valid)", async () => {
            const res = valid().or(
                asyncValidation.invalid([
                    { message: "invalid", value: "invalid value" },
                ])
            );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("Invalid or Valid should keep the Valid value", () => {
            const res = invalid([
                { message: "invalid", value: "invalid value" },
            ]).or(valid());
            expect(res.isValid).toBe(true);
            expect(res.getResult()).toBeUndefined();
        });

        it("Invalid or Invalid should concat the Invalid value", () => {
            const res = invalid([
                { message: "invalid1", value: "invalid value" },
            ]).or(invalid([{ message: "invalid2", value: "invalid value" }]));
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual([
                { message: "invalid1", value: "invalid value" },
                { message: "invalid2", value: "invalid value" },
            ]);
        });

        it("Invalid or asyncValidation(Valid) return asyncValidation(Valid)", async () => {
            const res = invalid([
                { message: "invalid", value: "invalid value" },
            ]).or(asyncValidation.valid());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("Invalid or asyncValidation(InValid) should return asyncValidation(Valid)", async () => {
            const res = invalid([
                { message: "invalid1", value: "invalid value" },
            ]).or(
                asyncValidation.invalid([
                    { message: "invalid2", value: "invalid value" },
                ])
            );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                { message: "invalid1", value: "invalid value" },
                { message: "invalid2", value: "invalid value" },
            ]);
        });

        it("asyncValidation(Valid) or Valid should return asyncValidation(Valid)", async () => {
            const res = asyncValidation.valid().or(valid());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("asyncValidation(Valid) or InValid should Return asyncValidation(Valid)", async () => {
            const res = asyncValidation
                .valid()
                .or(invalid([{ message: "invalid", value: "invalid value" }]));
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("asyncValidation(Valid) or asyncValidation(Valid) return asyncValidation(Valid)", async () => {
            const res = asyncValidation.valid().or(asyncValidation.valid());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("asyncValidation(Valid) or asyncValidation(InValid) should return asyncValidation(Valid)", async () => {
            const res = asyncValidation
                .valid()
                .or(
                    asyncValidation.invalid([
                        { message: "invalid", value: "invalid value" },
                    ])
                );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("asyncValidation(Invalid) or Valid should return asyncValidation(Value)", async () => {
            const res = asyncValidation
                .invalid([{ message: "invalid", value: "invalid value" }])
                .or(valid());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("asyncValidation(Invalid) or Invalid should return asyncValidation(Invalid)", async () => {
            const res = asyncValidation
                .invalid([{ message: "invalid1", value: "invalid value" }])
                .or(invalid([{ message: "invalid2", value: "invalid value" }]));
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                { message: "invalid1", value: "invalid value" },
                { message: "invalid2", value: "invalid value" },
            ]);
        });

        it("asyncValidation(Invalid) or asyncValidation(Valid) return asyncValidation(Valid)", async () => {
            const res = asyncValidation
                .invalid([{ message: "invalid", value: "invalid value" }])
                .or(asyncValidation.valid());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("asyncValidation(Invalid) or asyncValidation(InValid) should return asyncValidation(Valid)", async () => {
            const res = asyncValidation
                .invalid([{ message: "invalid1", value: "invalid value" }])
                .or(
                    asyncValidation.invalid([
                        { message: "invalid2", value: "invalid value" },
                    ])
                );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                { message: "invalid1", value: "invalid value" },
                { message: "invalid2", value: "invalid value" },
            ]);
        });
    });
});
