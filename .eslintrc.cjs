module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: "eslint:recommended",
	parserOptions: {
		ecmaVersion: 13,
		sourceType: "module",
	},
	rules: {
		indent: ["error", "tab"],
		"linebreak-style": ["error", "unix"],
		quotes: ["error", "double"],
		semi: ["error", "always"],
		eqeqeq: "error",
		"no-trailing-spaces": "error",
		"object-curly-spacing": ["error", "always"],
		"arrow-spacing": ["error", { before: true, after: true }],
		"no-console": 0,
	},
};
