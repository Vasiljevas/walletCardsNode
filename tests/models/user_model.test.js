const mockingoose = require("mockingoose");
const User = require("../../models/user.js");

describe("user model", () => {
	it("should return list of users", async () => {
		mockingoose(User).toReturn(
			[
				{
					name: "Andrius",
					phoneNumber: "+37063363686",
					actions: [],
				},
				{
					name: "Tomas",
					phoneNumber: "+37061241286",
					actions: [],
				},
			],
			"find"
		);
	});
});
