const express = require("express");
const { requireLogIn } = require("../middlewares/authMiddlewares");
const {
	createInvoice,
	invoicetList,
	invoiceProductList,
	paymentSuccess,
	paymentCancel,
	paymentFail,
	paymentIPN,
} = require("../controllers/invoiceControllers");
const router = express.Router();

router.get("/create-invoice", requireLogIn, createInvoice);
router.get("/get-invoice-list", requireLogIn, invoicetList);
router.get(
	"/product-invoice-list/:invoiceId",
	requireLogIn,
	invoiceProductList
);

router.post("/payment-success/:tran_id", paymentSuccess);
router.post("/payment-cancel/:tran_id", paymentCancel);
router.post("/payment-fail/:tran_id", paymentFail);
router.post("/payment-ipn/:tran_id", paymentIPN);

module.exports = router;
