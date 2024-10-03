import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.cjs.js",
      format: "cjs",
      sourcemap: true,
      
      plugins: [terser()],
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true,
      plugins: [terser()],
    },
  ],
  plugins: [resolve(), commonjs(), typescript({ tsconfig: "./tsconfig.json" })],
};