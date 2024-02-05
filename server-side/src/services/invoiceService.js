const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const Cart = require("../models/cartModel");
const UserProfile = require("../models/userProfileModel");
const User = require("../models/userModel");
const InvoiceProduct = require("../models/invoiceProductModel");
const Invoice = require("../models/invoiceModel");
const PaymentSetting = require("../models/paymentSettingModel");
const axios = require("axios");
const FormData = require("form-data");
const { paymentSettingIdLocal } = require("../../secrets");

exports.CalculateInvoiceService = async (req) => {
	try {
		const userId = new ObjectId(req.user._id);
		const databaseUser = await User.findById(userId);
		const userEmail = databaseUser.email;

		//* =============Step-1: Calculate Total Payable & Vat ==============

		const matchingStage = { $match: { userId: userId } };
		const productJoiningStage = {
			$lookup: {
				from: "products",
				localField: "productId",
				foreignField: "_id",
				as: "productData",
			},
		};
		const unwindProductData = { $unwind: "$productData" };

		const cartData = await Cart.aggregate([
			matchingStage,
			productJoiningStage,
			unwindProductData,
		]);

		let totalAmount = 0;

		cartData.forEach((data) => {
			let price;
			if (data?.productData?.discount) {
				price = parseFloat(data?.productData?.discountPrice);
			} else {
				price = parseFloat(data?.productData?.price);
			}
			totalAmount += parseFloat(data.qty) * price;
		});

		let vat = totalAmount * 0.5; //5%
		let payable = totalAmount + vat;

		//* ===========Step-2: Prepare Customer Details & Shipping Details ==========

		const profile = await UserProfile.aggregate([matchingStage]);

		let cus_details = `Name: ${profile[0].cus_name}, Email: ${userEmail}, Address: ${profile[0].cus_add}, Phone: ${profile[0].cus_phone},`;

		let ship_details = `Name: ${profile[0].ship_name}, City: ${profile[0].ship_city}, Address: ${profile[0].ship_add}, Phone: ${profile[0].ship_phone},`;

		//*================Step-3: Transaction & Other's ID ==============

		let tran_id =
			"tranId_" + Math.floor(100000000 + Math.random() * 900000000);

		//*================Step-4: Create Invoice ==============

		const createdInvoice = await Invoice.create({
			userId: userId,
			payable: payable,
			cus_details: cus_details,
			ship_details: ship_details,
			tran_id: tran_id,
			total: totalAmount,
			vat: vat,
		});

		//*================Step-5: Create Invoice Product==============

		const invoiceId = createdInvoice._id;
		let createdProductInvoice;

		cartData.forEach(async (data) => {
			createdProductInvoice = await InvoiceProduct.create({
				userId: userId,
				productId: data.productId,
				invoiceId: invoiceId,
				qty: data.qty,
				price: data.productData.discount
					? parseFloat(data.productData.discountPrice)
					: parseFloat(data.productData.price),
				color: data.color,
				size: data.size,
			});
		});

		//*===================Step-6: Remove Carts======================

		await Cart.deleteMany({ userId: userId });

		//*===================Step-7: Prepare SSL Payment======================

		const paymentSettings = await PaymentSetting.findOne({
			settingsId: paymentSettingIdLocal,
		});

		const form = new FormData();

		form.append("store_id", paymentSettings.store_id);
		form.append("store_passwd", paymentSettings.store_passwd);
		form.append("total_amount", payable.toString());
		form.append("currency", paymentSettings.currency);
		form.append("tran_id", tran_id);
		form.append("success_url", `${paymentSettings.success_url}/${tran_id}`);
		form.append("fail_url", `${paymentSettings.fail_url}/${tran_id}`);
		form.append("cancel_url", `${paymentSettings.cancel_url}/${tran_id}`);
		form.append("ipn_url", `${paymentSettings.ipn_url}/${tran_id}`);

		form.append("cus_name", profile[0].cus_name);
		form.append("cus_email", userEmail);
		form.append("cus_add1", profile[0].cus_add);
		form.append("cus_add2", profile[0].cus_add);
		form.append("cus_city", profile[0].cus_city);
		form.append("cus_postcode", profile[0].cus_postcode);
		form.append("cus_state", profile[0].cus_state);
		form.append("cus_country", profile[0].cus_country);
		form.append("cus_phone", profile[0].cus_phone);
		form.append("cus_fax", profile[0].cus_fax);

		form.append("shipping_method", "YES");
		form.append("ship_name", profile[0].ship_name);
		form.append("ship_add1", profile[0].ship_add);
		form.append("ship_add2", profile[0].ship_add);
		form.append("ship_city", profile[0].ship_city);
		form.append("ship_state", profile[0].ship_state);
		form.append("ship_postcode", profile[0].ship_postcode);
		form.append("ship_country", profile[0].ship_country);

		form.append("product_name", "MERN E-Tech Products");
		form.append("product_category", "Electronic Category");
		form.append("product_profile", "general, electronics");
		form.append("product_amount", "According to Invoice");

		const SSLRes = await axios.post(paymentSettings.init_url, form);

		return SSLRes.data;
	} catch (error) {
		return error;
	}
};

exports.PaymentSuccessService = async (req) => {
	try {
		const { tran_id } = req.params;
		await Invoice.updateOne(
			{ tran_id: tran_id },
			{ payment_status: "Success" }
		);
		return "Product Payment Paid Successfully";
	} catch (error) {
		return error;
	}
};

exports.PaymentFailService = async (req) => {
	try {
		const { tran_id } = req.params;
		await Invoice.updateOne(
			{ tran_id: tran_id },
			{ payment_status: "Failed" }
		);
		return "Product Payment Failed!";
	} catch (error) {
		return error;
	}
};

exports.PaymentCancelService = async (req) => {
	try {
		const { tran_id } = req.params;
		await Invoice.updateOne(
			{ tran_id: tran_id },
			{ payment_status: "Cancelled" }
		);
		return "Product Payment Cancelled!";
	} catch (error) {
		return error;
	}
};

exports.PaymentIPNService = async (req) => {
	try {
		const { tran_id } = req.params;
		const { status } = req.body;
		await Invoice.updateOne(
			{ tran_id: tran_id },
			{ payment_status: status }
		);
		return status;
	} catch (error) {
		return error;
	}
};

exports.InvoiceListService = async (req) => {
	try {
		const userId = req.user._id;

		const invoiceList = await Invoice.find({ userId: userId }).lean();

		return invoiceList;
	} catch (error) {
		return error;
	}
};

exports.InvoiceProductListService = async (req) => {
	try {
		const userId = new ObjectId(req.user._id);
		const invoiceId = new ObjectId(req.params.invoiceId);

		const matchingStage = {
			$match: { userId: userId, invoiceId: invoiceId },
		};
		const productJoiningStage = {
			$lookup: {
				from: "products",
				localField: "productId",
				foreignField: "_id",
				as: "productData",
			},
		};
		const unwindProductData = { $unwind: "$productData" };

		const invoiceProductList = await InvoiceProduct.aggregate([
			matchingStage,
			productJoiningStage,
			unwindProductData,
		]);
		return invoiceProductList;
	} catch (error) {
		return error;
	}
};
