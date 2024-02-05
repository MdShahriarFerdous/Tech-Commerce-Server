const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const wishlistSchema = new mongoose.Schema(
	{
		userId: { type: ObjectId, required: true, ref: "User" },
		productId: { type: ObjectId, required: true, ref: "Product" },
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
module.exports = Wishlist;
