import {
    createValidValidation,
    createInvalidValidation,
} from "./InvertableValidation";

describe("Validation", () => {
    describe("and", () => {
        it("ValidValidation and ValidValidation return a ValidValidation", () => {
            const date = new Date();
            const res = createValidValidation(
                [{ value: "value", predicate: "isFoo", valid: true }],
                [{ value: "value", predicate: "isBar", valid: false }]
            ).and(
                createValidValidation(
                    [{ value: "value", predicate: "isBaz", valid: true }],
                    [{ value: "value", predicate: "isQux", valid: false }]
                )
            );

            expect(res.isValid).toBe(true);
            expect(res.getResult()).toBeUndefined();
            expect(res.validResults).toEqual([
                { value: "value", predicate: "isFoo", valid: true },
                { value: "value", predicate: "isBaz", valid: true },
            ]);
            expect(res.invalidResults).toEqual([
                { value: "value", predicate: "isBar", valid: false },
                { value: "value", predicate: "isQux", valid: false },
            ]);
        });

        it("ValidValidation and InvalidValidation should return InvalidValidation", () => {
            const res = createValidValidation(
                [{ value: "value", predicate: "isFoo", valid: true }],
                [{ value: "value", predicate: "isBar", valid: false }]
            ).and(
                createInvalidValidation(
                    [{ value: "value", predicate: "isBaz", valid: false }],
                    [{ value: "value", predicate: "isQux", valid: true }]
                )
            );
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual([
                { value: "value", predicate: "isBar", valid: false },
                { value: "value", predicate: "isBaz", valid: false },
            ]);
            expect(res.validResults).toEqual([
                { value: "value", predicate: "isFoo", valid: true },
                { value: "value", predicate: "isQux", valid: true },
            ]);
            expect(res.invalidResults).toEqual([
                { value: "value", predicate: "isBar", valid: false },
                { value: "value", predicate: "isBaz", valid: false },
            ]);
        });

        it("InvalidValidation and ValidValidation should return InvalidValidation", () => {
            const res = createInvalidValidation(
                [{ value: "value", predicate: "isFoo", valid: false }],
                [{ value: "value", predicate: "isBar", valid: true }]
            ).and(
                createValidValidation(
                    [{ value: "value", predicate: "isBaz", valid: true }],
                    [{ value: "value", predicate: "isQux", valid: false }]
                )
            );
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual([
                { value: "value", predicate: "isFoo", valid: false },
                { value: "value", predicate: "isQux", valid: false },
            ]);
            expect(res.invalidResults).toEqual([
                { value: "value", predicate: "isFoo", valid: false },
                { value: "value", predicate: "isQux", valid: false },
            ]);
            expect(res.validResults).toEqual([
                { value: "value", predicate: "isBar", valid: true },
                { value: "value", predicate: "isBaz", valid: true },
            ]);
        });

        it("InvalidValidation and InvalidValidation should return InvalidValidation", () => {
            const res = createInvalidValidation(
                [{ value: "value", predicate: "isFoo", valid: false }],
                [{ value: "value", predicate: "isBar", valid: true }]
            ).and(
                createInvalidValidation(
                    [{ value: "value", predicate: "isBaz", valid: false }],
                    [{ value: "value", predicate: "isQux", valid: true }]
                )
            );
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual([
                { value: "value", predicate: "isFoo", valid: false },
                { value: "value", predicate: "isBaz", valid: false },
            ]);
            expect(res.invalidResults).toEqual([
                { value: "value", predicate: "isFoo", valid: false },
                { value: "value", predicate: "isBaz", valid: false },
            ]);
            expect(res.validResults).toEqual([
                { value: "value", predicate: "isBar", valid: true },
                { value: "value", predicate: "isQux", valid: true },
            ]);
        });
    });

    describe("or", () => {
        it("ValidValidation or ValidValidation should keep the Valid value", () => {
            const res = createValidValidation(
                [{ value: "value", predicate: "isFoo", valid: true }],
                [{ value: "value", predicate: "isBar", valid: false }]
            ).or(
                createValidValidation(
                    [{ value: "value", predicate: "isBaz", valid: true }],
                    [{ value: "value", predicate: "isQux", valid: false }]
                )
            );
            expect(res.isValid).toBe(true);
            expect(res.getResult()).toBeUndefined();
            expect(res.invalidResults).toEqual([
                { value: "value", predicate: "isBar", valid: false },
                { value: "value", predicate: "isQux", valid: false },
            ]);
            expect(res.validResults).toEqual([
                { value: "value", predicate: "isFoo", valid: true },
                { value: "value", predicate: "isBaz", valid: true },
            ]);
        });

        it("ValidValidation or InValidValidation should keep the Valid value", () => {
            const res = createValidValidation(
                [{ value: "value", predicate: "isFoo", valid: true }],
                [{ value: "value", predicate: "isBar", valid: false }]
            ).or(
                createInvalidValidation(
                    [{ value: "value", predicate: "isBaz", valid: false }],
                    [{ value: "value", predicate: "isQux", valid: true }]
                )
            );
            expect(res.isValid).toBe(true);
            expect(res.getResult()).toBeUndefined();
            expect(res.invalidResults).toEqual([
                { value: "value", predicate: "isBar", valid: false },
                { value: "value", predicate: "isBaz", valid: false },
            ]);
            expect(res.validResults).toEqual([
                { value: "value", predicate: "isFoo", valid: true },
                { value: "value", predicate: "isQux", valid: true },
            ]);
        });

        it("InvalidValidation or ValidValidation should return ValidValidation", () => {
            const res = createInvalidValidation(
                [{ value: "value", predicate: "isFoo", valid: false }],
                [{ value: "value", predicate: "isBar", valid: true }]
            ).or(
                createValidValidation(
                    [{ value: "value", predicate: "isBaz", valid: true }],
                    [{ value: "value", predicate: "isQux", valid: false }]
                )
            );
            expect(res.isValid).toBe(true);
            expect(res.getResult()).toBeUndefined();
            expect(res.validResults).toEqual([
                { value: "value", predicate: "isBar", valid: true },
                { value: "value", predicate: "isBaz", valid: true },
            ]);
            expect(res.invalidResults).toEqual([
                { value: "value", predicate: "isFoo", valid: false },
                { value: "value", predicate: "isQux", valid: false },
            ]);
        });

        it("InvalidValidation or InvalidValidation should return InvalidValidation", () => {
            const res = createInvalidValidation(
                [{ value: "value", predicate: "isFoo", valid: false }],
                [{ value: "value", predicate: "isBar", valid: true }]
            ).or(
                createInvalidValidation(
                    [{ value: "value", predicate: "isBaz", valid: false }],
                    [{ value: "value", predicate: "isQux", valid: true }]
                )
            );
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual([
                { value: "value", predicate: "isFoo", valid: false },
                { value: "value", predicate: "isBaz", valid: false },
            ]);
            expect(res.validResults).toEqual([
                { value: "value", predicate: "isBar", valid: true },
                { value: "value", predicate: "isQux", valid: true },
            ]);
            expect(res.invalidResults).toEqual([
                { value: "value", predicate: "isFoo", valid: false },
                { value: "value", predicate: "isBaz", valid: false },
            ]);
        });
    });

    describe("not", () => {
        it("should convert ValidValidation to InvalidValidation", () => {
            const res = createValidValidation(
                [{ value: "value", predicate: "isFoo", valid: true }],
                [{ value: "value", predicate: "isBar", valid: false }]
            ).not();

            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual([
                { value: "value", predicate: "isFoo", valid: true },
            ]);
            expect(res.validResults).toEqual([
                { value: "value", predicate: "isBar", valid: false },
            ]);
            expect(res.invalidResults).toEqual([
                { value: "value", predicate: "isFoo", valid: true },
            ]);
        });

        it("should convert InvalidValidation to ValidValidation", () => {
            const res = createInvalidValidation(
                [{ value: "value", predicate: "isFoo", valid: false }],
                [{ value: "value", predicate: "isBar", valid: true }]
            ).not();

            expect(res.isValid).toBe(true);
            expect(res.getResult()).toBeUndefined();
            expect(res.validResults).toEqual([
                { value: "value", predicate: "isFoo", valid: false },
            ]);
            expect(res.invalidResults).toEqual([
                { value: "value", predicate: "isBar", valid: true },
            ]);
        });
    });
});
