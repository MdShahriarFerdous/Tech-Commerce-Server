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
		// const { accessToken, refreshToken } = req.cookies;

		// if (!accessToken && !refreshToken) {
		// 	return res
		// 		.status(401)
		// 		.json({ status: "Login Again", message: "No Token Exist" });
		// }
		// if (accessToken && !refreshToken) {
		// 	res.clearCookie("accessToken");
		// 	return res
		// 		.status(400)
		// 		.json({ status: "Login Again", message: "No Token Exist" });
		// }
		// if (!accessToken && refreshToken) {
		// 	const decoded = decodeJsonWebToken(
		// 		refreshToken,
		// 		jwtRefreshTokenSecretKey
		// 	);

		// 	if (decoded.error) {
		// 		throw createError(401, decoded.error);
		// 	} else {
		// 		const accessToken = createJsonWebToken(
		// 			{ _id: decoded._id },
		// 			jwtAccessTokenSecretKey,
		// 			jwtAccessTokenExpTime
		// 		);

		// 		// Set access token cookie
		// 		const accessTokenCookie = `accessToken=${accessToken}; Path=/; Expires=${new Date(
		// 			Date.now() + 1000 * 60 * 15
		// 		).toUTCString()}; HttpOnly; Secure; SameSite=Lax`;
		// 		res.setHeader("Set-Cookie", accessTokenCookie);

		// 		req.user = decoded;
		// 		return next();
		// 	}
		// }
		// if (accessToken && refreshToken) {
		// 	const decoded = decodeJsonWebToken(
		// 		accessToken,
		// 		jwtAccessTokenSecretKey
		// 	);

		// 	if (decoded.error) {
		// 		throw createError(401, decoded.error);
		// 	} else {
		// 		req.user = decoded;
		// 		return next();
		// 	}
		// }
		const token = req.headers.authorization;
		if (!token) {
			return res
				.status(401)
				.json({ status: "Login Again", message: "No Token Exist" });
		}
		if (token) {
			const decoded = decodeJsonWebToken(token, jwtRefreshTokenSecretKey);

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
		// const { accessToken } = req.cookies;
		const token = req.headers.authorization;

		if (token) {
			try {
				const decoded = decodeJsonWebToken(
					token,
					jwtRefreshTokenSecretKey
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
		// const { accessToken, refreshToken } = req.cookies;
		const token = req.headers.authorization;

		if (!token) {
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
		// const { accessToken, refreshToken } = req.cookies;
		const token = req.headers.authorization;

		// if (!accessToken && !refreshToken) {
		// 	return res.json({
		// 		status: "Login Again",
		// 		message: "No Token Exist",
		// 	});
		// }
		// if (accessToken && !refreshToken) {
		// 	res.clearCookie("accessToken");
		// 	return res.json({
		// 		status: "Login Again",
		// 		message: "No Token Exist",
		// 	});
		// }
		// if (!accessToken && refreshToken) {
		// 	const decoded = decodeJsonWebToken(
		// 		refreshToken,
		// 		jwtRefreshTokenSecretKey
		// 	);

		// 	if (decoded.error) {
		// 		throw createError(401, decoded.error);
		// 	} else {
		// 		const accessToken = createJsonWebToken(
		// 			{ _id: decoded._id },
		// 			jwtAccessTokenSecretKey,
		// 			jwtAccessTokenExpTime
		// 		);

		// 		// Set access token cookie
		// 		const accessTokenCookie = `accessToken=${accessToken}; Path=/; Expires=${new Date(
		// 			Date.now() + 1000 * 60 * 15
		// 		).toUTCString()}; HttpOnly; Secure; SameSite=Lax`;
		// 		res.setHeader("Set-Cookie", accessTokenCookie);

		// 		req.user = decoded;
		// 		return next();
		// 	}
		// }
		// if (accessToken && refreshToken) {
		// 	const decoded = decodeJsonWebToken(
		// 		accessToken,
		// 		jwtAccessTokenSecretKey
		// 	);

		// 	if (decoded.error) {
		// 		throw createError(401, decoded.error);
		// 	} else {
		// 		req.user = decoded;
		// 		return next();
		// 	}
		// }

		if (!token) {
			return res
				.status(401)
				.json({ status: "Login Again", message: "No Token Exist" });
		}
		if (token) {
			const decoded = decodeJsonWebToken(token, jwtRefreshTokenSecretKey);

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
