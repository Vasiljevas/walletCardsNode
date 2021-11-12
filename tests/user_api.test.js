const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app.js");
const helper = require("./user_test_helper.js");
const api = supertest(app);

const User = require("../models/user.js");

beforeEach(async () => {
	await User.deleteMany({});
	await User.insertMany(helper.initialUsers);
});

describe("when there is initially some users saved", () => {
	test("users are returned as json", async () => {
		await api
			.get("/api/users")
			.expect(200)
			.expect("Content-Type", /application\/json/);
	});

	test("all users are returned", async () => {
		const response = await api.get("/api/users");
		expect(response.body).toHaveLength(helper.initialUsers.length);
	});

	test("specific user is within users", async () => {
		const response = await api.get("/api/users");
		const names = response.body.map((u) => u.name);
		expect(names).toContain("Tomas");
	});
});

describe("viewing a specific user", () => {
	test("a specific user can be viewed", async () => {
		const usersAtStart = await helper.usersInDb();
		const userToView = usersAtStart[0];
		const resultUser = await api
			.get(`/api/users/${userToView.id}`)
			.expect(200)
			.expect("Content-Type", /application\/json/);
		const processedUserToView = JSON.parse(JSON.stringify(userToView));
		expect(resultUser.body).toEqual(processedUserToView);
	});

	test("falls with 404 if user doesnt exist", async () => {
		const validNonexistingId = await helper.nonExistingId();
		console.log(validNonexistingId);
		await api.get(`/api/users/${validNonexistingId}`).expect(404);
	});

	test("falls with 400 id is invalid", async () => {
		const invalidId = "5a3d5da59070081a82a3445";
		await api.get(`/api/users/${invalidId}`).expect(400);
	});
});

describe("addition of a new user", () => {
	test("a valid user can be added", async () => {
		const newUser = {
			name: "Homer",
			phoneNumber: "+370684123",
		};
		await api
			.post("/api/users")
			.send(newUser)
			.expect(200)
			.expect("Content-Type", /application\/json/);
		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toHaveLength(helper.initialUsers.length + 1);
		const names = usersAtEnd.map((u) => u.name);
		expect(names).toContain("Homer");
	});

	test("user without name is not added", async () => {
		const newUser = {
			phoneNumber: "+370523532",
		};
		await api.post("/api/users").send(newUser).expect(400);
		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toHaveLength(helper.initialUsers.length);
	});
});

describe("deletion of a node", () => {
	test("a user can be deleted", async () => {
		const usersAtStart = await helper.usersInDb();
		const userToDelete = usersAtStart[0];
		await api.delete(`/api/users/${userToDelete.id}`).expect(204);
		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toHaveLength(helper.initialUsers.length - 1);
		const names = usersAtEnd.map((u) => u.name);
		expect(names).not.toContain(userToDelete.name);
	});
});

afterAll(() => {
	mongoose.connection.close();
});
