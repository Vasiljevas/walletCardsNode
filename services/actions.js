import ActionsRepository from "../repositories/actions.js";
import UsersRepository from "../repositories/users.js";

const getAllActions = async () => {
	return await ActionsRepository.getAllActions();
};

const getActionById = async (id) => {
	return await ActionsRepository.getActionById(id);
};

const createAction = async (actionBody) => {
	const createdAction = await ActionsRepository.createAction({
		action: actionBody.action,
		user: actionBody.user,
		date: new Date(),
	});
	const user = await UsersRepository.getUser(actionBody.user);
	await UsersRepository.updateUser(user.id, {
		name: user.name,
		phoneNumber: user.phoneNumber,
		actions: [...user.actions, createdAction._id],
	});
};

const deleteAction = async (id) => {
	await ActionsRepository.deleteAction(id);
	const users = await UsersRepository.getAllUsers();
	const foundUser = users.find((user) => user.actions.includes(id));
	if (foundUser) {
		const index = foundUser.actions.indexOf(id);
		if (index > -1) {
			foundUser.actions.splice(index, 1);
			await UsersRepository.updateUser(foundUser.id, {
				name: foundUser.name,
				phoneNumber: foundUser.phoneNumber,
				actions: foundUser.actions,
			});
		}
	}
};

const updateAction = async (id, actionBody) => {
	const oldAction = await ActionsRepository.getActionById(id);
	await ActionsRepository.updateAction(id, actionBody);
	if (oldAction.user !== actionBody.user) {
		const users = await UsersRepository.getAllUsers();
		const foundUser = users.find((user) => user.actions.includes(id));
		if (foundUser) {
			const index = foundUser.actions.indexOf(id);
			if (index > -1) {
				foundUser.actions.splice(index, 1);
				await UsersRepository.updateUser(foundUser.id, {
					name: foundUser.name,
					phoneNumber: foundUser.phoneNumber,
					actions: foundUser.actions,
				});
			}
		}
		const foundNewUser = users.find((user) => user.id === actionBody.user);
		if (foundNewUser) {
			await UsersRepository.updateUser(foundNewUser.id, {
				name: foundNewUser.name,
				phoneNumber: foundNewUser.phoneNumber,
				actions: [...foundNewUser.actions, id],
			});
		}
	}
};

export default {
	getAllActions,
	getActionById,
	createAction,
	deleteAction,
	updateAction,
};
// module.exports = {
// 	getAllActions,
// 	getActionById,
// 	createAction,
// 	deleteAction,
// 	updateAction,
// }; //for testing
