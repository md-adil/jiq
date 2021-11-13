import externals from "rollup-plugin-node-externals";
import typescript from "@rollup/plugin-typescript";

export default {
    input: "./src/index.ts",
    output: {
        file: "./dist/index.js",
        format: "cjs",
    },
    acorn: {
        // Let the hashbang be
        // allowHashBang: true,
    },
    plugins: [typescript({ tsconfig: "./tsconfig.json" }), externals()],
};
