const { successResponse } = require("../helpers/responseHelpers");
const {
	GetWishListService,
	SaveWishListService,
	RemoveWishListService,
} = require("../services/wishListServices");

exports.getWishList = async (req, res, next) => {
	try {
		const wishListData = await GetWishListService(req);

		return successResponse(res, {
			statusCode: 200,
			message: "Wishlist return successfully",
			payload: { wishListData },
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

exports.saveWishList = async (req, res, next) => {
	try {
		const savedMessage = await SaveWishListService(req);

		return successResponse(res, {
			statusCode: 201,
			message: savedMessage,
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

exports.removeWishList = async (req, res, next) => {
	try {
		const removedMessage = await RemoveWishListService(req);

		return successResponse(res, {
			statusCode: 200,
			message: removedMessage,
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};
