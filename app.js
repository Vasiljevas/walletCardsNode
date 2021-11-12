import express from "express";
import cors from "cors";
import config from "./utils/config.js";
import middleware from "./utils/middleware.js";
import logger from "./utils/logger.js";
import mongoose from "mongoose";
import usersRouter from "./controllers/users.js";
import actionsRouter from "./controllers/action.js";

const app = express();

mongoose
	.connect(config.MONGODB_URI)
	.then(() => {
		logger.info("connected to MongoDB");
	})
	.catch((error) => {
		logger.error("error connecting to MongoDB: ", error.message);
	});

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/users", usersRouter);
app.use("/api/actions", actionsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

// export default app;
module.exports = app; //for testing!
