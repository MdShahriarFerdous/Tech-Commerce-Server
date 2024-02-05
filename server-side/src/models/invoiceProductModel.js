const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const invoiceProductSchema = new mongoose.Schema(
	{
		userId: { type: ObjectId, required: true, ref: "User" },
		productId: { type: ObjectId, required: true, ref: "Product" },
		invoiceId: { type: ObjectId, required: true, ref: "Invoice" },
		qty: { type: String, required: true, trim: true, default: "0" },
		price: { type: Number, required: true, default: 0 },
		color: { type: String, trim: true, required: true, default: "N/A" },
		size: { type: String, trim: true, required: true, default: "N/A" },
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const InvoiceProduct = mongoose.model("InvoiceProduct", invoiceProductSchema);
module.exports = InvoiceProduct;
