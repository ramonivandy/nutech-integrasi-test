const { Router } = require("express");
const router = Router();
const informationController = require("../modules/informationController");
const jwt = require("../helper/auth/index");
const upload = require("../helper/upload_files/index");

router.get("/banner", jwt.verifyToken, informationController.getBanner);
router.get("/services", jwt.verifyToken, informationController.getServices);

module.exports = router;
