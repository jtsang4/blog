import globals from "globals";
import parser from "astro-eslint-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import { includeIgnoreFile } from "@eslint/compat";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});
const gitignorePath = path.resolve(__dirname, ".gitignore");

export default [
	{
		ignores: [
			"**/.husky",
			"**/.vscode",
			"**/node_modules",
			"**/public",
			"**/dist",
		],
	},
	includeIgnoreFile(gitignorePath),
	...compat.extends("eslint:recommended", "plugin:astro/recommended"),
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.browser,
			},

			ecmaVersion: "latest",
			sourceType: "module",
		},
	},
	{
		files: ["**/*.astro"],

		languageOptions: {
			parser: parser,
			ecmaVersion: 5,
			sourceType: "script",

			parserOptions: {
				parser: "@typescript-eslint/parser",
				extraFileExtensions: [".astro"],
			},
		},

		rules: {},
	},
];
