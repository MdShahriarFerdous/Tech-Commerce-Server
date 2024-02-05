const Wishlist = require("../models/wishlistModel");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

exports.GetWishListService = async (req) => {
	try {
		const userId = new ObjectId(req.user._id);
		const matchStage = { $match: { userId: userId } };

		const productJoinStage = {
			$lookup: {
				from: "products",
				localField: "productId",
				foreignField: "_id",
				as: "productData",
			},
		};
		const unwindProductData = { $unwind: "$productData" };

		const brandJoinStage = {
			$lookup: {
				from: "brands",
				localField: "productData.brandId",
				foreignField: "_id",
				as: "brand",
			},
		};
		const unwindBrand = { $unwind: "$brand" };

		const categoryJoinStage = {
			$lookup: {
				from: "categories",
				localField: "productData.categoryId",
				foreignField: "_id",
				as: "category",
			},
		};
		const unwindCategory = { $unwind: "$category" };

		const projectionStage = {
			$project: {
				_id: 0,
				userId: 0,
				createdAt: 0,
				updatedAt: 0,
				"productData._id": 0,
				"productData.categoryId": 0,
				"productData.brandId": 0,
				"productData.createdAt": 0,
				"productData.updatedAt": 0,
				"brand._id": 0,
				"brand.createdAt": 0,
				"brand.updatedAt": 0,
				"category._id": 0,
				"category.createdAt": 0,
				"category.updatedAt": 0,
			},
		};

		const wishListData = await Wishlist.aggregate([
			matchStage,
			productJoinStage,
			unwindProductData,
			brandJoinStage,
			unwindBrand,
			categoryJoinStage,
			unwindCategory,
			projectionStage,
		]);
		return wishListData;
	} catch (error) {
		return error;
	}
};

exports.SaveWishListService = async (req) => {
	try {
		const { productId } = req.body;
		const userId = req.user._id;

		await Wishlist.updateOne(
			{ userId: userId, productId: productId },
			{ userId: userId, productId: productId },
			{ upsert: true }
		);
		return "Wishlist Product Added Successfully";
	} catch (error) {
		return true;
	}
};

exports.RemoveWishListService = async (req) => {
	try {
		const { productId } = req.body;
		const userId = req.user._id;

		await Wishlist.deleteOne({ userId: userId, productId: productId });
		return "Wishlist Product Removed!";
	} catch (error) {
		return true;
	}
};
