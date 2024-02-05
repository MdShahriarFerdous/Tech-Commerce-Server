const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
	{
		categoryId: { type: ObjectId, required: true },
		brandId: { type: ObjectId, required: true },
		title: {
			type: String,
			trim: true,
			required: true,
		},
		shortDes: { type: String, required: true, trim: true },
		price: { type: String, required: true, default: "0", trim: true },
		discount: { type: Boolean, required: true, default: false },
		discountPrice: {
			type: String,
			required: true,
			default: "0",
			trim: true,
		},
		image: { type: String, required: true, trim: true },
		star: { type: String, required: true, default: "0", trim: true },
		stock: { type: Boolean, required: true, default: false },
		remark: { type: String, required: true, default: "0", trim: true },
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
