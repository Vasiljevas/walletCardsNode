const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app.js");
const helper = require("./action_test_helper.js");
const userHelper = require("./user_test_helper.js");
const api = supertest(app);

const Action = require("../models/actions.js");
const User = require("../models/user.js");

beforeEach(async () => {
	await Action.deleteMany({});
	await User.deleteMany({});
	await User.insertMany(userHelper.initialUsers);
	await Action.insertMany(helper.initialActions);
});

describe("when there is initially some actions saved", () => {
	test("actions are returned as json", async () => {
		await api
			.get("/api/actions")
			.expect(200)
			.expect("Content-Type", /application\/json/);
	});

	test("all actions are returned", async () => {
		const response = await api.get("/api/actions");
		expect(response.body).toHaveLength(helper.initialActions.length);
	});

	test("specific action is within users", async () => {
		const response = await api.get("/api/actions");
		const actions = response.body.map((a) => a.action);
		expect(actions).toContain("delete");
	});
});

describe("viewing a specific action", () => {
	test("a specific action can be viewed", async () => {
		const actionsAtStart = await helper.actionsInDb();
		const actionToView = actionsAtStart[0];
		const resultAction = await api
			.get(`/api/actions/${actionToView.id}`)
			.expect(200)
			.expect("Content-Type", /application\/json/);
		const processedActionToView = JSON.parse(JSON.stringify(actionToView));
		expect(resultAction.body).toEqual(processedActionToView);
	});

	test("falls with 404 if action doesnt exist", async () => {
		const validNonexistingId = await helper.nonExistingId();
		console.log(validNonexistingId);
		await api.get(`/api/actions/${validNonexistingId}`).expect(404);
	});

	test("falls with 400 id is invalid", async () => {
		const invalidId = "5a3d5da59070081a82a3445";
		await api.get(`/api/actions/${invalidId}`).expect(400);
	});
});

describe("addition of a new action", () => {
	test("a valid action can be added", async () => {
		const users = await userHelper.usersInDb();
		const newAction = {
			action: "update",
			user: users[0].id,
		};
		await api
			.post("/api/actions")
			.send(newAction)
			.expect(200)
			.expect("Content-Type", /application\/json/);
		const actionsAtEnd = await helper.actionsInDb();
		expect(actionsAtEnd).toHaveLength(helper.initialActions.length + 1);
		const actions = actionsAtEnd.map((a) => a.action);
		expect(actions).toContain("update");
	});

	test("action with bad name is added", async () => {
		const newAction = {
			action: "badaction",
			user: "618e5680c0e7bf95a698987a",
		};
		await api.post("/api/actions").send(newAction).expect(400);
		const actionsAtEnd = await helper.actionsInDb();
		expect(actionsAtEnd).toHaveLength(helper.initialActions.length);
	});
});

describe("deletion of a node", () => {
	test("an action can be deleted", async () => {
		const actionsAtStart = await helper.actionsInDb();
		const actionToDelete = actionsAtStart[0];
		await api.delete(`/api/users/${actionToDelete.id}`).expect(204);
		const actionsAtEnd = await helper.actionsInDb();
		expect(actionsAtEnd).toHaveLength(helper.initialActions.length - 1);
		const actions = actionsAtEnd.map((a) => a.action);
		expect(actions).not.toContain(actionToDelete.action);
	});
});

afterAll(() => {
	mongoose.connection.close();
});
