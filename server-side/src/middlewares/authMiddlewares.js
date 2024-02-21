const {
	jwtAccessTokenSecretKey,
	jwtRefreshTokenSecretKey,
	jwtAccessTokenExpTime,
} = require("../../secrets");
const {
	decodeJsonWebToken,
	createJsonWebToken,
} = require("../helpers/jsonWebToken");
const createError = require("http-errors");

exports.requireLogIn = async (req, res, next) => {
	try {
		const { accessToken, refreshToken } = req.cookies;

		if (!accessToken && !refreshToken) {
			return res
				.status(401)
				.json({ status: "Login Again", message: "No Token Exist" });
		}
		if (accessToken && !refreshToken) {
			res.clearCookie("accessToken");
			return res
				.status(400)
				.json({ status: "Login Again", message: "No Token Exist" });
		}
		if (!accessToken && refreshToken) {
			const decoded = decodeJsonWebToken(
				refreshToken,
				jwtRefreshTokenSecretKey
			);

			if (decoded.error) {
				throw createError(401, decoded.error);
			} else {
				const accessToken = createJsonWebToken(
					{ _id: decoded._id },
					jwtAccessTokenSecretKey,
					jwtAccessTokenExpTime
				);

				// Set access token cookie
				res.cookie("accessToken", accessToken, {
					expires: new Date(Date.now() + 1000 * 60 * 10), //10 minutes
					httpOnly: true,
					path: "/",
					secure: true,
					sameSite: "Lax",
				});

				req.user = decoded;
				return next();
			}
		}
		if (accessToken && refreshToken) {
			const decoded = decodeJsonWebToken(
				accessToken,
				jwtAccessTokenSecretKey
			);

			if (decoded.error) {
				throw createError(401, decoded.error);
			} else {
				req.user = decoded;
				return next();
			}
		}
	} catch (error) {
		return next(error);
	}
};

exports.checkLoggedOut = async (req, res, next) => {
	try {
		const { accessToken } = req.cookies;

		if (accessToken) {
			try {
				const decoded = decodeJsonWebToken(
					accessToken,
					jwtAccessTokenSecretKey
				);
				if (decoded._id) {
					return res.json({ message: "Already Loggedin" });
				}
			} catch (error) {
				throw error;
			}
		}
		next();
	} catch (error) {
		return next(error);
	}
};

exports.checkLoggedIn = async (req, res, next) => {
	try {
		const { accessToken, refreshToken } = req.cookies;

		if (!accessToken && !refreshToken) {
			return res.json({ message: "Already logged out" });
		} else {
			next();
		}
	} catch (error) {
		return next(error);
	}
};

exports.isProtected = async (req, res, next) => {
	try {
		const { accessToken, refreshToken } = req.cookies;

		if (!accessToken && !refreshToken) {
			return res.json({
				status: "Login Again",
				message: "No Token Exist",
			});
		}
		if (accessToken && !refreshToken) {
			res.clearCookie("accessToken");
			return res.json({
				status: "Login Again",
				message: "No Token Exist",
			});
		}
		if (!accessToken && refreshToken) {
			const decoded = decodeJsonWebToken(
				refreshToken,
				jwtRefreshTokenSecretKey
			);

			if (decoded.error) {
				throw createError(401, decoded.error);
			} else {
				const accessToken = createJsonWebToken(
					{ _id: decoded._id },
					jwtAccessTokenSecretKey,
					jwtAccessTokenExpTime
				);

				// Set access token cookie
				res.cookie("accessToken", accessToken, {
					expires: new Date(Date.now() + 1000 * 60 * 10), //10 minutes
					httpOnly: true,
					path: "/",
					secure: true,
					sameSite: "Lax",
				});

				req.user = decoded;
				return next();
			}
		}
		if (accessToken && refreshToken) {
			const decoded = decodeJsonWebToken(
				accessToken,
				jwtAccessTokenSecretKey
			);

			if (decoded.error) {
				throw createError(401, decoded.error);
			} else {
				req.user = decoded;
				return next();
			}
		}
	} catch (error) {
		return next(error);
	}
};
