const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
	{
		categoryName: {
			type: String,
			unique: true,
			trim: true,
			required: true,
		},
		categoryImg: { type: String, required: true, trim: true },
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
