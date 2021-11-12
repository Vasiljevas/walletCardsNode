const Action = require("../models/actions.js");
const initialActions = [
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
];

const nonExistingId = async () => {
	const action = new Action({
		action: "delete",
		date: "2021-11-12T10:39:33.155Z",
		user: "618c15b444c5efc3286f7f00",
	});
	await action.save();
	await action.remove();

	return action._id.toString();
};

const actionsInDb = async () => {
	const actions = await Action.find({});
	return actions.map((a) => a.toJSON());
};

module.exports = {
	initialActions,
	nonExistingId,
	actionsInDb,
};
