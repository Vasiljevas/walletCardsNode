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
