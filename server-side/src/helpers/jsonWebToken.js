const jwt = require("jsonwebtoken");

exports.createJsonWebToken = (payload, secretKey, expiresIn) => {
	if (typeof payload !== "object" || !payload) {
		throw new Error("Payload must be a non-empty object!");
	}
	if (typeof secretKey !== "string" || secretKey === "") {
		throw new Error("Secret key must be non empty!");
	}
	try {
		const token = jwt.sign(payload, secretKey, { expiresIn });
		return token;
	} catch (error) {
		console.error("Failed to generate JWT:", error);
		throw error;
	}
};

exports.decodeJsonWebToken = (token, secretKey) => {
	try {
		const decoded = jwt.verify(token, secretKey);
		return decoded;
	} catch (err) {
		if (err.name === "TokenExpiredError") {
			return { error: "Token expired" };
		} else {
			return { error: "Failed to authenticate token" };
		}
	}
};
