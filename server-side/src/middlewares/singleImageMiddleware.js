const multer = require("multer");

exports.upload = (fieldName, folderName) => async (req, res, next) => {
	try {
		const storage = multer.diskStorage({
			destination: function (req, file, cb) {
				cb(null, `./uploads${folderName ? "/" + folderName : ""}`);
			},
			filename: function (req, file, cb) {
				const uniqueSuffix =
					Date.now() + "-" + Math.round(Math.random() * 1e9);
				cb(null, `${uniqueSuffix}${file.originalname}`);
			},
		});

		const upload = multer({
			storage: storage,
			limits: {
				fileSize: 10 * 1024 * 1024, // 10 MB in bytes
			},
			fileFilter: (req, file, cb) => {
				const allowedMimeTypes = [
					"image/jpeg",
					"image/jpg",
					"image/png",
				];
				if (allowedMimeTypes.includes(file.mimetype)) {
					cb(null, true);
				} else {
					res.send(
						"Invalid file type. Only JPEG, JPG, and PNG images are allowed."
					);
					cb(
						new Error(
							"Invalid file type. Only JPEG, JPG, and PNG images are allowed."
						)
					);
				}
			},
		}).single(fieldName);

		upload(req, res, (err) => {
			if (err instanceof multer.MulterError) {
				console.error(err);
				res.send(`${fieldName} Upload Fail`);
			} else if (err) {
				console.error(err);
				res.send("An unknown error occurred");
			} else {
				next();
			}
		});
	} catch (error) {
		res.json(error.message);
	}
};
