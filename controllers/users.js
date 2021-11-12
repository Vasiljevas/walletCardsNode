import express from "express";
import User from "../models/user.js";

const usersRouter = express.Router();

usersRouter.get("/", async (req, res, next) => {
	try {
		// const users = await User.find({}).populate("notes");
		const users = await User.find({});
		res.json(users);
	} catch (e) {
		next(e);
	}
});

usersRouter.get("/:id", async (req, res, next) => {
	try {
		const user = await User.findById(req.params.id);
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
	const body = req.body;

	const newUser = new User({
		name: body.name,
		phoneNumber: body.phoneNumber,
		actions: [],
	});

	try {
		const savedUser = await newUser.save();
		res.json(savedUser);
	} catch (err) {
		next(err);
	}
});

usersRouter.delete("/:id", async (req, res, next) => {
	try {
		await User.findByIdAndRemove(req.params.id);
		res.status(204).end();
	} catch (e) {
		next(e);
	}
});

usersRouter.put("/:id", async (req, res, next) => {
	const body = req.body;

	const nUser = {
		name: body.name,
		phoneNumber: body.phoneNumber,
		actions: [],
	};
	try {
		const updatedUser = await User.findByIdAndUpdate(req.params.id, nUser, {
			new: true,
		});
		res.json(updatedUser);
	} catch (e) {
		next(e);
	}
});

export default usersRouter;
