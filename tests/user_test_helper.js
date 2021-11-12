const User = require("../models/user.js");
const initialUsers = [
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
];

const nonExistingId = async () => {
	const user = new User({
		name: "willremovethissoon",
		phoneNumber: "+37063636",
		actions: [],
	});
	await user.save();
	await user.remove();

	return user._id.toString();
};

const usersInDb = async () => {
	const users = await User.find({});
	return users.map((u) => u.toJSON());
};

module.exports = {
	initialUsers,
	nonExistingId,
	usersInDb,
};
