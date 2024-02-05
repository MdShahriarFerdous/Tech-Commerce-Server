const express = require("express");
const { featureList } = require("../controllers/featureControllers");
const router = express.Router();

router.get("/get-feature-list", featureList);

module.exports = router;
