import {
    createValidValidation,
    createInvalidValidation,
} from "./InvertableValidation";

describe("Validation", () => {
    describe("and", () => {
        it("ValidValidation and ValidValidation return a ValidValidation", () => {
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

        it("ValidValidation and InvalidValidation should return InvalidValidation", () => {
            const res = createValidValidation([
                { value: "valid value", message: "valid" },
            ]).and(
                createInvalidValidation([
                    { value: "value", message: "invalid" },
                ])
            );
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual([
                { value: "value", message: "invalid" },
            ]);
            expect(res.validResults).toEqual([
                { value: "valid value", message: "valid" },
            ]);
            expect(res.invalidResults).toEqual([
                { value: "value", message: "invalid" },
            ]);
        });

        it("InvalidValidation and ValidValidation should return InvalidValidation", () => {
            const res = createInvalidValidation([
                { message: "invalid", value: "value" },
            ]).and(
                createValidValidation([
                    { message: "valid", value: "valid value" },
                ])
            );
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual([
                { message: "invalid", value: "value" },
            ]);
            expect(res.invalidResults).toEqual([
                { message: "invalid", value: "value" },
            ]);
            expect(res.validResults).toEqual([
                { message: "valid", value: "valid value" },
            ]);
        });

        it("InvalidValidation and InvalidValidation should return InvalidValidation", () => {
            const res = createInvalidValidation(
                [{ message: "invalid1", value: "value" }],
                [{ message: "valid1", value: "value" }]
            ).and(
                createInvalidValidation(
                    [{ message: "invalid2", value: "value" }],
                    [{ message: "valid2", value: "value" }]
                )
            );
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual([
                { message: "invalid1", value: "value" },
                { message: "invalid2", value: "value" },
            ]);
            expect(res.invalidResults).toEqual([
                { message: "invalid1", value: "value" },
                { message: "invalid2", value: "value" },
            ]);
            expect(res.validResults).toEqual([
                { message: "valid1", value: "value" },
                { message: "valid2", value: "value" },
            ]);
        });
    });

    describe("or", () => {
        it("ValidValidation or ValidValidation should keep the Valid value", () => {
            const res = createValidValidation([
                { message: "valid1", value: "value" },
            ]).or(
                createValidValidation([{ message: "valid2", value: "value" }])
            );
            expect(res.isValid).toBe(true);
            expect(res.getResult()).toBeUndefined();
            expect(res.invalidResults).toEqual([]);
            expect(res.validResults).toEqual([
                { message: "valid1", value: "value" },
                { message: "valid2", value: "value" },
            ]);
        });

        it("ValidValidation or InValidValidation should keep the Valid value", () => {
            const res = createValidValidation([
                { message: "valid", value: "value" },
            ]).or(
                createInvalidValidation([
                    { message: "invalid", value: "value" },
                ])
            );
            expect(res.isValid).toBe(true);
            expect(res.getResult()).toBeUndefined();
            expect(res.invalidResults).toEqual([
                { message: "invalid", value: "value" },
            ]);
            expect(res.validResults).toEqual([
                { message: "valid", value: "value" },
            ]);
        });

        it("InvalidValidation or ValidValidation should return ValidValidation", () => {
            const res = createInvalidValidation([
                { message: "invalid", value: "value" },
            ]).or(
                createValidValidation([{ message: "valid", value: "value" }])
            );
            expect(res.isValid).toBe(true);
            expect(res.getResult()).toBeUndefined();
            expect(res.validResults).toEqual([
                { message: "valid", value: "value" },
            ]);
            expect(res.invalidResults).toEqual([
                { message: "invalid", value: "value" },
            ]);
        });

        it("InvalidValidation or InvalidValidation should return InvalidValidation", () => {
            const res = createInvalidValidation(
                [{ message: "invalid1", value: "value" }],
                [{ message: "valid1", value: "value" }]
            ).or(
                createInvalidValidation(
                    [{ message: "invalid2", value: "value" }],
                    [{ message: "valid2", value: "value" }]
                )
            );
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual([
                { message: "invalid1", value: "value" },
                { message: "invalid2", value: "value" },
            ]);
            expect(res.validResults).toEqual([
                { message: "valid1", value: "value" },
                { message: "valid2", value: "value" },
            ]);
            expect(res.invalidResults).toEqual([
                { message: "invalid1", value: "value" },
                { message: "invalid2", value: "value" },
            ]);
        });
    });
});
