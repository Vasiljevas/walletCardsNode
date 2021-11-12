import express from "express";
import User from "../models/user.js";

const usersRouter = express.Router();

usersRouter.get("/", (req, res, next) => {
	User.find({})
		.then((users) => {
			res.json(users);
		})
		.catch((err) => next(err));
});

usersRouter.get("/:id", (req, res, next) => {
	User.findById(req.params.id)
		.then((user) => {
			if (user) {
				res.json(user);
			} else {
				res.status(404).end();
			}
		})
		.catch((err) => next(err));
});

usersRouter.post("/", (req, res, next) => {
	const body = req.body;

	const newUser = new User({
		name: body.name,
		phoneNumber: body.phoneNumber,
	});

	newUser
		.save()
		.then((savedUser) => savedUser.toJSON())
		.then((savedAndFormattedUser) => {
			res.json(savedAndFormattedUser);
		})
		.catch((err) => next(err));
});

usersRouter.delete("/:id", (req, res, next) => {
	User.findByIdAndRemove(req.params.id)
		.then((result) => {
			res.status(204).end();
		})
		.catch((err) => next(err));
});

usersRouter.put("/:id", (req, res, next) => {
	const body = req.body;

	const nUser = {
		name: body.name,
		phoneNumber: body.phoneNumber,
	};
	User.findByIdAndUpdate(req.params.id, nUser, { new: true })
		.then((result) => {
			res.json(result);
		})
		.catch((err) => next(err));
});

export default usersRouter;
