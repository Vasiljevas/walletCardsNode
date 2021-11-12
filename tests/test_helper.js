const User = require("../models/user.js");
const initialUsers = [
	{
		name: "Andrius",
		phoneNumber: "+37063363686",
	},
	{
		name: "Tomas",
		phoneNumber: "+37061241286",
	},
];

const nonExistingId = async () => {
	const user = new User({
		name: "willremovethissoon",
		phoneNumber: "+37063636",
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
