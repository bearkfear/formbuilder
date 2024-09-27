import { defineConfig } from "tsup";

export default defineConfig({
	// The file we created above that will be the entrypoint to the library.
	entry: [
		"lib/**/*.ts",
		"lib/**/*.tsx",
		"!lib/fixtures",
		"!lib/**/*.test.ts",
		"!lib/**/*.test.tsx",
	],
	minify: true,
	target: "es2018",
	external: ["react", "react-dom"],
	sourcemap: false,
	dts: true,
	format: ["cjs", "esm"],
	outExtension(ctx) {
		return {
			js: ctx.format === "esm" ? ".mjs" : ".js",
		};
	},
	clean: true,
	bundle: false,
	tsconfig: "./tsconfig.json",
});
