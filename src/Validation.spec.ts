import {
    createValidValidation,
    createInvalidValidation,
    createAsyncValidation,
} from "./Validation";

describe("Validation", () => {
    describe("and", () => {
        it("ValidValidation and ValidValidation return a ValidValidation", () => {
            const date = new Date();
            const res = createValidValidation([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: true,
                    inverted: false,
                },
            ]).and(
                createValidValidation([
                    {
                        value: "value",
                        predicate: "isBar",
                        valid: true,
                        inverted: false,
                    },
                ])
            );

            expect(res.isValid).toBe(true);
            expect(res.getResult()).toBeUndefined();
            expect(res.results).toEqual([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: true,
                    inverted: false,
                },
                {
                    value: "value",
                    predicate: "isBar",
                    valid: true,
                    inverted: false,
                },
            ]);
        });

        it("ValidValidation and InvalidValidation should return InvalidValidation", () => {
            const res = createValidValidation([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: true,
                    inverted: false,
                },
            ]).and(
                createInvalidValidation([
                    {
                        value: "value",
                        predicate: "isBar",
                        valid: false,
                        inverted: false,
                    },
                ])
            );
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual([
                {
                    value: "value",
                    predicate: "isBar",
                    valid: false,
                    inverted: false,
                },
            ]);
            expect(res.results).toEqual([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: true,
                    inverted: false,
                },
                {
                    value: "value",
                    predicate: "isBar",
                    valid: false,
                    inverted: false,
                },
            ]);
        });

        it("ValidValidation and AsyncValidation(ValidValidation) should return an AsyncValidation(ValidValidation)", async () => {
            const res = createValidValidation([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: true,
                    inverted: false,
                },
            ]).and(
                createAsyncValidation.validValidation([
                    {
                        value: "value",
                        predicate: "isBar",
                        valid: true,
                        inverted: false,
                    },
                ])
            );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("Valid and AsyncValidation(InValidValidation) should return an AsyncValidation(InvalidValidation)", async () => {
            const res = createValidValidation([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: true,
                    inverted: false,
                },
            ]).and(
                createAsyncValidation.invalidValidation([
                    {
                        value: "value",
                        predicate: "isBar",
                        valid: false,
                        inverted: false,
                    },
                ])
            );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                {
                    value: "value",
                    predicate: "isBar",
                    valid: false,
                    inverted: false,
                },
            ]);
        });

        it("InvalidValidation and ValidValidation should return InvalidValidation", () => {
            const res = createInvalidValidation([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: false,
                },
            ]).and(
                createValidValidation([
                    {
                        value: "value",
                        predicate: "isBar",
                        valid: true,
                        inverted: false,
                    },
                ])
            );
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: false,
                },
            ]);
            expect(res.results).toEqual([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: false,
                },
                {
                    value: "value",
                    predicate: "isBar",
                    valid: true,
                    inverted: false,
                },
            ]);
        });

        it("InvalidValidation and InvalidValidation should return InvalidValidation", () => {
            const res = createInvalidValidation([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: false,
                },
            ]).and(
                createInvalidValidation([
                    {
                        value: "value",
                        predicate: "isBar",
                        valid: false,
                        inverted: false,
                    },
                ])
            );
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: false,
                },
                {
                    value: "value",
                    predicate: "isBar",
                    valid: false,
                    inverted: false,
                },
            ]);
            expect(res.results).toEqual([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: false,
                },
                {
                    value: "value",
                    predicate: "isBar",
                    valid: false,
                    inverted: false,
                },
            ]);
        });

        it("InvalidValidation and AsyncValidation(ValidValidation) should return an AsyncValidation(InvalidValidation)", async () => {
            const res = createInvalidValidation([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: false,
                },
            ]).and(
                createAsyncValidation.validValidation([
                    {
                        value: "value",
                        predicate: "isBar",
                        valid: true,
                        inverted: false,
                    },
                ])
            );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: false,
                },
            ]);
        });

        it("InvalidValidation and AsyncValidation(InValidValidation) should return an AsyncValidation(InvalidValidation)", async () => {
            const res = createInvalidValidation([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: false,
                },
            ]).and(
                createAsyncValidation.invalidValidation([
                    {
                        value: "value",
                        predicate: "isBar",
                        valid: false,
                        inverted: false,
                    },
                ])
            );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: false,
                },
                {
                    value: "value",
                    predicate: "isBar",
                    valid: false,
                    inverted: false,
                },
            ]);
        });

        it("AsyncValidation(ValidValidation) and ValidValidation should return AsyncValidation(ValidValidation)", async () => {
            const res = createAsyncValidation
                .validValidation([
                    {
                        value: "value",
                        predicate: "isFoo",
                        valid: true,
                        inverted: false,
                    },
                ])
                .and(
                    createValidValidation([
                        {
                            value: "value",
                            predicate: "isBar",
                            valid: true,
                            inverted: false,
                        },
                    ])
                );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("AsyncValidation(Valid) and Invalid should return asyncValidation(Invalid)", async () => {
            const res = createAsyncValidation
                .validValidation([
                    {
                        value: "value",
                        predicate: "isFoo",
                        valid: true,
                        inverted: false,
                    },
                ])
                .and(
                    createInvalidValidation([
                        {
                            value: "value",
                            predicate: "isBar",
                            valid: false,
                            inverted: false,
                        },
                    ])
                );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                {
                    value: "value",
                    predicate: "isBar",
                    valid: false,
                    inverted: false,
                },
            ]);
        });

        it("AsyncValidation(ValidValidation) and AsyncValidation(ValidValidation) should return an AsyncValidation(ValidValidation)", async () => {
            const res = createAsyncValidation
                .validValidation([
                    {
                        value: "value",
                        predicate: "isFoo",
                        valid: true,
                        inverted: false,
                    },
                ])
                .and(
                    createAsyncValidation.validValidation([
                        {
                            value: "value",
                            predicate: "isBar",
                            valid: true,
                            inverted: false,
                        },
                    ])
                );
            expect(res.fork).toBeDefined();
        });

        it("AsyncValidation(ValidValidation) and AsyncValidation(InvalidValidation) should return an AsyncValidation(InvalidValidation)", async () => {
            const res = createAsyncValidation
                .validValidation([
                    {
                        value: "value",
                        predicate: "isFoo",
                        valid: true,
                        inverted: false,
                    },
                ])
                .and(
                    createAsyncValidation.invalidValidation([
                        {
                            value: "value",
                            predicate: "isBar",
                            valid: false,
                            inverted: false,
                        },
                    ])
                );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                {
                    value: "value",
                    predicate: "isBar",
                    valid: false,
                    inverted: false,
                },
            ]);
        });

        it("AsyncValidation(InvalidValidation) and ValidValidation should return AsyncValidation(InvalidValidation)", async () => {
            const res = createAsyncValidation
                .invalidValidation([
                    {
                        value: "value",
                        predicate: "isFoo",
                        valid: false,
                        inverted: false,
                    },
                ])
                .and(
                    createValidValidation([
                        {
                            value: "value",
                            predicate: "isBar",
                            valid: true,
                            inverted: false,
                        },
                    ])
                );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: false,
                },
            ]);
        });

        it("AsyncValidation(InvalidValidation) and InvalidValidation should return AsyncValidation(InvalidValidation)", async () => {
            const res = createAsyncValidation
                .invalidValidation([
                    {
                        value: "value",
                        predicate: "isFoo",
                        valid: false,
                        inverted: false,
                    },
                ])
                .and(
                    createInvalidValidation([
                        {
                            value: "value",
                            predicate: "isBar",
                            valid: false,
                            inverted: false,
                        },
                    ])
                );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: false,
                },
                {
                    value: "value",
                    predicate: "isBar",
                    valid: false,
                    inverted: false,
                },
            ]);
        });

        it("AsyncValidation(InvalidValidation) and AsyncValidation(ValidValidation) should return an AsyncValidation(InvalidValidation)", async () => {
            const res = createAsyncValidation
                .invalidValidation([
                    {
                        value: "value",
                        predicate: "isFoo",
                        valid: false,
                        inverted: false,
                    },
                ])
                .and(
                    createAsyncValidation.validValidation([
                        {
                            value: "value",
                            predicate: "isBar",
                            valid: true,
                            inverted: false,
                        },
                    ])
                );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: false,
                },
            ]);
        });

        it("AsyncValidation(InvalidValidation) and AsyncValidation(InValidValidation) should return an AsyncValidation(InvalidValidation)", async () => {
            const res = createAsyncValidation
                .invalidValidation([
                    {
                        value: "value",
                        predicate: "isFoo",
                        valid: false,
                        inverted: false,
                    },
                ])
                .and(
                    createAsyncValidation.invalidValidation([
                        {
                            value: "value",
                            predicate: "isBar",
                            valid: false,
                            inverted: false,
                        },
                    ])
                );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: false,
                },
                {
                    value: "value",
                    predicate: "isBar",
                    valid: false,
                    inverted: false,
                },
            ]);
        });
    });

    describe("or", () => {
        it("ValidValidation or ValidValidation should keep the Valid value", () => {
            const res = createValidValidation([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: true,
                    inverted: false,
                },
            ]).or(
                createValidValidation([
                    {
                        value: "value",
                        predicate: "isBar",
                        valid: true,
                        inverted: false,
                    },
                ])
            );
            expect(res.isValid).toBe(true);
            expect(res.getResult()).toBeUndefined();
            expect(res.results).toEqual([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: true,
                    inverted: false,
                },
                {
                    value: "value",
                    predicate: "isBar",
                    valid: true,
                    inverted: false,
                },
            ]);
        });

        it("ValidValidation or InValidValidation should keep the Valid value", () => {
            const res = createValidValidation([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: true,
                    inverted: false,
                },
            ]).or(
                createInvalidValidation([
                    {
                        value: "value",
                        predicate: "isBar",
                        valid: false,
                        inverted: false,
                    },
                ])
            );
            expect(res.isValid).toBe(true);
            expect(res.getResult()).toBeUndefined();
            expect(res.results).toEqual([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: true,
                    inverted: false,
                },
            ]);
        });

        it("ValidValidation or AsyncValidation(ValidValidation) should return an AsyncValidation(ValidValidation)", async () => {
            const res = createValidValidation([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: true,
                    inverted: false,
                },
            ]).or(
                createAsyncValidation.validValidation([
                    {
                        value: "value",
                        predicate: "isBar",
                        valid: true,
                        inverted: false,
                    },
                ])
            );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("Valid or AsyncValidation(InValidValidation) should return an AsyncValidation(ValidValidation)", async () => {
            const res = createValidValidation([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: true,
                    inverted: false,
                },
            ]).or(
                createAsyncValidation.invalidValidation([
                    {
                        value: "value",
                        predicate: "isBar",
                        valid: false,
                        inverted: false,
                    },
                ])
            );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("InvalidValidation or ValidValidation should return ValidValidation", () => {
            const res = createInvalidValidation([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: false,
                },
            ]).or(
                createValidValidation([
                    {
                        value: "value",
                        predicate: "isBar",
                        valid: true,
                        inverted: false,
                    },
                ])
            );
            expect(res.isValid).toBe(true);
            expect(res.getResult()).toBeUndefined();
            expect(res.results).toEqual([
                {
                    value: "value",
                    predicate: "isBar",
                    valid: true,
                    inverted: false,
                },
            ]);
        });

        it("InvalidValidation or InvalidValidation should return InvalidValidation", () => {
            const res = createInvalidValidation([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: false,
                },
            ]).or(
                createInvalidValidation([
                    {
                        value: "value",
                        predicate: "isBar",
                        valid: false,
                        inverted: false,
                    },
                ])
            );
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: false,
                },
                {
                    value: "value",
                    predicate: "isBar",
                    valid: false,
                    inverted: false,
                },
            ]);
            expect(res.results).toEqual([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: false,
                },
                {
                    value: "value",
                    predicate: "isBar",
                    valid: false,
                    inverted: false,
                },
            ]);
        });

        it("InvalidValidation or AsyncValidation(ValidValidation) should return an AsyncValidation(ValidValidation)", async () => {
            const res = createInvalidValidation([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: false,
                },
            ]).or(
                createAsyncValidation.validValidation([
                    {
                        value: "value",
                        predicate: "isBar",
                        valid: true,
                        inverted: false,
                    },
                ])
            );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("InvalidValidation or AsyncValidation(InValidValidation) should return an AsyncValidation(InvalidValidation)", async () => {
            const res = createInvalidValidation([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: false,
                },
            ]).or(
                createAsyncValidation.invalidValidation([
                    {
                        value: "value",
                        predicate: "isBar",
                        valid: false,
                        inverted: false,
                    },
                ])
            );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: false,
                },
                {
                    value: "value",
                    predicate: "isBar",
                    valid: false,
                    inverted: false,
                },
            ]);
        });

        it("AsyncValidation(ValidValidation) or ValidValidation should return AsyncValidation(ValidValidation)", async () => {
            const res = createAsyncValidation
                .validValidation([
                    {
                        value: "value",
                        predicate: "isFoo",
                        valid: true,
                        inverted: false,
                    },
                ])
                .or(
                    createValidValidation([
                        {
                            value: "value",
                            predicate: "isBar",
                            valid: true,
                            inverted: false,
                        },
                    ])
                );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("AsyncValidation(ValidValidation) or InvalidValidation should return AsyncValidation(ValidValidation)", async () => {
            const res = createAsyncValidation
                .validValidation([
                    {
                        value: "value",
                        predicate: "isFoo",
                        valid: true,
                        inverted: false,
                    },
                ])
                .or(
                    createInvalidValidation([
                        {
                            value: "value",
                            predicate: "isBar",
                            valid: false,
                            inverted: false,
                        },
                    ])
                );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("AsyncValidation(ValidValidation) or AsyncValidation(ValidValidation) should return an AsyncValidation(ValidValidation)", async () => {
            const res = createAsyncValidation
                .validValidation([
                    {
                        value: "value",
                        predicate: "isFoo",
                        valid: true,
                        inverted: false,
                    },
                ])
                .or(
                    createAsyncValidation.validValidation([
                        {
                            value: "value",
                            predicate: "isBar",
                            valid: true,
                            inverted: false,
                        },
                    ])
                );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("AsyncValidation(ValidValidation) or AsyncValidation(InvalidValidation) should return an AsyncValidation(ValidValidation)", async () => {
            const res = createAsyncValidation
                .validValidation([
                    {
                        value: "value",
                        predicate: "isFoo",
                        valid: true,
                        inverted: false,
                    },
                ])
                .or(
                    createAsyncValidation.invalidValidation([
                        {
                            value: "value",
                            predicate: "isBar",
                            valid: false,
                            inverted: false,
                        },
                    ])
                );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("AsyncValidation(InvalidValidation) or ValidValidation should return AsyncValidation(ValidValidation)", async () => {
            const res = createAsyncValidation
                .invalidValidation([
                    {
                        value: "value",
                        predicate: "isFoo",
                        valid: false,
                        inverted: false,
                    },
                ])
                .or(
                    createValidValidation([
                        {
                            value: "value",
                            predicate: "isBar",
                            valid: true,
                            inverted: false,
                        },
                    ])
                );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("AsyncValidation(InvalidValidation) or InvalidValidation should return AsyncValidation(InvalidValidation)", async () => {
            const res = createAsyncValidation
                .invalidValidation([
                    {
                        value: "value",
                        predicate: "isFoo",
                        valid: false,
                        inverted: false,
                    },
                ])
                .or(
                    createInvalidValidation([
                        {
                            value: "value",
                            predicate: "isBar",
                            valid: false,
                            inverted: false,
                        },
                    ])
                );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: false,
                },
                {
                    value: "value",
                    predicate: "isBar",
                    valid: false,
                    inverted: false,
                },
            ]);
        });

        it("AsyncValidation(InvalidValidation) or AsyncValidation(ValidValidation) should return an AsyncValidation(ValidValidation)", async () => {
            const res = createAsyncValidation
                .invalidValidation([
                    {
                        value: "value",
                        predicate: "isFoo",
                        valid: false,
                        inverted: false,
                    },
                ])
                .or(
                    createAsyncValidation.validValidation([
                        {
                            value: "value",
                            predicate: "isBar",
                            valid: true,
                            inverted: false,
                        },
                    ])
                );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("AsyncValidation(InvalidValidation) or AsyncValidation(InValidValidation) should return an AsyncValidation(InvalidValidation)", async () => {
            const res = createAsyncValidation
                .invalidValidation([
                    {
                        value: "value",
                        predicate: "isFoo",
                        valid: false,
                        inverted: false,
                    },
                ])
                .or(
                    createAsyncValidation.invalidValidation([
                        {
                            value: "value",
                            predicate: "isBar",
                            valid: false,
                            inverted: false,
                        },
                    ])
                );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: false,
                },
                {
                    value: "value",
                    predicate: "isBar",
                    valid: false,
                    inverted: false,
                },
            ]);
        });
    });

    describe("not", () => {
        it("should convert ValidValidation to InvalidValidation", () => {
            const res = createValidValidation([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: true,
                    inverted: false,
                },
            ]).not();

            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: true,
                    inverted: true,
                },
            ]);
            expect(res.results).toEqual([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: true,
                    inverted: true,
                },
            ]);
        });

        it("should convert InvalidValidation to ValidValidation", () => {
            const res = createInvalidValidation([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: false,
                },
            ]).not();

            expect(res.isValid).toBe(true);
            expect(res.getResult()).toBeUndefined();
            expect(res.results).toEqual([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: true,
                },
            ]);
        });
    });

    describe("xor", () => {
        it("ValidValidation xor ValidValidation should return InvalidValidation", () => {
            const res = createValidValidation([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: true,
                    inverted: false,
                },
            ]).xor(
                createValidValidation([
                    {
                        value: "value",
                        predicate: "isBar",
                        valid: true,
                        inverted: false,
                    },
                ])
            );
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: true,
                    inverted: true,
                },
                {
                    value: "value",
                    predicate: "isBar",
                    valid: true,
                    inverted: true,
                },
            ]);
            expect(res.results).toEqual([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: true,
                    inverted: true,
                },
                {
                    value: "value",
                    predicate: "isBar",
                    valid: true,
                    inverted: true,
                },
            ]);
        });
        it("ValidValidation xor inValidValidation should return ValidValidation", () => {
            const res = createValidValidation([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: true,
                    inverted: false,
                },
            ]).xor(
                createInvalidValidation([
                    {
                        value: "value",
                        predicate: "isBar",
                        valid: false,
                        inverted: false,
                    },
                ])
            );
            expect(res.isValid).toBe(true);
            expect(res.getResult()).toBeUndefined();
            expect(res.results).toEqual([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: true,
                    inverted: false,
                },
                {
                    value: "value",
                    predicate: "isBar",
                    valid: false,
                    inverted: false,
                },
            ]);
        });

        it("ValidValidation xor AsyncValidation(ValidValidation) should return an AsyncValidation(InvalidValidation)", async () => {
            const res = createValidValidation([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: true,
                    inverted: false,
                },
            ]).xor(
                createAsyncValidation.validValidation([
                    {
                        value: "value",
                        predicate: "isBar",
                        valid: true,
                        inverted: false,
                    },
                ])
            );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: true,
                    inverted: true,
                },
                {
                    value: "value",
                    predicate: "isBar",
                    valid: true,
                    inverted: true,
                },
            ]);
        });

        it("ValidValidation or AsyncValidation(InValidValidation) should return an AsyncValidation(ValidValidation)", async () => {
            const res = createValidValidation([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: true,
                    inverted: false,
                },
            ]).or(
                createAsyncValidation.invalidValidation([
                    {
                        value: "value",
                        predicate: "isBar",
                        valid: false,
                        inverted: false,
                    },
                ])
            );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });
        it("InvalidValidation xor ValidValidation should return ValidValidation", () => {
            const res = createInvalidValidation([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: false,
                },
            ]).xor(
                createValidValidation([
                    {
                        value: "value",
                        predicate: "isBar",
                        valid: true,
                        inverted: false,
                    },
                ])
            );
            expect(res.isValid).toBe(true);
            expect(res.getResult()).toBeUndefined();
            expect(res.results).toEqual([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: false,
                },
                {
                    value: "value",
                    predicate: "isBar",
                    valid: true,
                    inverted: false,
                },
            ]);
        });
        it("InvalidValidation xor InvalidValidation should return InvalidValidation", () => {
            const res = createInvalidValidation([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: false,
                },
            ]).xor(
                createInvalidValidation([
                    {
                        value: "value",
                        predicate: "isBar",
                        valid: false,
                        inverted: false,
                    },
                ])
            );
            expect(res.isValid).toBe(false);
            expect(res.getResult()).toEqual([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: false,
                },
                {
                    value: "value",
                    predicate: "isBar",
                    valid: false,
                    inverted: false,
                },
            ]);
            expect(res.results).toEqual([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: false,
                },
                {
                    value: "value",
                    predicate: "isBar",
                    valid: false,
                    inverted: false,
                },
            ]);
        });

        it("InvalidValidation xor AsyncValidation(ValidValidation) should return an AsyncValidation(ValidValidation)", async () => {
            const res = createInvalidValidation([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: false,
                },
            ]).xor(
                createAsyncValidation.validValidation([
                    {
                        value: "value",
                        predicate: "isBar",
                        valid: true,
                        inverted: false,
                    },
                ])
            );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("InvalidValidation xor AsyncValidation(InValidValidation) should return an AsyncValidation(InvalidValidation)", async () => {
            const res = createInvalidValidation([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: false,
                },
            ]).xor(
                createAsyncValidation.invalidValidation([
                    {
                        value: "value",
                        predicate: "isBar",
                        valid: false,
                        inverted: false,
                    },
                ])
            );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: false,
                },
                {
                    value: "value",
                    predicate: "isBar",
                    valid: false,
                    inverted: false,
                },
            ]);
        });

        it("AsyncValidation(ValidValidation) xor ValidValidation should return AsyncValidation(InvalidValidation)", async () => {
            const res = createAsyncValidation
                .validValidation([
                    {
                        value: "value",
                        predicate: "isFoo",
                        valid: true,
                        inverted: false,
                    },
                ])
                .xor(
                    createValidValidation([
                        {
                            value: "value",
                            predicate: "isBar",
                            valid: true,
                            inverted: false,
                        },
                    ])
                );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: true,
                    inverted: true,
                },
                {
                    value: "value",
                    predicate: "isBar",
                    valid: true,
                    inverted: true,
                },
            ]);
        });

        it("AsyncValidation(ValidValidation) xor InvalidValidation should return AsyncValidation(ValidValidation)", async () => {
            const res = createAsyncValidation
                .validValidation([
                    {
                        value: "value",
                        predicate: "isFoo",
                        valid: true,
                        inverted: false,
                    },
                ])
                .xor(
                    createInvalidValidation([
                        {
                            value: "value",
                            predicate: "isBar",
                            valid: false,
                            inverted: false,
                        },
                    ])
                );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("AsyncValidation(ValidValidation) xor AsyncValidation(ValidValidation) should return an AsyncValidation(InvalidValidation)", async () => {
            const res = createAsyncValidation
                .validValidation([
                    {
                        value: "value",
                        predicate: "isFoo",
                        valid: true,
                        inverted: false,
                    },
                ])
                .xor(
                    createAsyncValidation.validValidation([
                        {
                            value: "value",
                            predicate: "isBar",
                            valid: true,
                            inverted: false,
                        },
                    ])
                );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: true,
                    inverted: true,
                },
                {
                    value: "value",
                    predicate: "isBar",
                    valid: true,
                    inverted: true,
                },
            ]);
        });

        it("AsyncValidation(ValidValidation) or AsyncValidation(InvalidValidation) should return an AsyncValidation(ValidValidation)", async () => {
            const res = createAsyncValidation
                .validValidation([
                    {
                        value: "value",
                        predicate: "isFoo",
                        valid: true,
                        inverted: false,
                    },
                ])
                .xor(
                    createAsyncValidation.invalidValidation([
                        {
                            value: "value",
                            predicate: "isBar",
                            valid: false,
                            inverted: false,
                        },
                    ])
                );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("AsyncValidation(InvalidValidation) xor ValidValidation should return AsyncValidation(ValidValidation)", async () => {
            const res = createAsyncValidation
                .invalidValidation([
                    {
                        value: "value",
                        predicate: "isFoo",
                        valid: false,
                        inverted: false,
                    },
                ])
                .xor(
                    createValidValidation([
                        {
                            value: "value",
                            predicate: "isBar",
                            valid: true,
                            inverted: false,
                        },
                    ])
                );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("AsyncValidation(InvalidValidation) xor InvalidValidation should return AsyncValidation(InvalidValidation)", async () => {
            const res = createAsyncValidation
                .invalidValidation([
                    {
                        value: "value",
                        predicate: "isFoo",
                        valid: false,
                        inverted: false,
                    },
                ])
                .xor(
                    createInvalidValidation([
                        {
                            value: "value",
                            predicate: "isBar",
                            valid: false,
                            inverted: false,
                        },
                    ])
                );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: false,
                },
                {
                    value: "value",
                    predicate: "isBar",
                    valid: false,
                    inverted: false,
                },
            ]);
        });

        it("AsyncValidation(InvalidValidation) xor AsyncValidation(ValidValidation) should return an AsyncValidation(ValidValidation)", async () => {
            const res = createAsyncValidation
                .invalidValidation([
                    {
                        value: "value",
                        predicate: "isFoo",
                        valid: false,
                        inverted: false,
                    },
                ])
                .xor(
                    createAsyncValidation.validValidation([
                        {
                            value: "value",
                            predicate: "isBar",
                            valid: true,
                            inverted: false,
                        },
                    ])
                );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toBeUndefined();
        });

        it("AsyncValidation(InvalidValidation) xor AsyncValidation(InValidValidation) should return an AsyncValidation(InvalidValidation)", async () => {
            const res = createAsyncValidation
                .invalidValidation([
                    {
                        value: "value",
                        predicate: "isFoo",
                        valid: false,
                        inverted: false,
                    },
                ])
                .xor(
                    createAsyncValidation.invalidValidation([
                        {
                            value: "value",
                            predicate: "isBar",
                            valid: false,
                            inverted: false,
                        },
                    ])
                );
            expect(res.fork).toBeDefined();

            expect(await res.getResult()).toEqual([
                {
                    value: "value",
                    predicate: "isFoo",
                    valid: false,
                    inverted: false,
                },
                {
                    value: "value",
                    predicate: "isBar",
                    valid: false,
                    inverted: false,
                },
            ]);
        });
    });
});
