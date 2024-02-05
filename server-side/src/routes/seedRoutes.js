const express = require("express");
const { createCategories } = require("../controllers/categoryControllers");
const { createFeatures } = require("../controllers/featureControllers");
const {
	createUsers,
	createUserProfile,
} = require("../controllers/userControllers");
const {
	createProduct,
	createProductSlider,
	createProductDetails,
	createBrand,
} = require("../controllers/productControllers");
const { createPaymentSettings } = require("../controllers/invoiceControllers");

const router = express.Router();

router.get("/create-brands", createBrand);
router.get("/create-categories", createCategories);
router.get("/create-features", createFeatures);
router.get("/create-users", createUsers);
router.post("/create-user-profile/:userId", createUserProfile);
router.post("/create-product", createProduct);
router.post("/create-product-slider", createProductSlider);
router.post("/create-product-detail", createProductDetails);
router.post("/create-payment-settings", createPaymentSettings);

module.exports = router;
