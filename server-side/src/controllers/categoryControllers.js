const categories = require("../../data/categories");
const Category = require("../models/categoryModel");

exports.createCategories = async (req, res, next) => {
	try {
		await Category.deleteMany({});

		const categoryLists = await Category.insertMany(categories);

		res.status(201).json({
			status: "Success",
			categoryLists,
		});
	} catch (error) {
		next(error);
	}
};
