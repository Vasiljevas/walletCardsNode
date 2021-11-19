import Action from "../models/action.js";

const getAllActions = async () => {
	return await Action.find({});
};

const getActionById = async (id) => {
	return await Action.findById(id);
};

const createAction = async (actionBody) => {
	const newAction = new Action({
		action: actionBody.action,
		user: actionBody.user,
		date: actionBody.date,
	});
	return await newAction.save();
};

const deleteAction = async (id) => {
	await Action.findByIdAndDelete(id);
};

const updateAction = async (id, actionBody) => {
	const updatedAction = {
		action: actionBody.action,
		user: actionBody.user,
		date: actionBody.date,
	};
	await Action.findByIdAndUpdate(id, updatedAction);
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
