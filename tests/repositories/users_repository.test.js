const mongoose = require("mongoose");
const User = require("../../models/user.js");
const Action = require("../../models/action.js");
const actionsHelper = require("../helpers/action_test_helper.js");
const usersHelper = require("../helpers/user_test_helper.js");
const app = require("../../app.js");
const UsersRepository = require("../../repositories/users.js");

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

describe("test mongoose user repo", () => {
	it("should return all users", async () => {
		const users = await UsersRepository.getAllUsers();
		const dbUsers = await usersHelper.usersInDb();
		expect(JSON.parse(JSON.stringify(users))).toMatchObject(dbUsers);
	});

	it("should return the user with findById", async () => {
		const dbUsers = await usersHelper.usersInDb();

		const oneUser = await UsersRepository.getUser(dbUsers[0].id);
		expect(JSON.parse(JSON.stringify(oneUser))).toMatchObject(dbUsers[0]);
	});

	it("should create user", async () => {
		const newUser = {
			name: "name",
			phoneNumber: "+37063363683",
		};
		const createdUser = await UsersRepository.createUser(newUser);
		const dbUsers = await usersHelper.usersInDb();
		expect(dbUsers[dbUsers.length - 1]).toMatchObject(
			JSON.parse(JSON.stringify(createdUser))
		);
	});

	it("should delete user", async () => {
		const dbUsers = await usersHelper.usersInDb();
		const deletedUser = await UsersRepository.deleteUser(dbUsers[0].id);
		const usersAtEnd = await usersHelper.usersInDb();
		expect(usersAtEnd).toHaveLength(dbUsers.length - 1);
		expect(usersAtEnd).not.toContain(
			JSON.parse(JSON.stringify(deletedUser))
		);
	});

	it("should update user", async () => {
		const dbUsers = await usersHelper.usersInDb();
		const updatedUser = {
			id: "618c04e461e81a7c6028022c",
			name: "newName",
			phoneNumber: "+3701231",
			actions: [],
		};
		await UsersRepository.updateUser(dbUsers[0].id, updatedUser);
		const usersAtEnd = await usersHelper.usersInDb();
		expect(JSON.parse(JSON.stringify(updatedUser))).toMatchObject(
			usersAtEnd[0]
		);
	});
});

afterAll(() => {
	mongoose.connection.close();
});
