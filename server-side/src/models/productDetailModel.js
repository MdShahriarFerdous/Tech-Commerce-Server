const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productDetailSchema = new mongoose.Schema(
	{
		img1: { type: String, trim: true, required: true, default: "N/A" },
		img2: { type: String, trim: true, required: true, default: "N/A" },
		img3: { type: String, trim: true, required: true, default: "N/A" },
		img4: { type: String, trim: true, required: true, default: "N/A" },
		img5: { type: String, trim: true, default: "N/A" },
		img6: { type: String, trim: true, default: "N/A" },
		img7: { type: String, trim: true, default: "N/A" },
		img8: { type: String, trim: true, default: "N/A" },
		des: { type: String, trim: true, required: true, default: "N/A" },
		color: { type: String, trim: true, required: true, default: "N/A" },
		size: { type: String, trim: true, required: true, default: "N/A" },
		productId: { type: ObjectId, ref: "Product", required: true },
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const ProductDetail = mongoose.model("ProductDetail", productDetailSchema);
module.exports = ProductDetail;
