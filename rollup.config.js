import typescript from "@rollup/plugin-typescript";

export default {
    input: "src/index.ts",
    output: {
        dir: "dist",
        name: "checkoid",
        format: "umd",
    },
    plugins: [typescript()],
    external: ["tslib"],
};
