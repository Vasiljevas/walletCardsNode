import express from "express";
import Action from "../models/actions.js";
import User from "../models/user.js";

const actionsRouter = express.Router();

actionsRouter.get("/", async (req, res, next) => {
	try {
		const actions = await Action.find({});
		res.json(actions);
	} catch (e) {
		next(e);
	}
});

actionsRouter.get("/:id", async (req, res, next) => {
	try {
		const action = await Action.findById(req.params.id);
		if (action) {
			res.json(action);
		} else {
			res.status(404).end();
		}
	} catch (e) {
		next(e);
	}
});

actionsRouter.post("/", async (req, res, next) => {
	const body = req.body;

	const user = await User.findById(body.userId);

	const newAction = new Action({
		action: body.action,
		date: new Date(),
		user: user._id,
	});

	try {
		const savedAction = await newAction.save();
		user.actions = user.actions.concat(savedAction._id);
		await user.save();

		res.json(savedAction);
	} catch (err) {
		next(err);
	}
});

actionsRouter.delete("/:id", async (req, res, next) => {
	try {
		await Action.findByIdAndRemove(req.params.id);
		res.status(204).end();
	} catch (e) {
		next(e);
	}
});

actionsRouter.put("/:id", async (req, res, next) => {
	const body = req.body;

	const nAction = {
		name: body.name,
		phoneNumber: body.phoneNumber,
	};
	try {
		const updatedAction = await Action.findByIdAndUpdate(
			req.params.id,
			nAction,
			{
				new: true,
			}
		);
		res.json(updatedAction);
	} catch (e) {
		next(e);
	}
});

export default actionsRouter;
