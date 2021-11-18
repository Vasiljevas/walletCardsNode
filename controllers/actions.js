import express from "express";
import ActionsService from "../services/actions.js";

const actionsRouter = express.Router();

actionsRouter.get("/", async (req, res, next) => {
	try {
		const actions = await ActionsService.getAllActions();
		res.json(actions);
	} catch (e) {
		next(e);
	}
});

actionsRouter.get("/:id", async (req, res, next) => {
	try {
		const action = await ActionsService.getActionById(req.params.id);
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
	try {
		await ActionsService.createAction(req.body);
		res.status(204).end();
	} catch (err) {
		next(err);
	}
});

actionsRouter.delete("/:id", async (req, res, next) => {
	try {
		await ActionsService.deleteAction(req.params.id);
		res.status(204).end();
	} catch (e) {
		next(e);
	}
});

actionsRouter.put("/:id", async (req, res, next) => {
	try {
		await ActionsService.updateAction(req.params.id, req.body);
		res.status(204).end();
	} catch (e) {
		next(e);
	}
});

export default actionsRouter;
