const express = require("express");
const {
	productBrandList,
	productCategoryList,
	productSliderList,
	productListByBrand,
	productListByCategory,
	productListBySimilar,
	productSearchByKeyword,
	productListByRemark,
	productDetailsShow,
	productReviewList,
	createProductReview,
	filteredProductList,
} = require("../controllers/productControllers");
const { requireLogIn } = require("../middlewares/authMiddlewares");

const router = express.Router();

router.get("/product-brand-list", productBrandList);
router.get("/product-category-list", productCategoryList);
router.get("/product-slider-list", productSliderList);
router.get("/product-list-by-brand/:brandId", productListByBrand);
router.get("/product-list-by-category/:categoryId", productListByCategory);
router.get("/product-list-by-similar/:categoryId", productListBySimilar);
router.get("/product-list-by-remark/:remark", productListByRemark);
router.get("/product-search-by-keyword/:keyword", productSearchByKeyword);
router.get("/product-details/:productId", productDetailsShow);
router.get("/product-review-list/:productId", productReviewList);
router.post("/create-product-review", requireLogIn, createProductReview);
router.post("/product-list-by-filter", filteredProductList);

module.exports = router;
