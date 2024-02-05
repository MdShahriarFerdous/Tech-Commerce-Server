const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const reviewSchema = new mongoose.Schema(
	{
		userId: { type: ObjectId, required: true, ref: "User" },
		productId: { type: ObjectId, required: true, ref: "Product" },
		des: { type: String, required: true, trim: true },
		rating: { type: String, required: true, default: "0", trim: true },
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
