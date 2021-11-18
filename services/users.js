import ActionsRepository from "../repositories/actions.js";
import UsersRepository from "../repositories/users.js";

const getAllUsers = async () => {
	return await UsersRepository.getAllUsers();
};

const getUser = async (id) => {
	return await UsersRepository.getUser(id);
};

const createUser = async (userBody) => {
	const newUser = await UsersRepository.createUser(userBody);
	const newAction = {
		action: "insert",
		date: new Date(),
		user: newUser.id,
	};
	const madeAction = await ActionsRepository.createAction(newAction);
	await UsersRepository.updateUser(newUser.id, {
		name: newUser.name,
		phoneNumber: newUser.phoneNumber,
		actions: [madeAction._id],
	});
};

const deleteUser = async (id) => {
	const deletedUser = await UsersRepository.deleteUser(id);
	if (deletedUser.actions.length > 0) {
		deletedUser.actions.forEach(async (action) => {
			await ActionsRepository.deleteAction(action.id);
		});
	}
	const newAction = {
		action: "delete",
		date: new Date(),
		user: id,
	};
	await ActionsRepository.createAction(newAction);
};

const updateUser = async (id, userBody) => {
	const newAction = {
		action: "update",
		date: new Date(),
		user: id,
	};
	const madeAction = await ActionsRepository.createAction(newAction);
	const thisUser = await UsersRepository.getUser(id);
	const updatedUser = {
		name: userBody.name,
		phoneNumber: userBody.phoneNumber,
		actions: [...thisUser.actions, madeAction._id],
	};
	await UsersRepository.updateUser(id, updatedUser);
};

export default {
	getAllUsers,
	getUser,
	createUser,
	deleteUser,
	updateUser,
};
