const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		username: { type: String, trim: true, maxLength: 32, required: true },
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			trim: true,
			lowercase: true,
			validate: {
				validator: function (value) {
					return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
						value
					);
				},
				message: "Given Email is not valid",
			},
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minLength: [6, "Password Length should be at least 6 characters"],
		},
		role: { type: String, default: "Customer" }, //customer, seller, admin
		isBanned: { type: Boolean, default: false },
		status: { type: String, trim: true, default: "Not Verified" },
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const User = mongoose.model("User", userSchema);
module.exports = User;
