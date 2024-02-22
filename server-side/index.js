const { readdirSync } = require("fs");
const createError = require("http-errors");
const express = require("express");
const { ServerPort } = require("./secrets");
const Path = require("path");
const databaseConnection = require("./src/config/db");
const app = express();

//DevDependency Lib import
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const { errorResponse } = require("./src/helpers/responseHelpers");
const cookieParser = require("cookie-parser");

// Middlewares implement
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
	cors({
		origin: [
			"http://localhost:5173",
			"https://plainb-tech-commerce.vercel.app",
		],
		methods: "GET,PUT,POST,DELETE",
		// credentials: true,
	})
);
app.use(mongoSanitize());
app.use(hpp());
app.use(morgan("dev"));
app.use(cookieParser());

// Enable trust proxy
app.set("trust proxy", 1);

// Request Rate Limit
const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minutes
	max: 50, // limit each IP to 50 requests per windowMs
	message: "Too many requests from this IP",
});
app.use(limiter);

app.get("/", (req, res) => {
	res.send("Hey this is my API running 🥳");
});

//for multiple files in routes folder
readdirSync(Path.join(__dirname, "./src/routes")).map((router) => {
	app.use("/api/v1", require(Path.join(__dirname, `./src/routes/${router}`)));
});
//client error
app.use((req, res, next) => {
	next(createError(404, "Route not Found"));
});

//server error
app.use((err, req, res, next) => {
	return errorResponse(res, {
		statusCode: err.status,
		message: err.message,
	});
});

(async () => {
	await databaseConnection();
})();

app.listen(ServerPort || 8000, async () => {
	console.log(`Server is running at: http://localhost:${ServerPort}`);
});

module.exports = app;
