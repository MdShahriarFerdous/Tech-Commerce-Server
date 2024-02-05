const Brand = require("../models/brandModel");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const ProductSlider = require("../models/productSliderModel");
const Review = require("../models/reviewModel");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

exports.BrandListService = async (req, res) => {
	try {
		const brandLists = await Brand.find().lean();
		return brandLists;
	} catch (error) {
		return error;
	}
};

exports.CategoryListService = async (req, res) => {
	try {
		const categoryLists = await Category.find().lean();
		return categoryLists;
	} catch (error) {
		return error;
	}
};

exports.SliderListService = async (req, res) => {
	try {
		const sliderLists = await ProductSlider.find().lean();
		return sliderLists;
	} catch (error) {
		return error;
	}
};

exports.ListByBrandService = async (req, res) => {
	try {
		const brandId = new ObjectId(req.params.brandId);

		const matchStage = { $match: { brandId: brandId } };
		const joinWithBrandIdStage = {
			$lookup: {
				from: "brands", //database collection name (in plural)
				localField: "brandId", //product table field name
				foreignField: "_id",
				as: "brand", //in which name we want to see
			},
		};
		const joinWithCategoryIdStage = {
			$lookup: {
				from: "categories",
				localField: "categoryId",
				foreignField: "_id",
				as: "category",
			},
		};

		const unwindBrandStage = { $unwind: "$brand" };
		const unwindCategoryStage = { $unwind: "$category" };
		const projectionStage = {
			$project: {
				"brand._id": 0,
				"category._id": 0,
				categoryId: 0,
				brandId: 0,
				createdAt: 0,
				updatedAt: 0,
			},
		};

		const listedByBrandId = await Product.aggregate([
			matchStage,
			joinWithBrandIdStage,
			joinWithCategoryIdStage,
			unwindBrandStage,
			unwindCategoryStage,
			projectionStage,
		]);
		return listedByBrandId;
	} catch (error) {
		return error;
	}
};

exports.ListByCategoryService = async (req, res) => {
	try {
		const categoryId = new ObjectId(req.params.categoryId);

		const matchStage = { $match: { categoryId: categoryId } };
		const joinWithBrandIdStage = {
			$lookup: {
				from: "brands", //database collection name (in plural)
				localField: "brandId", //product table field name
				foreignField: "_id",
				as: "brand", //in which name we want to see
			},
		};
		const joinWithCategoryIdStage = {
			$lookup: {
				from: "categories",
				localField: "categoryId",
				foreignField: "_id",
				as: "category",
			},
		};

		const unwindBrandStage = { $unwind: "$brand" };
		const unwindCategoryStage = { $unwind: "$category" };
		const projectionStage = {
			$project: {
				"brand._id": 0,
				"category._id": 0,
				categoryId: 0,
				brandId: 0,
				createdAt: 0,
				updatedAt: 0,
			},
		};

		const listedByCategoryId = await Product.aggregate([
			matchStage,
			joinWithBrandIdStage,
			joinWithCategoryIdStage,
			unwindBrandStage,
			unwindCategoryStage,
			projectionStage,
		]);
		return listedByCategoryId;
	} catch (error) {
		return error;
	}
};

exports.ListByRemarkService = async (req, res) => {
	try {
		const { remark } = req.params;

		const matchStage = { $match: { remark: remark } };
		const joinWithBrandIdStage = {
			$lookup: {
				from: "brands", //database collection name (in plural)
				localField: "brandId", //product table field name
				foreignField: "_id",
				as: "brand", //in which name we want to see
			},
		};
		const joinWithCategoryIdStage = {
			$lookup: {
				from: "categories",
				localField: "categoryId",
				foreignField: "_id",
				as: "category",
			},
		};

		const unwindBrandStage = { $unwind: "$brand" };
		const unwindCategoryStage = { $unwind: "$category" };
		const projectionStage = {
			$project: {
				"brand._id": 0,
				"category._id": 0,
				categoryId: 0,
				brandId: 0,
				createdAt: 0,
				updatedAt: 0,
			},
		};

		const listedByRemark = await Product.aggregate([
			matchStage,
			joinWithBrandIdStage,
			joinWithCategoryIdStage,
			unwindBrandStage,
			unwindCategoryStage,
			projectionStage,
		]);
		return listedByRemark;
	} catch (error) {
		return error;
	}
};

