exports.errorResponse = (
	res,
	{ statusCode = 500, message = "Internal Server Error" }
) => {
	return res.status(statusCode).json({
		success: false,
		message,
	});
};

exports.successResponse = (
	res,
	{ statusCode = 200, message = "Returned successfully", payload = {} }
) => {
	return res.status(statusCode).json({
		success: true,
		message,
		payload,
	});
};
