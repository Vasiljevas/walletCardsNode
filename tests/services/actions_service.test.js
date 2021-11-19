const mongoose = require("mongoose");
const actionsHelper = require("../helpers/action_test_helper.js");
const usersHelper = require("../helpers/user_test_helper.js");

const Action = require("../../models/action.js");
const User = require("../../models/user.js");

const app = require("../../app.js");

const ActionsService = require("../../services/actions.js");

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

describe("Getting actions", () => {
	it("should get all actions", async () => {
		const actions = await ActionsService.getAllActions();
		expect(actions).toHaveLength(actionsHelper.initialActions.length);
	});

	it("should get one specific action", async () => {
		const dbActions = await actionsHelper.actionsInDb();
		const oneAction = await ActionsService.getActionById(dbActions[0].id);
		expect(oneAction.id).toEqual(
			JSON.parse(JSON.stringify(dbActions[0])).id
		);
	});
});

describe("Creating actions", () => {
	it("should create an action", async () => {
		const dbUsers = await usersHelper.usersInDb();
		const newAction = {
			action: "create",
			user: dbUsers[0].id,
		};
		await ActionsService.createAction(newAction);
		const actionsAtEnd = await actionsHelper.actionsInDb();
		expect(actionsAtEnd).toHaveLength(
			actionsHelper.initialActions.length + 1
		);
		const usersAtEnd = await usersHelper.usersInDb();
		expect(usersAtEnd[0].actions).toHaveLength(
			dbUsers[0].actions.length + 1
		);
	});
});

describe("Deleting actions", () => {
	it("should delete an action", async () => {
		const dbActions = await actionsHelper.actionsInDb();

		await ActionsService.deleteAction(dbActions[0].id);

		const actionsAtEnd = await actionsHelper.actionsInDb();
		expect(actionsAtEnd).toHaveLength(dbActions.length - 1);
		const usersAtEnd = await usersHelper.usersInDb();
		usersAtEnd.forEach((user) => {
			expect(user.actions).not.toContain(dbActions[0].id);
		});
	});
});

describe("Updating actions", () => {
	it("should update an action", async () => {
		const dbActions = await actionsHelper.actionsInDb();
		const dbUsers = await usersHelper.usersInDb();

		const updatedAction = {
			action: "create",
			user: dbActions[1].user,
			date: new Date(),
		};

		await ActionsService.updateAction(dbActions[0].id, updatedAction);

		const actionsAtEnd = await actionsHelper.actionsInDb();
		expect(dbActions[0]).not.toEqual(actionsAtEnd[0]);

		const usersAtEnd = await usersHelper.usersInDb();
		const oldUserFromOld = dbUsers.find(
			(user) => user.id === dbActions[1].user.toString()
		);
		const oldUserFromNew = usersAtEnd.find(
			(user) => user.id === dbActions[1].user.toString()
		);
		expect(oldUserFromNew.actions).toHaveLength(
			oldUserFromOld.actions.length
		);

		const newUser = usersAtEnd.find(
			(user) => user.id === actionsAtEnd[0].user.toString()
		);
		expect(newUser.actions[0].toString()).toEqual(actionsAtEnd[1].id);
	});
});

afterAll(() => {
	mongoose.connection.close();
});
