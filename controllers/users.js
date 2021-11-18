import express from "express";
import UsersService from "../services/users.js";

const usersRouter = express.Router();

usersRouter.get("/", async (req, res, next) => {
	try {
		const users = await UsersService.getAllUsers();
		res.json(users);
	} catch (e) {
		next(e);
	}
});

usersRouter.get("/:id", async (req, res, next) => {
	try {
		const user = await UsersService.getUser(req.params.id);
		if (user) {
			res.json(user);
		} else {
			res.status(404).end();
		}
	} catch (e) {
		next(e);
	}
});

usersRouter.post("/", async (req, res, next) => {
	try {
		await UsersService.createUser(req.body);
		res.status(204).end();
	} catch (err) {
		next(err);
	}
});

usersRouter.delete("/:id", async (req, res, next) => {
	try {
		await UsersService.deleteUser(req.params.id);
		res.status(204).end();
	} catch (e) {
		next(e);
	}
});

usersRouter.put("/:id", async (req, res, next) => {
	try {
		await UsersService.updateUser(req.params.id, req.body);
		res.status(204).end();
	} catch (e) {
		next(e);
	}
});

export default usersRouter;
