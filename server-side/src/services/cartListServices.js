const createError = require("http-errors");
const Cart = require("../models/cartModel");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

exports.GetCartListService = async (req) => {
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

		const cartListData = await Cart.aggregate([
			matchStage,
			productJoinStage,
			unwindProductData,
			brandJoinStage,
			unwindBrand,
			categoryJoinStage,
			unwindCategory,
			projectionStage,
		]);

		return cartListData;
	} catch (error) {
		return error;
	}
};

exports.SaveToCartListService = async (req) => {
	try {
		const userId = req.user._id;
		const { productId, color, qty, size } = req.body;

		if (!productId || !color || !qty || !size) {
			throw createError(400, "Need All the Cart Details!");
		}

		await Cart.create({
			userId: userId,
			productId: productId,
			color: color,
			qty: qty,
			size: size,
		});

		return "Save to Cart Successfully!";
	} catch (error) {
		return error;
	}
};

exports.UpdateCartListService = async (req) => {
	try {
		const userId = req.user._id;
		const cartId = req.params.cartId;

		await Cart.updateOne(
			{ _id: cartId, userId: userId },
			{ $set: req.body }
		);

		return "Cart Item Updated Successfully!";
	} catch (error) {
		return error;
	}
};

exports.RemoveFromCartListService = async (req) => {
	try {
		const userId = req.user._id;
		const { productId, cartId } = req.body;

		await Cart.deleteOne({
			_id: cartId,
			userId: userId,
			productId: productId,
		});

		return "Cart Item Removed Successfully!";
	} catch (error) {
		return error;
	}
};
