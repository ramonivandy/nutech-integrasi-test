const { Router } = require("express");
const router = Router();
const membershipController = require("../modules/membershipController");

router.post("/registration", membershipController.postRegistration);
router.post("/login", membershipController.postLogin);

module.exports = router;
