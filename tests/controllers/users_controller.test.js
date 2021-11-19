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

describe("Users controller tests", () => {
	test("users are returned as json", async () => {
		await api
			.get("/api/users")
			.expect(200)
			.expect("Content-Type", /application\/json/);
	});

	test("all users are returned", async () => {
		const response = await api.get("/api/users");
		const dbUsers = await usersHelper.usersInDb();
		expect(response.body).toHaveLength(dbUsers.length);
	});

	test("a specific user can be viewed", async () => {
		const usersAtStart = await usersHelper.usersInDb();
		const userToView = usersAtStart[0];
		const resultUser = await api
			.get(`/api/users/${userToView.id}`)
			.expect(200)
			.expect("Content-Type", /application\/json/);
		const processedUserToView = JSON.parse(JSON.stringify(userToView));
		expect(resultUser.body).toEqual(processedUserToView);
	});

	test("falls with 400 id is invalid", async () => {
		const invalidId = "5a3d5da59070081a82a3445";
		await api.get(`/api/users/${invalidId}`).expect(400);
	});

	test("a valid user can be added", async () => {
		const newUser = {
			name: "thomas",
			phoneNumber: "+44123124",
		};
		await api.post("/api/users").send(newUser).expect(204);
		const usersAtEnd = await usersHelper.usersInDb();
		const users = usersAtEnd.map((u) => u.name);
		expect(users).toContain("thomas");
	});

	test("a user can be deleted", async () => {
		const usersAtStart = await usersHelper.usersInDb();
		const userToDelete = usersAtStart[0];
		await api.delete(`/api/users/${userToDelete.id}`).expect(204);
		const usersAtEnd = await usersHelper.usersInDb();
		expect(usersAtEnd).toHaveLength(usersAtStart.length - 1);
		const users = usersAtEnd.map((u) => u.name);
		expect(users).not.toContain(userToDelete.name);
	});

	test("a user can be updated", async () => {
		const users = await usersHelper.usersInDb();
		const newUser = {
			name: "newName",
			phoneNumber: "+3705235234",
		};
		await api.put(`/api/users/${users[0].id}`, newUser).expect(204);
	});
});

afterAll(() => {
	mongoose.connection.close();
});
