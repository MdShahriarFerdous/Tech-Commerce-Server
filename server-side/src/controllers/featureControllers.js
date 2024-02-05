const features = require("../../data/features");
const { successResponse } = require("../helpers/responseHelpers");
const Feature = require("../models/featureModel");
const { FeatureListService } = require("../services/featureServices");

exports.createFeatures = async (req, res, next) => {
	try {
		await Feature.deleteMany({});

		const featureLists = await Feature.insertMany(features);

		res.status(201).json({
			status: "Success",
			featureLists,
		});
	} catch (error) {
		next(error);
	}
};

exports.featureList = async (req, res, next) => {
	try {
		const featureListData = await FeatureListService(req);

		return successResponse(res, {
			statusCode: 200,
			message: "Feature List Data Returend Successfully",
			payload: { featureListData },
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};
