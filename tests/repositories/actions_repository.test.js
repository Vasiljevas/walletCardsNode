const mongoose = require("mongoose");
const User = require("../../models/user.js");
const Action = require("../../models/action.js");
const actionsHelper = require("../helpers/action_test_helper.js");
const usersHelper = require("../helpers/user_test_helper.js");
const app = require("../../app.js");
const ActionsRepository = require("../../repositories/actions.js");

beforeEach(async () => {
	await Action.deleteMany({});
	await User.deleteMany({});
	await Action.insertMany(actionsHelper.initialActions);
	const actions = await actionsHelper.actionsInDb();
	let users = [];
	actions.forEach((action, index) => {
		let newUser = {
			_id: action.user,
			name: `${action.action}-${index}`,
			phoneNumber: "+37063363686",
			actions: [action.id],
		};
		users.push(newUser);
	});
	await User.insertMany(users);
});

describe("test mongoose action repo", () => {
	it("should return all actions", async () => {
		const actions = await ActionsRepository.getAllActions();
		const dbActions = await actionsHelper.actionsInDb();
		expect(actions).toMatchObject(dbActions);
	});

	it("should return the action with findById", async () => {
		const dbActions = await actionsHelper.actionsInDb();

		const oneAction = await ActionsRepository.getActionById(
			dbActions[0].id
		);
		expect(oneAction).toMatchObject(dbActions[0]);
	});

	it("should create action", async () => {
		const oldActions = await actionsHelper.actionsInDb();
		const newAction = {
			action: "what",
			user: "618c04e461e81a7c6028022c",
			date: new Date(),
		};
		const createdAction = await ActionsRepository.createAction(newAction);
		const dbActions = await actionsHelper.actionsInDb();
		expect(dbActions).toHaveLength(oldActions.length + 1);
		expect(dbActions).not.toContain(createdAction);
	});

	it("should delete user", async () => {
		const dbActions = await actionsHelper.actionsInDb();
		await ActionsRepository.deleteAction(dbActions[0].id);
		const actionsAtEnd = await actionsHelper.actionsInDb();
		expect(actionsAtEnd).toHaveLength(dbActions.length - 1);
	});

	it("should update user", async () => {
		const dbActions = await actionsHelper.actionsInDb();
		const updatedAction = {
			action: "what",
			user: dbActions[0].user,
			date: new Date(),
		};
		await ActionsRepository.updateAction(dbActions[0].id, updatedAction);
		const actionsAtEnd = await actionsHelper.actionsInDb();
		expect(actionsAtEnd[0]).not.toEqual(dbActions[0]);
	});
});

afterAll(() => {
	mongoose.connection.close();
});
