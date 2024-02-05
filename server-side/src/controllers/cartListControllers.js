const {
	SaveToCartListService,
	RemoveFromCartListService,
	GetCartListService,
	UpdateCartListService,
} = require("../services/cartListServices");
const { successResponse } = require("../helpers/responseHelpers");

exports.getCartList = async (req, res, next) => {
	try {
		const cartListData = await GetCartListService(req);
		return successResponse(res, {
			statusCode: 200,
			message: "Cart List Data Returned Successfully",
			payload: { cartListData },
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

exports.saveToCartList = async (req, res, next) => {
	try {
		const saveMessage = await SaveToCartListService(req);

		return successResponse(res, {
			statusCode: 201,
			message: saveMessage,
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

exports.updateCartList = async (req, res, next) => {
	try {
		const updatedMessage = await UpdateCartListService(req);

		return successResponse(res, {
			statusCode: 200,
			message: updatedMessage,
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

exports.removeFromCartList = async (req, res, next) => {
	try {
		const removedMessage = await RemoveFromCartListService(req);

		return successResponse(res, {
			statusCode: 200,
			message: removedMessage,
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};
