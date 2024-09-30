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
	target: "es2019",
	external: ["react", "react-dom"],
	dts: true,
	clean: true,
	format: ["cjs", "esm"],
	tsconfig: "./tsconfig.json",
	bundle: true,
});
