const User = require("../models/userModel");
const { hashPassword, comparePassword } = require("../helpers/hashPass");
const {
	createJsonWebToken,
	decodeJsonWebToken,
} = require("../helpers/jsonWebToken");
const {
	registerVerifySecretKey,
	registerVerifyExpTime,
	jwtAccessTokenSecretKey,
	jwtAccessTokenExpTime,
	jwtRefreshTokenSecretKey,
	jwtRefreshTokenExpTime,
	cloudinaryFolder,
} = require("../../secrets");
const { sendEmail } = require("../helpers/sendEmail");
const createError = require("http-errors");
const UserProfile = require("../models/userProfileModel");
const cloudinary = require("../helpers/cloudinaryConfig");

exports.UserRegisterService = async (req, res) => {
	try {
		//1. Destructuring from req body
		const { username, email, password } = req.body;

		//2. Validating
		if (!email) {
			return res.json({ error: "Email is required!" });
		}

		if (!password || password.length < 6) {
			return res.json({
				error: "Password must be at least 6 characters long",
			});
		}

		//3. Checking if email is already taken
		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.json({ error: "Email is already taken!" });
		}

		//4. Generating OTP
		let OTPCode = Math.floor(100000 + Math.random() * 900000);
		//5. Generating register token
		const registerToken = createJsonWebToken(
			{ username, email, password, OTPCode },
			registerVerifySecretKey,
			registerVerifyExpTime
		);
		//6. Setting token to cookie
		res.cookie("registerToken", registerToken, {
			expires: new Date(Date.now() + 1000 * 60 * 2), //2 minutes
			httpOnly: true,
			path: "/",
			secure: true,
			sameSite: "Strict",
		});

		//Create Email Data
		const emailData = {
			email,
			subject: "OTP for Registration Process",
			html: `<h2>Hello ${username}!</h2>
								<h4>Use this OTP code - <strong>${OTPCode}</strong> to complete the registration process. Please note that this OTP code will expire in 2 minutes.</h4>`,
		};
		//Send Email Data
		await sendEmail(emailData);

		//for setting local storage
		const BasicUser = {
			username,
			email,
			password,
		};
		return BasicUser;
	} catch (error) {
		return error;
	}
};

exports.ResendOTPService = async (req, res) => {
	try {
		const { username, email, password } = req.params;
		if (!username || !email || !password) {
			return res.json({ error: "Do the register process again!" });
		}
		//3. Checking if email is already taken
		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.json({ error: "Email is already taken!" });
		}

		//4. Generating OTP
		let OTPCode = Math.floor(100000 + Math.random() * 900000);
		//5. Generating register token
		const registerToken = createJsonWebToken(
			{ username, email, password, OTPCode },
			registerVerifySecretKey,
			registerVerifyExpTime
		);

		res.clearCookie("registerToken");

		//6. Setting token to cookie
		res.cookie("registerToken", registerToken, {
			expires: new Date(Date.now() + 1000 * 60 * 2), //2 minutes
			httpOnly: true,
			path: "/",
			secure: true,
			sameSite: "Strict",
		});

		//Create Email Data
		const emailData = {
			email,
			subject: "OTP for Registration Process",
			html: `<h2>Hello ${username}!</h2>
										<h4>Use this OTP code - <strong>${OTPCode}</strong> to complete the registration process. Please note that this OTP code will expire in 2 minutes.</h4>`,
		};
		//Send Email Data
		await sendEmail(emailData);

		//for setting local storage
		const BasicUser = {
			username,
			email,
			password,
		};
		return BasicUser;
	} catch (error) {
		return error;
	}
};

exports.VerifyUserService = async (req, res) => {
	try {
		const { OTP } = req.body;
		const { registerToken } = req.cookies;
		if (!OTP || !registerToken) {
			return res.json({
				error: "OTP or Credential data is not provided",
			});
		}

		const decoded = decodeJsonWebToken(
			registerToken,
			registerVerifySecretKey
		);
		if (decoded.error) {
			throw createError(401, decoded.error);
		}

		// Extract necessary information from the decoded object
		const { username, email, password, OTPCode } = decoded;

		if (OTPCode !== Number(OTP)) {
			return res.json({ error: "OTP does not match!" });
		}

		//hash password
		const hashedPassword = await hashPassword(password);

		//create user
		const registeredUser = await new User({
			username: username,
			email: email,
			password: hashedPassword,
			status: "Verified",
		}).save();

		//create profile
		const userProfile = await UserProfile.create({
			userId: registeredUser._id,
		});

		//generate accessToken
		const accessToken = createJsonWebToken(
			{ _id: registeredUser._id },
			jwtAccessTokenSecretKey,
			jwtAccessTokenExpTime
		);

		//generate refreshToken
		const refreshToken = createJsonWebToken(
			{ _id: registeredUser._id },
			jwtRefreshTokenSecretKey,
			jwtRefreshTokenExpTime
		);

		if (res.cookie("registerToken")) {
			res.clearCookie("registerToken");
		}

		res.cookie("accessToken", accessToken, {
			expires: new Date(Date.now() + 1000 * 60 * 15), //15 minutes
			httpOnly: true,
			path: "/",
			secure: true,
			sameSite: "Strict",
		});

		res.cookie("refreshToken", refreshToken, {
			expires: new Date(Date.now() + 1000 * 60 * 60 * 12), //12 hr
			httpOnly: true,
			path: "/",
			secure: true,
			sameSite: "Strict",
		});

		const user = {
			username: registeredUser.username,
			email: registeredUser.email,
			status: registeredUser.status,
			role: registeredUser.role,
			isBanned: registeredUser.isBanned,
		};
		const userProfileImage = userProfile.userImage;

		return { user, userProfileImage };
	} catch (error) {
		return error;
	}
};

