const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const invoiceSchema = new mongoose.Schema(
	{
		userId: { type: ObjectId, required: true, ref: "User" },
		payable: { type: Number, required: true, default: 0 },
		cus_details: { type: String, required: true, trim: true },
		ship_details: { type: String, required: true, trim: true },
		tran_id: {
			type: String,
			required: true,
			trim: true,
			default: "tranId_0",
		},
		val_id: { type: String, required: true, trim: true, default: "0" },
		delivery_status: {
			type: String,
			required: true,
			trim: true,
			default: "Pending",
		},
		payment_status: {
			type: String,
			required: true,
			trim: true,
			default: "Pending",
		},
		total: { type: Number, required: true, default: 0 },
		vat: { type: Number, required: true, default: 0 },
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;
