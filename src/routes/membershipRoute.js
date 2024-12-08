const { Router } = require("express");
const router = Router();
const membershipController = require("../modules/membershipController");
const jwt = require("../helper/auth/index");

router.post("/registration", membershipController.postRegistration);
router.post("/login", membershipController.postLogin);

router.get("/profile", jwt.verifyToken, membershipController.getProfile);

module.exports = router;