exports.UserLoginService = async (req, res) => {
	try {
		const { email, password } = req.body;

		// 1. all fields require validation
		if (!email || !password) {
			return res.json({ error: "Missing Credentials" });
		}

		// 2. check if email exist
		const databaseUser = await User.findOne({ email });

		if (!databaseUser) {
			return res.json({ error: "User account not found" });
		}

		if (databaseUser.isBanned === true) {
			return res.json({
				status: "Banned",
				message: "Sorry! you are banned, please talk to admin",
			});
		}

		// 3. compare password
		const match = await comparePassword(password, databaseUser.password);
		if (!match) {
			return res.json({ error: "Invalid password" });
		}

		//generate accessToken
		const accessToken = createJsonWebToken(
			{ _id: databaseUser._id },
			jwtAccessTokenSecretKey,
			jwtAccessTokenExpTime
		);

		//generate refreshToken
		const refreshToken = createJsonWebToken(
			{ _id: databaseUser._id },
			jwtRefreshTokenSecretKey,
			jwtRefreshTokenExpTime
		);

		res.cookie("accessToken", accessToken, {
			expires: new Date(Date.now() + 1000 * 60 * 10), //10 minutes
			httpOnly: true,
			path: "/",
			domain: "plainb-tech-commerce-pied.vercel.app",
			secure: true,
			sameSite: "Strict",
		});

		res.cookie("refreshToken", refreshToken, {
			expires: new Date(Date.now() + 1000 * 60 * 60 * 12), //12 hr
			httpOnly: true,
			path: "/",
			domain: "plainb-tech-commerce-pied.vercel.app",
			secure: true,
			sameSite: "Strict",
		});

		const user = {
			username: databaseUser.username,
			email: databaseUser.email,
			status: databaseUser.status,
			role: databaseUser.role,
			isBanned: databaseUser.isBanned,
		};

		const userProfile = await UserProfile.findOne(
			{
				userId: databaseUser._id,
			},
			"userImage"
		);
		const userProfileImage = userProfile.userImage;

		return { user, userProfileImage };
	} catch (error) {
		return error;
	}
};

exports.UpdateProfileService = async (req) => {
	try {
		await UserProfile.findOneAndUpdate({ userId: req.user._id }, req.body, {
			new: true,
		}).select("-userImage");
		return "Updated";
	} catch (error) {
		return error;
	}
};

exports.UpdateImageService = async (req) => {
	try {
		const userId = req.user._id;

		if (req.file) {
			const { path } = req.file || {};
			const userPublicId = `user_${userId}_profile_image`;

			const uploadToCloudinary = await cloudinary.uploader.upload(path, {
				folder: `${cloudinaryFolder}/user`,
				public_id: userPublicId,
				overwrite: true,
				invalidate: true,
			});

			const profile = await UserProfile.findOneAndUpdate(
				{ userId: userId },
				{ userImage: uploadToCloudinary.secure_url },
				{ new: true }
			);

			const userImage = profile ? profile.userImage : null;

			return userImage;
		}
	} catch (error) {
		return error;
	}
};

exports.UpdateUserService = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = User.findById(req.user._id);

		if (password && password.length < 6) {
			return res.json({
				error: "Password must be at least 6 characters long",
			});
		}

		const hashedPassword = password
			? await hashPassword(password)
			: undefined;

		const updatedUser = await User.findByIdAndUpdate(
			{ _id: req.user._id },
			{
				username: username || user.username,
				password: hashedPassword || user.password,
			},
			{ new: true }
		);

		const updateUser = {
			username: updatedUser.username,
			email: updatedUser.email,
			status: updatedUser.status,
			role: updatedUser.role,
			isBanned: updatedUser.isBanned,
		};

		if (username && password) {
			return updateUser;
		} else if (username) {
			return updateUser;
		} else {
			return "Password Updated Successfully!";
		}
	} catch (error) {
		return error;
	}
};

exports.ReadProfileService = async (req) => {
	try {
		const userId = req.user._id;

		const fetchedUserProfile = await UserProfile.find(
			{ userId: userId },
			"-userImage -_id -userId -createdAt -updatedAt"
		).lean();

		return fetchedUserProfile;
	} catch (error) {
		return error;
	}
};
