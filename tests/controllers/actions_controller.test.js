const mongoose = require("mongoose");
const supertest = require("supertest");
const actionsHelper = require("../helpers/action_test_helper.js");
const usersHelper = require("../helpers/user_test_helper.js");

const Action = require("../../models/action.js");
const User = require("../../models/user.js");

const app = require("../../app.js");
const api = supertest(app);

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

describe("Actions controller tests", () => {
	test("actions are returned as json", async () => {
		await api
			.get("/api/actions")
			.expect(200)
			.expect("Content-Type", /application\/json/);
	});

	test("all actions are returned", async () => {
		const response = await api.get("/api/actions");
		const dbActions = await actionsHelper.actionsInDb();
		expect(response.body).toHaveLength(dbActions.length);
	});

	test("specific action is within actions", async () => {
		const response = await api.get("/api/actions");
		const actions = response.body.map((a) => a.action);
		expect(actions).toContain("delete");
	});

	test("a specific action can be viewed", async () => {
		const actionsAtStart = await actionsHelper.actionsInDb();
		const actionToView = actionsAtStart[0];
		const resultAction = await api
			.get(`/api/actions/${actionToView.id}`)
			.expect(200)
			.expect("Content-Type", /application\/json/);
		const processedActionToView = JSON.parse(JSON.stringify(actionToView));
		expect(resultAction.body).toEqual(processedActionToView);
	});

	test("falls with 400 id is invalid", async () => {
		const invalidId = "5a3d5da59070081a82a3445";
		await api.get(`/api/actions/${invalidId}`).expect(400);
	});

	test("a valid action can be added", async () => {
		const users = await usersHelper.usersInDb();
		const newAction = {
			action: "update",
			user: users[0].id,
		};
		await api.post("/api/actions").send(newAction).expect(204);
		const actionsAtEnd = await actionsHelper.actionsInDb();
		const actions = actionsAtEnd.map((a) => a.action);
		expect(actions).toContain("update");
	});

	test("an action can be deleted", async () => {
		const actionsAtStart = await actionsHelper.actionsInDb();
		const actionToDelete = actionsAtStart[0];
		await api.delete(`/api/actions/${actionToDelete.id}`).expect(204);
		const actionsAtEnd = await actionsHelper.actionsInDb();
		expect(actionsAtEnd).toHaveLength(actionsAtStart.length - 1);
		const actions = actionsAtEnd.map((a) => a.action);
		expect(actions).not.toContain(actionToDelete.action);
	});

	test("an action can be updated", async () => {
		const actions = await actionsHelper.actionsInDb();
		const users = await usersHelper.usersInDb();
		const newAction = {
			action: "create",
			user: users[0].id,
			date: new Date(),
		};
		await api.put(`/api/actions/${actions[0].id}`, newAction).expect(204);
	});
});

afterAll(() => {
	mongoose.connection.close();
});
