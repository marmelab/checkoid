import typescript from "rollup-plugin-typescript2";

export default {
    input: "src/index.ts",
    output: {
        dir: "dist",
        name: "checkoid",
        format: "umd",
    },
    plugins: [
        typescript({
            typescript: require("typescript"),
        }),
    ],
};
