import mongoose from "mongoose";

const actionSchema = new mongoose.Schema({
	action: String,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	date: Date,
});

actionSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

export default mongoose.model("Action", actionSchema);
// module.exports = mongoose.model("Action", actionSchema); //for testing
