//Config Lib import and configured
require("dotenv").config();
const ServerPort = process.env.SERVER_PORT || process.env.PORT;
const MongoDBConnectionPort = process.env.MONGO_DB_CONNECTION;

const cloudinaryFolder = process.env.CLOUDINARY_FOLDER_NAME || "tech-ecom";
const cloudinaryName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryAPIKey = process.env.CLOUDINARY_API_KEY;
const cloudinarySecretKey = process.env.CLOUDINARY_API_SECRET_KEY;

const smtpUsername = process.env.SMTP_USERNAME;
const smtpPassword = process.env.SMTP_PASSWORD;

const registerVerifySecretKey = process.env.REGISTER_VERIFY_SECRET_KEY;
const registerVerifyExpTime = process.env.REGISTER_VERIFY_EXPIRATION_TIME;

const jwtAccessTokenSecretKey = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
const jwtAccessTokenExpTime = process.env.JWT_ACCESS_TOKEN_EXP_TIME;

const jwtRefreshTokenSecretKey = process.env.JWT_REFRESH_TOKEN_SECRET_KEY;
const jwtRefreshTokenExpTime = process.env.JWT_REFRESH_TOKEN_EXP_TIME;

const paymentSettingIdLocal = process.env.PAYMENT__SETTINGS_ID_LOCAL;
const paymentSettingIdLive = process.env.PAYMENT__SETTINGS_ID_LIVE;

const corsLocalPort = process.env.LOCAL_PORT_FOR_CORS;

module.exports = {
	ServerPort,
	MongoDBConnectionPort,
	cloudinaryFolder,
	cloudinaryName,
	cloudinarySecretKey,
	cloudinaryAPIKey,
	smtpUsername,
	smtpPassword,
	registerVerifySecretKey,
	registerVerifyExpTime,
	jwtAccessTokenSecretKey,
	jwtAccessTokenExpTime,
	jwtRefreshTokenSecretKey,
	jwtRefreshTokenExpTime,
	paymentSettingIdLocal,
	paymentSettingIdLive,
};
