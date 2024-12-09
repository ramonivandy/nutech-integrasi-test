const { Router } = require("express");
const router = Router();
const membershipController = require("../modules/membershipController");
const jwt = require("../helper/auth/index");
const upload = require("../helper/upload_files/index");

router.post("/registration", membershipController.postRegistration);
router.post("/login", membershipController.postLogin);

router.get("/profile", jwt.verifyToken, membershipController.getProfile);
router.put(
  "/profile/image",
  upload.single("file"),
  jwt.verifyToken,
  membershipController.updateProfileImage
);

module.exports = router;
