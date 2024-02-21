const ProductDetail = require("../models/productDetailModel");
const Product = require("../models/productModel");
const ProductSlider = require("../models/productSliderModel");
const brands = require("../../data/brands");
const users = require("../../data/users");
const Brand = require("../models/brandModel");
const {
	BrandListService,
	CategoryListService,
	SliderListService,
	ListByBrandService,
	ListByCategoryService,
	ListBySimilarService,
	SearchByKeywordService,
	ListByRemarkService,
	ReviewListService,
	CreateReviewService,
	DetailShowService,
	filterProductService,
} = require("../services/productServices");
const { successResponse } = require("../helpers/responseHelpers");
const User = require("../models/userModel");

//*=================Seeding-Controllers===================
exports.createProduct = async (req, res, next) => {
	try {
		// const {categoryId, brandId, title, shortDes, price, discount, discountPrice, image, star, stock, remark } = req.body;

		const createdProduct = await Product.create(req.body);

		res.status(201).json({
			status: "Success",
			createdProduct,
		});
	} catch (error) {
		next(error);
	}
};

exports.createProductSlider = async (req, res, next) => {
	try {
		// const {categoryId, brandId, title, shortDes, price, discount, discountPrice, image, star, stock, remark } = req.body;

		const createdProductSlider = await ProductSlider.create(req.body);

		res.status(201).json({
			status: "Success",
			createdProductSlider,
		});
	} catch (error) {
		next(error);
	}
};

exports.createProductDetails = async (req, res, next) => {
	try {
		// const {categoryId, brandId, title, shortDes, price, discount, discountPrice, image, star, stock, remark } = req.body;

		const createdProductDetails = await ProductDetail.create(req.body);

		res.status(201).json({
			status: "Success",
			createdProductDetails,
		});
	} catch (error) {
		next(error);
	}
};

exports.createBrand = async (req, res, next) => {
	try {
		await Brand.deleteMany({});

		const brandLists = await Brand.insertMany(brands);

		res.status(201).json({
			status: "Success",
			brandLists,
		});
	} catch (error) {
		next(error);
	}
};

//*=================Functional-Controllers===================
//client--> data.payload.brandLists = []
exports.productBrandList = async (req, res, next) => {
	try {
		const brandLists = await BrandListService();

		return successResponse(res, {
			statusCode: 200,
			message: "Brand lists return successfully",
			payload: {
				brandLists,
			},
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

exports.productCategoryList = async (req, res, next) => {
	try {
		const categoryLists = await CategoryListService();

		return successResponse(res, {
			statusCode: 200,
			message: "Category lists return successfully",
			payload: {
				categoryLists,
			},
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

exports.productSliderList = async (req, res, next) => {
	try {
		const sliderLists = await SliderListService();

		return successResponse(res, {
			statusCode: 200,
			message: "Slider lists return successfully",
			payload: {
				sliderLists,
			},
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

exports.productListByBrand = async (req, res, next) => {
	try {
		const listedByBrandId = await ListByBrandService(req);

		return successResponse(res, {
			statusCode: 200,
			message: "Product list by brand return successfully",
			payload: {
				listedByBrandId,
			},
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

exports.productListByCategory = async (req, res, next) => {
	try {
		const listedByCategoryId = await ListByCategoryService(req);

		return successResponse(res, {
			statusCode: 200,
			message: "Product list by category return successfully",
			payload: {
				listedByCategoryId,
			},
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

exports.productListBySimilar = async (req, res, next) => {
	try {
		const listedBySimilarProduct = await ListBySimilarService(req);

		return successResponse(res, {
			statusCode: 200,
			message: "Similar product list return successfully",
			payload: {
				listedBySimilarProduct,
			},
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

exports.productSearchByKeyword = async (req, res, next) => {
	try {
		const searchedProduct = await SearchByKeywordService(req);

		return successResponse(res, {
			statusCode: 200,
			message: "Search product return successfully",
			payload: {
				searchedProduct,
			},
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

exports.productListByRemark = async (req, res, next) => {
	try {
		const listedByRemark = await ListByRemarkService(req);

		return successResponse(res, {
			statusCode: 200,
			message: "Product list by remark return successfully",
			payload: {
				listedByRemark,
			},
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

exports.productReviewList = async (req, res, next) => {
	try {
		const productReviewList = await ReviewListService(req);

		return successResponse(res, {
			statusCode: 200,
			message: "Review list fetched successfully",
			payload: {
				productReviewList,
			},
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

exports.createProductReview = async (req, res, next) => {
	try {
		const createdReview = await CreateReviewService(req);

		return successResponse(res, {
			statusCode: 201,
			message: "Product review created successfully",
			payload: {
				createdReview,
			},
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

exports.productDetailsShow = async (req, res, next) => {
	try {
		const productDetails = await DetailShowService(req);

		return successResponse(res, {
			statusCode: 200,
			message: "Product detail return successfully",
			payload: {
				productDetails,
			},
		});
	} catch (error) {
		next(error);
	}
};

exports.filteredProductList = async (req, res, next) => {
	try {
		const filteredProduct = await filterProductService(req);

		return successResponse(res, {
			statusCode: 200,
			message: "Filtered Product return successfully",
			payload: {
				filteredProduct,
			},
		});
	} catch (error) {
		next(error);
	}
};
