import {
    createValidValidation,
    createInvalidValidation,
} from "./InvertableValidation";

describe("Validation", () => {
    describe("and", () => {
        it("ValidValidation and ValidValidation return a ValidValidation and keep validResults", () => {
            const date = new Date();
            const res = createValidValidation([
                { value: "valid value", message: "isValid" },
            ]).and(
                createValidValidation([
                    { value: "valid value", message: "isCorrect" },
                ])
            );

            expect(res.isValid).toBe(true);
            expect(res.getResult()).toBeUndefined();
            expect(res.validResults).toEqual([
                { value: "valid value", message: "isValid" },
                { value: "valid value", message: "isCorrect" },
            ]);
            expect(res.invalidResults).toEqual([]);
        });

        it("ValidValidation and InvalidValidation should return InvalidValidation and keep validResults and invalidResutls", () => {
            const res = createValidValidation([
                { value: "valid value", message: "valid" },
            ]).and(
                createInvalidValidation([
                    { value: "invalid value", message: "invalid" },
                ])
            );
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual([
                { value: "invalid value", message: "invalid" },
            ]);
            expect(res.validResults).toEqual([
                { value: "valid value", message: "valid" },
            ]);
            expect(res.invalidResults).toEqual([
                { value: "invalid value", message: "invalid" },
            ]);
        });

        it("InvalidValidation and ValidValidation should keep the Invalid value", () => {
            const res = createInvalidValidation([
                { message: "invalid", value: "invalid value" },
            ]).and(
                createValidValidation([
                    { message: "valid", value: "valid value" },
                ])
            );
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual([
                { message: "invalid", value: "invalid value" },
            ]);
            expect(res.invalidResults).toEqual([
                { message: "invalid", value: "invalid value" },
            ]);
            expect(res.validResults).toEqual([
                { message: "valid", value: "valid value" },
            ]);
        });

        it("Invalid and Invalid should concat the two Invalid value", () => {
            const res = createInvalidValidation([
                { message: "invalid1", value: "invalid value" },
            ]).and(
                createInvalidValidation([
                    { message: "invalid2", value: "invalid value" },
                ])
            );
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual([
                { message: "invalid1", value: "invalid value" },
                { message: "invalid2", value: "invalid value" },
            ]);
            expect(res.invalidResults).toEqual([
                { message: "invalid1", value: "invalid value" },
                { message: "invalid2", value: "invalid value" },
            ]);
            expect(res.validResults).toEqual([]);
        });

        it("InvalidValidation and InvalidValidation should also concat their valid results if any", () => {
            const res = createInvalidValidation(
                [{ message: "invalid1", value: "invalid value" }],
                [{ message: "valid1", value: "invalid value" }]
            ).and(
                createInvalidValidation(
                    [{ message: "invalid2", value: "invalid value" }],
                    [{ message: "valid2", value: "invalid value" }]
                )
            );
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual([
                { message: "invalid1", value: "invalid value" },
                { message: "invalid2", value: "invalid value" },
            ]);
            expect(res.invalidResults).toEqual([
                { message: "invalid1", value: "invalid value" },
                { message: "invalid2", value: "invalid value" },
            ]);
            expect(res.validResults).toEqual([
                { message: "valid1", value: "invalid value" },
                { message: "valid2", value: "invalid value" },
            ]);
        });

        it("InvalidValidation and InvalidValidation should also keep its own valid results if any", () => {
            const res = createInvalidValidation(
                [{ message: "invalid1", value: "invalid value" }],
                [{ message: "valid", value: "invalid value" }]
            ).and(
                createInvalidValidation([
                    { message: "invalid2", value: "invalid value" },
                ])
            );
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual([
                { message: "invalid1", value: "invalid value" },
                { message: "invalid2", value: "invalid value" },
            ]);
            expect(res.invalidResults).toEqual([
                { message: "invalid1", value: "invalid value" },
                { message: "invalid2", value: "invalid value" },
            ]);
            expect(res.validResults).toEqual([
                { message: "valid", value: "invalid value" },
            ]);
        });

        it("InvalidValidation and InvalidValidation should also keep the other valid results if any", () => {
            const res = createInvalidValidation([
                { message: "invalid1", value: "invalid value" },
            ]).and(
                createInvalidValidation(
                    [{ message: "invalid2", value: "invalid value" }],
                    [{ message: "valid", value: "invalid value" }]
                )
            );
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual([
                { message: "invalid1", value: "invalid value" },
                { message: "invalid2", value: "invalid value" },
            ]);
            expect(res.invalidResults).toEqual([
                { message: "invalid1", value: "invalid value" },
                { message: "invalid2", value: "invalid value" },
            ]);
            expect(res.validResults).toEqual([
                { message: "valid", value: "invalid value" },
            ]);
        });
    });
});
