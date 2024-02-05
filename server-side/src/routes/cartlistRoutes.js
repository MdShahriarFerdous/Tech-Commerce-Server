const express = require("express");
const { requireLogIn } = require("../middlewares/authMiddlewares");
const {
	saveToCartList,
	removeFromCartList,
	getCartList,
	updateCartList,
} = require("../controllers/cartListControllers");

const router = express.Router();

router.get("/get-cartlist", requireLogIn, getCartList);
router.post("/save-to-cartlist", requireLogIn, saveToCartList);
router.put("/update-cartlist/:cartId", requireLogIn, updateCartList);
router.delete("/remove-from-cartlist", requireLogIn, removeFromCartList);

module.exports = router;
