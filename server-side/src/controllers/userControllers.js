const users = require("../../data/users");
const { cloudinaryFolder } = require("../../secrets");
const cloudinary = require("../helpers/cloudinaryConfig");

const { successResponse } = require("../helpers/responseHelpers");
const User = require("../models/userModel");
const UserProfile = require("../models/userProfileModel");
const {
	UserRegisterService,
	ResendOTPService,
	VerifyUserService,
	UserLoginService,
	UpdateImageService,
	UpdateProfileService,
	UpdateUserService,
	ReadProfileService,
} = require("../services/userServices");

//*============User-Controllers =============

exports.register = async (req, res, next) => {
	try {
		const BasicUser = await UserRegisterService(req, res);

		return successResponse(res, {
			statusCode: 200,
			message: "OTP send to email!",
			payload: {
				BasicUser,
			},
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

exports.resendOTP = async (req, res, next) => {
	try {
		const BasicUser = await ResendOTPService(req, res);

		return successResponse(res, {
			statusCode: 200,
			message: "OTP re-send to email!",
			payload: {
				BasicUser,
			},
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

exports.userVerify = async (req, res, next) => {
	try {
		const data = await VerifyUserService(req, res);

		return successResponse(res, {
			statusCode: 200,
			message: "User is Verified!",
			payload: {
				user: data.user,
				userImage: data.userProfileImage,
			},
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

exports.userLogin = async (req, res, next) => {
	try {
		const data = await UserLoginService(req, res);

		return successResponse(res, {
			statusCode: 200,
			message: "User Loggedin Successfully!",
			payload: {
				user: data.user,
				userImage: data.userProfileImage,
			},
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

exports.userLogout = async (req, res, next) => {
	try {
		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");

		return successResponse(res, {
			statusCode: 200,
			message: "Logout Successfully",
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

exports.userContextData = async (req, res, next) => {
	try {
		const userId = req.user._id;

		const databaseUser = await User.findById(userId, "-password").lean();

		if (databaseUser.isBanned === true) {
			return res.json({
				error: "Banned",
				message: "User is Banned!",
			});
		}

		const userProfile = await UserProfile.findOne(
			{
				userId: databaseUser._id,
			},
			"userImage"
		);
		const userProfileImage = userProfile.userImage;

		return successResponse(res, {
			statusCode: 200,
			message: "User Loggedin Successfully!",
			payload: {
				protected: true,
				user: {
					username: databaseUser.username,
					email: databaseUser.email,
					status: databaseUser.status,
					role: databaseUser.role,
					isBanned: databaseUser.isBanned,
				},
				image: userProfileImage,
			},
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

exports.createUserProfile = async (req, res, next) => {
	try {
		const { userId } = req.params;

		const userProfile = await new UserProfile({
			userId: userId,
			cus_add: "Dhaka",
			cus_city: "Dhaka",
			cus_country: "Bangladesh",
			cus_fax: "01774688159",
			cus_name: "Rabbil Hasan",
			cus_phone: "01774688159",
			cus_postcode: "1200",
			cus_state: "Dhaka",
			ship_add: "Dhaka",
			ship_city: "Dhaka",
			ship_country: "Bangladesh",
			ship_name: "Rabbil Hasan",
			ship_phone: "Bangladesh",
			ship_postcode: "1200",
			ship_state: "Dhaka",
		}).save();

		res.status(201).json({
			status: "Success",
			userProfile,
		});
	} catch (error) {
		next(error);
	}
};

exports.updateProfile = async (req, res, next) => {
	try {
		const updatedMessage = await UpdateProfileService(req);

		return successResponse(res, {
			statusCode: 200,
			message: "Profile Updated",
			payload: {
				updatedMessage,
			},
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

exports.updateProfileImage = async (req, res, next) => {
	try {
		const userImage = await UpdateImageService(req);

		return successResponse(res, {
			statusCode: 200,
			message: "User Image Updated Successfully!",
			payload: {
				userImage,
			},
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

exports.updateUser = async (req, res, next) => {
	try {
		const updatedUser = await UpdateUserService(req, res);

		return successResponse(res, {
			statusCode: 200,
			message: "User Updated Successfully",
			payload: {
				updatedUser,
			},
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

exports.readProfile = async (req, res, next) => {
	try {
		const fetchedUserProfile = await ReadProfileService(req);

		return successResponse(res, {
			statusCode: 200,
			message: "User Profile Fetched Successfully",
			payload: {
				fetchedUserProfile,
			},
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

exports.createUsers = async (req, res, next) => {
	try {
		await User.deleteMany({});

		const userLists = await User.insertMany(users);

		res.status(201).json({
			status: "Success",
			userLists,
		});
	} catch (error) {
		next(error);
	}
};