exports.ListBySimilarService = async (req, res) => {
	try {
		const categoryId = new ObjectId(req.params.categoryId);

		const matchStage = { $match: { categoryId: categoryId } };
		const limitStage = { $limit: 6 };

		const joinWithBrandIdStage = {
			$lookup: {
				from: "brands", //database collection name (in plural)
				localField: "brandId", //product table field name
				foreignField: "_id",
				as: "brand", //in which name we want to see
			},
		};
		const joinWithCategoryIdStage = {
			$lookup: {
				from: "categories",
				localField: "categoryId",
				foreignField: "_id",
				as: "category",
			},
		};

		const unwindBrandStage = { $unwind: "$brand" };
		const unwindCategoryStage = { $unwind: "$category" };
		const projectionStage = {
			$project: {
				"brand._id": 0,
				"category._id": 0,
				categoryId: 0,
				brandId: 0,
				createdAt: 0,
				updatedAt: 0,
			},
		};

		const listedBySimilarProduct = await Product.aggregate([
			matchStage,
			limitStage,
			joinWithBrandIdStage,
			joinWithCategoryIdStage,
			unwindBrandStage,
			unwindCategoryStage,
			projectionStage,
		]);
		return listedBySimilarProduct;
	} catch (error) {
		return error;
	}
};

exports.DetailShowService = async (req, res) => {
	try {
		const productId = new ObjectId(req.params.productId);
		const matchStage = { $match: { _id: productId } };

		const joinWithBrandIdStage = {
			$lookup: {
				from: "brands", //database collection name (in plural)
				localField: "brandId", //product table field name
				foreignField: "_id",
				as: "brand", //in which name we want to see
			},
		};
		const joinWithCategoryIdStage = {
			$lookup: {
				from: "categories",
				localField: "categoryId",
				foreignField: "_id",
				as: "category",
			},
		};
		const joinWithProductDetailStage = {
			$lookup: {
				from: "productdetails",
				localField: "_id",
				foreignField: "productId",
				as: "productDetails",
			},
		};

		const unwindBrandStage = { $unwind: "$brand" };
		const unwindCategoryStage = { $unwind: "$category" };
		const unwindDetailStage = { $unwind: "$productDetails" };

		const projectionStage = {
			$project: {
				"brand._id": 0,
				"category._id": 0,
				categoryId: 0,
				brandId: 0,
				createdAt: 0,
				updatedAt: 0,
			},
		};

		const productDetails = await Product.aggregate([
			matchStage,
			joinWithBrandIdStage,
			joinWithCategoryIdStage,
			joinWithProductDetailStage,
			unwindBrandStage,
			unwindCategoryStage,
			unwindDetailStage,
			projectionStage,
		]);
		return productDetails;
	} catch (error) {
		return error;
	}
};

exports.SearchByKeywordService = async (req, res) => {
	try {
		const { keyword } = req.params;

		const searchRegex = { $regex: keyword, $options: "i" };
		const searchParams = [
			{ title: searchRegex },
			{ shortDes: searchRegex },
			{ remark: searchRegex },
		];
		const searchQuery = { $or: searchParams };

		const matchStage = { $match: searchQuery };

		const joinWithBrandIdStage = {
			$lookup: {
				from: "brands", //database collection name (in plural)
				localField: "brandId", //product table field name
				foreignField: "_id",
				as: "brand", //in which name we want to see
			},
		};
		const joinWithCategoryIdStage = {
			$lookup: {
				from: "categories",
				localField: "categoryId",
				foreignField: "_id",
				as: "category",
			},
		};

		const unwindBrandStage = { $unwind: "$brand" };
		const unwindCategoryStage = { $unwind: "$category" };
		const projectionStage = {
			$project: {
				"brand._id": 0,
				"category._id": 0,
				categoryId: 0,
				brandId: 0,
				createdAt: 0,
				updatedAt: 0,
			},
		};

		const searchedProduct = await Product.aggregate([
			matchStage,
			joinWithBrandIdStage,
			joinWithCategoryIdStage,
			unwindBrandStage,
			unwindCategoryStage,
			projectionStage,
		]);
		return searchedProduct;
	} catch (error) {
		return error;
	}
};

exports.ReviewListService = async (req, res) => {
	try {
		const productId = new ObjectId(req.params.productId);
		const matchStage = { $match: { productId: productId } };

		const joinWithUserProfileStage = {
			$lookup: {
				from: "userprofiles", //database collection name (in plural)
				localField: "userId", //product table field name
				foreignField: "userId",
				as: "userProfile", //in which name we want to see
			},
		};

		const projectionStage = {
			$project: {
				des: 1,
				rating: 1,
				"userProfile.cus_name": 1,
			},
		};

		const unwindUserStage = { $unwind: "$userProfile" };

		const productReviewList = Review.aggregate([
			matchStage,
			joinWithUserProfileStage,
			projectionStage,
			unwindUserStage,
		]);

		return productReviewList;
	} catch (error) {
		return error;
	}
};

exports.CreateReviewService = async (req) => {
	try {
		const { des, rating, productId } = req.body;
		const userId = req.user._id;

		const createdReview = await new Review({
			userId: userId,
			productId,
			des,
			rating,
		}).save();
		return createdReview;
	} catch (error) {
		return error;
	}
};
