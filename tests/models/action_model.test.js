const mockingoose = require("mockingoose");
const Action = require("../../models/action.js");

describe("action model", () => {
	it("should return list of actions", async () => {
		mockingoose(Action).toReturn(
			[
				{
					action: "insert",
					user: "618c04e461e81a7c6028022c",
					date: "2021-11-12T10:37:11.151Z",
				},
				{
					action: "delete",
					user: "618c15b806c5efc3286f7f00",
					date: "2021-11-12T10:39:33.155Z",
				},
			],
			"find"
		);
	});
});
