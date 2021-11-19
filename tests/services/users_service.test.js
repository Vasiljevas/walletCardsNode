const mongoose = require("mongoose");
const actionsHelper = require("../helpers/action_test_helper.js");
const usersHelper = require("../helpers/user_test_helper.js");

const Action = require("../../models/action.js");
const User = require("../../models/user.js");

const app = require("../../app.js");

const UsersService = require("../../services/users.js");

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

describe("Getting users", () => {
	it("should get all users", async () => {
		const users = await UsersService.getAllUsers();
		const dbUsers = await usersHelper.usersInDb();
		expect(users).toHaveLength(dbUsers.length);
	});

	it("should get one specific user", async () => {
		const dbUsers = await usersHelper.usersInDb();
		const oneUser = await UsersService.getUser(dbUsers[0].id);
		expect(oneUser.id).toEqual(JSON.parse(JSON.stringify(dbUsers[0])).id);
	});
});

describe("Creating users", () => {
	it("should create a user", async () => {
		const dbUsers = await usersHelper.usersInDb();
		const dbActions = await actionsHelper.actionsInDb();

		const newUser = {
			name: "TestName",
			phoneNumber: "+3706123",
		};

		await UsersService.createUser(newUser);

		const usersAtEnd = await usersHelper.usersInDb();
		expect(usersAtEnd).toHaveLength(dbUsers.length + 1);

		const actionsAtEnd = await actionsHelper.actionsInDb();
		expect(actionsAtEnd).toHaveLength(dbActions.length + 1);
	});
});

describe("Deleting users", () => {
	it("should delete a user", async () => {
		const users = await usersHelper.usersInDb();

		await UsersService.deleteUser(users[0].id);

		const usersAtEnd = await usersHelper.usersInDb();

		expect(usersAtEnd).toHaveLength(users.length - 1);

		const actionsAtEnd = await actionsHelper.actionsInDb();

		const testActions = actionsAtEnd.filter(
			(action) => action.user.toString() === users[0].id
		);
		expect(testActions).toHaveLength(1);
		expect(testActions[0].action).toEqual("delete");
	});
});

describe("Updating users", () => {
	it("should update a user", async () => {
		const dbUsers = await usersHelper.usersInDb();
		const dbActions = await actionsHelper.actionsInDb();

		const updatedUser = {
			name: "Updated",
			phoneNumber: "+37066666",
			actions: [...dbUsers[0].actions],
		};

		await UsersService.updateUser(dbUsers[0].id, updatedUser);

		const usersAtEnd = await usersHelper.usersInDb();
		expect(usersAtEnd[0]).not.toEqual(dbUsers[0]);
		expect(usersAtEnd[0].actions).toHaveLength(
			dbUsers[0].actions.length + 1
		);

		const actionsAtEnd = await actionsHelper.actionsInDb();
		expect(actionsAtEnd).toHaveLength(dbActions.length + 1);
		expect(actionsAtEnd[actionsAtEnd.length - 1].action).toEqual("update");
	});
});

afterAll(() => {
	mongoose.connection.close();
});
