const mongoose = require("mongoose");

const featureSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		description: { type: String, required: true, trim: true },
		img: { type: String, required: true, trim: true },
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const Feature = mongoose.model("Feature", featureSchema);
module.exports = Feature;
