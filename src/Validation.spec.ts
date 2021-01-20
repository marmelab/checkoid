import {
    validValidation,
    invalidValidation,
    asyncValidation,
} from "./Validation";

describe("Validation", () => {
    describe("and", () => {
        it("Valid and Valid should keep the first Valid value", () => {
            const res = validValidation().and(validValidation());

            expect(res.isValid).toBe(true);
            expect(res.getResult()).toBeUndefined();
        });

        it("Valid and Invalid should keep the Invalid value", () => {
            const res = validValidation().and(
                invalidValidation([
                    { message: "invalid", value: "invalid value" },
                ])
            );
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual([
                { message: "invalid", value: "invalid value" },
            ]);
        });

        it("Valid and asyncValidation(Valid) should return an asyncValidation(Valid)", async () => {
            const res = validValidation().and(
                asyncValidation.validValidation()
            );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBe(undefined);

            expect(await res.getResult()).toBeUndefined();
        });

        it("Valid and asyncValidation(InValid) should return an asyncValidation(Invalid)", async () => {
            const res = validValidation().and(
                asyncValidation.invalidValidation([
                    { message: "invalid", value: "invalid value" },
                ])
            );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                { message: "invalid", value: "invalid value" },
            ]);
        });

        it("InValid and Valid should keep the Invalid value", () => {
            const res = invalidValidation([
                { message: "invalid", value: "invalid value" },
            ]).and(validValidation());
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual([
                { message: "invalid", value: "invalid value" },
            ]);
        });

        it("Invalid and Invalid should concat the two Invalid value", () => {
            const res = invalidValidation([
                { message: "invalid1", value: "invalid value" },
            ]).and(
                invalidValidation([
                    { message: "invalid2", value: "invalid value" },
                ])
            );
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual([
                { message: "invalid1", value: "invalid value" },
                { message: "invalid2", value: "invalid value" },
            ]);
        });

        it("Invalid and asyncValidation(Valid) should return an asyncValidation(Invalid)", async () => {
            const res = invalidValidation([
                { message: "invalid", value: "invalid value" },
            ]).and(asyncValidation.validValidation());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                { message: "invalid", value: "invalid value" },
            ]);
        });

        it("Invalid and asyncValidation(InValid) should return an asyncValidation(Invalid)", async () => {
            const res = invalidValidation([
                { message: "invalid1", value: "invalid value" },
            ]).and(
                asyncValidation.invalidValidation([
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
            const res = asyncValidation
                .validValidation()
                .and(validValidation());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("asyncValidation(Valid) and Invalid should return asyncValidation(Invalid)", async () => {
            const res = asyncValidation
                .validValidation()
                .and(
                    invalidValidation([
                        { message: "invalid", value: "invalid value" },
                    ])
                );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                { message: "invalid", value: "invalid value" },
            ]);
        });

        it("asyncValidation(Valid) and asyncValidation(Valid) should return an asyncValidation(Valid)", async () => {
            const res = asyncValidation
                .validValidation()
                .and(asyncValidation.validValidation());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("asyncValidation(Valid) and asyncValidation(InValid) should return an asyncValidation(Invalid)", async () => {
            const res = asyncValidation
                .validValidation()
                .and(
                    asyncValidation.invalidValidation([
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
                .invalidValidation([
                    { message: "invalid", value: "invalid value" },
                ])
                .and(validValidation());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                { message: "invalid", value: "invalid value" },
            ]);
        });

        it("asyncValidation(Invalid) and Invalid should return asyncValidation(Invalid)", async () => {
            const res = asyncValidation
                .invalidValidation([
                    { message: "invalid1", value: "invalid value" },
                ])
                .and(
                    invalidValidation([
                        { message: "invalid2", value: "invalid value" },
                    ])
                );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                { message: "invalid1", value: "invalid value" },
                { message: "invalid2", value: "invalid value" },
            ]);
        });

        it("asyncValidation(Invalid) and asyncValidation(Valid) should return an asyncValidation(Invalid)", async () => {
            const res = asyncValidation
                .invalidValidation([
                    { message: "invalid", value: "invalid value" },
                ])
                .and(asyncValidation.validValidation());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                { message: "invalid", value: "invalid value" },
            ]);
        });

        it("asyncValidation(Invalid) and asyncValidation(InValid) should return an asyncValidation(Invalid)", async () => {
            const res = asyncValidation
                .invalidValidation([
                    { message: "invalid1", value: "invalid value" },
                ])
                .and(
                    asyncValidation.invalidValidation([
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
            const res = validValidation().or(validValidation());
            expect(res.isValid).toBe(true);
            expect(res.getResult()).toBeUndefined();
        });

        it("Valid or InValid should keep the Valid value", () => {
            const res = validValidation().or(
                invalidValidation([
                    { message: "invalid", value: "invalid value" },
                ])
            );
            expect(res.isValid).toBe(true);
            expect(res.getResult()).toBeUndefined();
        });

        it("Valid or asyncValidation(Valid) return asyncValidation(Valid)", async () => {
            const res = validValidation().or(asyncValidation.validValidation());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("Valid or asyncValidation(InValid) should return asyncValidation(Valid)", async () => {
            const res = validValidation().or(
                asyncValidation.invalidValidation([
                    { message: "invalid", value: "invalid value" },
                ])
            );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("Invalid or Valid should keep the Valid value", () => {
            const res = invalidValidation([
                { message: "invalid", value: "invalid value" },
            ]).or(validValidation());
            expect(res.isValid).toBe(true);
            expect(res.getResult()).toBeUndefined();
        });

        it("Invalid or Invalid should concat the Invalid value", () => {
            const res = invalidValidation([
                { message: "invalid1", value: "invalid value" },
            ]).or(
                invalidValidation([
                    { message: "invalid2", value: "invalid value" },
                ])
            );
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual([
                { message: "invalid1", value: "invalid value" },
                { message: "invalid2", value: "invalid value" },
            ]);
        });

        it("Invalid or asyncValidation(Valid) return asyncValidation(Valid)", async () => {
            const res = invalidValidation([
                { message: "invalid", value: "invalid value" },
            ]).or(asyncValidation.validValidation());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("Invalid or asyncValidation(InValid) should return asyncValidation(Valid)", async () => {
            const res = invalidValidation([
                { message: "invalid1", value: "invalid value" },
            ]).or(
                asyncValidation.invalidValidation([
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
            const res = asyncValidation.validValidation().or(validValidation());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("asyncValidation(Valid) or InValid should Return asyncValidation(Valid)", async () => {
            const res = asyncValidation
                .validValidation()
                .or(
                    invalidValidation([
                        { message: "invalid", value: "invalid value" },
                    ])
                );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("asyncValidation(Valid) or asyncValidation(Valid) return asyncValidation(Valid)", async () => {
            const res = asyncValidation
                .validValidation()
                .or(asyncValidation.validValidation());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("asyncValidation(Valid) or asyncValidation(InValid) should return asyncValidation(Valid)", async () => {
            const res = asyncValidation
                .validValidation()
                .or(
                    asyncValidation.invalidValidation([
                        { message: "invalid", value: "invalid value" },
                    ])
                );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("asyncValidation(Invalid) or Valid should return asyncValidation(Value)", async () => {
            const res = asyncValidation
                .invalidValidation([
                    { message: "invalid", value: "invalid value" },
                ])
                .or(validValidation());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("asyncValidation(Invalid) or Invalid should return asyncValidation(Invalid)", async () => {
            const res = asyncValidation
                .invalidValidation([
                    { message: "invalid1", value: "invalid value" },
                ])
                .or(
                    invalidValidation([
                        { message: "invalid2", value: "invalid value" },
                    ])
                );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                { message: "invalid1", value: "invalid value" },
                { message: "invalid2", value: "invalid value" },
            ]);
        });

        it("asyncValidation(Invalid) or asyncValidation(Valid) return asyncValidation(Valid)", async () => {
            const res = asyncValidation
                .invalidValidation([
                    { message: "invalid", value: "invalid value" },
                ])
                .or(asyncValidation.validValidation());
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("asyncValidation(Invalid) or asyncValidation(InValid) should return asyncValidation(Valid)", async () => {
            const res = asyncValidation
                .invalidValidation([
                    { message: "invalid1", value: "invalid value" },
                ])
                .or(
                    asyncValidation.invalidValidation([
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
