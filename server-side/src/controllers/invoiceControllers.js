const { successResponse } = require("../helpers/responseHelpers");
const PaymentSetting = require("../models/paymentSettingModel");
const {
	CalculateInvoiceService,
	InvoiceProductListService,
	PaymentSuccessService,
	PaymentIPNService,
	PaymentCancelService,
	PaymentFailService,
	InvoiceListService,
} = require("../services/invoiceService");

exports.createPaymentSettings = async (req, res, next) => {
	try {
		const {
			settingsId,
			storeId,
			storePass,
			currency,
			successURL,
			failURL,
			cancelURL,
			ipnURL,
			initURL,
		} = req.body;

		const createdPaymentSettings = await PaymentSetting.create({
			settingsId: settingsId,
			store_id: storeId,
			store_passwd: storePass,
			currency: currency,
			success_url: successURL,
			fail_url: failURL,
			cancel_url: cancelURL,
			ipn_url: ipnURL,
			init_url: initURL,
		});
		return successResponse(res, {
			statusCode: 201,
			message: "Payment Settings Created Successfully!",
			payload: {
				createdPaymentSettings,
			},
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

exports.createInvoice = async (req, res, next) => {
	try {
		const SSLRes = await CalculateInvoiceService(req);

		return successResponse(res, {
			statusCode: 201,
			message: "Calculated and Created Invoice Successfully",
			payload: {
				SSLRes,
			},
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

exports.paymentSuccess = async (req, res, next) => {
	try {
		const successMessage = await PaymentSuccessService(req);
		return successResponse(res, {
			statusCode: 200,
			message: successMessage,
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

exports.paymentFail = async (req, res, next) => {
	try {
		const failMessage = await PaymentFailService(req);
		return res.json({ status: "fail", message: failMessage });
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

exports.paymentCancel = async (req, res, next) => {
	try {
		const cancelMessage = await PaymentCancelService(req);
		return res.json({ status: "Cancelled", message: cancelMessage });
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

exports.paymentIPN = async (req, res, next) => {
	try {
		const IPNMessage = await PaymentIPNService(req);
		return successResponse(res, {
			statusCode: 200,
			message: IPNMessage,
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

exports.invoicetList = async (req, res, next) => {
	try {
		const invoiceListData = await InvoiceListService(req);
		return successResponse(res, {
			statusCode: 200,
			message: "Here is the list of user's invoice",
			payload: { invoiceListData },
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

exports.invoiceProductList = async (req, res, next) => {
	try {
		const invoiceProductListData = await InvoiceProductListService(req);
		return successResponse(res, {
			statusCode: 200,
			message: "Invoice Product List Returend Successfully",
			payload: { invoiceProductListData },
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};
