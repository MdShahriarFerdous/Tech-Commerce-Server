const Feature = require("../models/featureModel");

exports.FeatureListService = async (req) => {
	try {
		const featureListData = await Feature.find().lean();
		return featureListData;
	} catch (error) {
		return error;
	}
};
