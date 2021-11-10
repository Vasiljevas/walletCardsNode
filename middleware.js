export const requestLogger = (req, res, next) => {
	console.log("Method:", req.method);
	console.log("Path:", req.path);
	console.log("Body:", req.body);
	console.log("---");
	next();
};

export const unknownEndpoint = (req, res) => {
	res.status(400).send({ error: "unknown endpoint" });
};

export const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message });
	}

	next(error);
};
