const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userProfileSchema = new mongoose.Schema(
	{
		userId: { type: ObjectId, required: true },
		userImage: {
			type: String,
			default:
				"https://res.cloudinary.com/dktnokbnw/image/upload/v1702530434/wetravel/user/profileImage_qdwwkv.png",
		},
		cus_add: { type: String, trim: true, default: "N/A" },
		cus_city: { type: String, trim: true, default: "N/A" },
		cus_country: { type: String, trim: true, default: "N/A" },
		cus_fax: { type: String, trim: true, default: "N/A" },
		cus_name: { type: String, trim: true, default: "N/A" },
		cus_phone: { type: String, trim: true, default: "xx-xx-xx" },
		cus_postcode: { type: String, trim: true, default: "N/A" },
		cus_state: { type: String, trim: true, default: "N/A" },
		ship_add: { type: String, trim: true, default: "N/A" },
		ship_city: { type: String, trim: true, default: "N/A" },
		ship_country: { type: String, trim: true, default: "N/A" },
		ship_name: { type: String, trim: true, default: "N/A" },
		ship_phone: { type: String, trim: true, default: "xx-xx-xx" },
		ship_postcode: { type: String, trim: true, default: "N/A" },
		ship_state: { type: String, trim: true, default: "N/A" },
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const UserProfile = mongoose.model("UserProfile", userProfileSchema);
module.exports = UserProfile;
