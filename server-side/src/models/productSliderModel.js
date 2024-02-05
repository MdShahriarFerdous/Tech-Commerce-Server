const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSliderSchema = new mongoose.Schema(
	{
		title: { type: String, trim: true, required: true, default: "N/A" },
		des: { type: String, trim: true, required: true, default: "N/A" },
		price: { type: String, trim: true, required: true, default: "0" },
		img: { type: String, trim: true, required: true, default: "N/A" },
		productId: { type: ObjectId, ref: "Product", required: true },
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const ProductSlider = mongoose.model("ProductSlider", productSliderSchema);
module.exports = ProductSlider;
