const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const cartSchema = new mongoose.Schema(
	{
		userId: { type: ObjectId, required: true, ref: "User" },
		productId: { type: ObjectId, required: true, ref: "Product" },
		color: { type: String, required: true, trim: true },
		qty: { type: String, required: true, default: "1", trim: true },
		size: { type: String, required: true, trim: true },
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
