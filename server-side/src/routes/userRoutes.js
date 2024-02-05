const express = require("express");
const {
	register,
	resendOTP,
	userVerify,
	userLogin,
	userLogout,
	userContextData,
	updateProfileImage,
	updateProfile,
	updateUser,
	readProfile,
} = require("../controllers/userControllers");
const {
	checkLoggedOut,
	checkLoggedIn,
	requireLogIn,
	isProtected,
} = require("../middlewares/authMiddlewares");
const { upload } = require("../middlewares/singleImageMiddleware");
const router = express.Router();

router.post("/user-register", register);
router.get("/resend-otp/:username/:email/:password", resendOTP);
router.post("/user-verify", userVerify);
router.post("/user-login", checkLoggedOut, userLogin);
router.get("/user-logout", checkLoggedIn, userLogout);
//data.status = "Protected", data.message= "Has Token" --> in frontend
router.get("/user-context-data", isProtected, userContextData);

router.put(
	"/update-profile-image",
	requireLogIn,
	upload("profileImage", "user"),
	updateProfileImage
);

router.put("/update-profile", requireLogIn, updateProfile);
router.put("/update-user", requireLogIn, updateUser);
router.get("/get-user-profile", requireLogIn, readProfile);

module.exports = router;
