import dotenv from "dotenv/config";
import express from "express";
import { requestLogger, unknownEndpoint, errorHandler } from "./middleware.js";
import cors from "cors";
import User from "./models/user.js";

const app = express();

app.use(express.static("build"));
app.use(express.json());
app.use(requestLogger);
app.use(cors());

app.get("/", (req, res) => {
	res.send("<h1>Hello World</h1>");
});

app.get("/api/users", (req, res, next) => {
	User.find({})
		.then((users) => {
			res.json(users);
		})
		.catch((err) => next(err));
});

app.get("/api/users/:id", (req, res, next) => {
	User.findById(req.params.id)
		.then((user) => {
			if (user) {
				res.json(user);
			} else {
				res.status(404).end();
			}
		})
		.catch((err) => next(error));
});

app.post("/api/users", (req, res, next) => {
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

app.delete("/api/users/:id", (req, res, next) => {
	User.findByIdAndRemove(req.params.id)
		.then((result) => {
			res.status(204).end();
		})
		.catch((err) => next(err));
});

app.put("/api/users/:id", (req, res, next) => {
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

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
