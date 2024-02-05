const express = require("express");
const { requireLogIn } = require("../middlewares/authMiddlewares");
const {
	saveWishList,
	removeWishList,
	getWishList,
} = require("../controllers/wishListControllers");
const router = express.Router();

router.get("/get-wishlist", requireLogIn, getWishList);
router.post("/save-to-wishlist", requireLogIn, saveWishList);
router.delete("/remove-from-wishlist", requireLogIn, removeWishList);

module.exports = router;
