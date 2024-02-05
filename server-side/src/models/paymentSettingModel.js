const mongoose = require("mongoose");

const paymentSettingSchema = new mongoose.Schema(
	{
		settingsId: { type: String, required: true, trim: true },
		store_id: {
			type: String,
			trim: true,
			required: true,
		},
		store_passwd: { type: String, required: true, trim: true },
		currency: { type: String, required: true, trim: true },
		success_url: { type: String, required: true, trim: true },
		fail_url: { type: String, required: true, trim: true },
		cancel_url: { type: String, required: true, trim: true },
		ipn_url: { type: String, required: true, trim: true },
		init_url: { type: String, required: true, trim: true },
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const PaymentSetting = mongoose.model("PaymentSetting", paymentSettingSchema);
module.exports = PaymentSetting;
