import User from "../models/user.js";

const getAllUsers = async () => {
	// const users = await User.find({}).populate("notes");
	return await User.find({});
};

const getUser = async (id) => {
	return await User.findById(id);
};

const createUser = async (userBody) => {
	const newUser = new User({
		name: userBody.name,
		phoneNumber: userBody.phoneNumber,
		actions: [],
	});
	return await newUser.save();
};

const deleteUser = async (id) => {
	return await User.findByIdAndDelete(id);
};

const updateUser = async (id, updatedUser) => {
	await User.findByIdAndUpdate(id, updatedUser);
};

export default { getAllUsers, getUser, createUser, deleteUser, updateUser };
// module.exports = { getAllUsers, getUser, createUser, deleteUser, updateUser }; //for testing
