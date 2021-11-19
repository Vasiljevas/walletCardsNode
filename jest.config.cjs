module.exports = {
	testEnvironment: "node",
	transform: {
		"^.+\\.(ts|tsx)?$": "ts-jest",
		"^.+\\.(js|jsx)$": "babel-jest",
	},
	preset: "@shelf/jest-mongodb",
};
